const express = require('express');
const router = express.Router();
const { driver } = require('../db/neo4j');

async function fetchCurrentWeatherSeverity() {
  try {
    // Guwahati coordinates
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=26.1445&longitude=91.7362&current_weather=true');
    const data = await response.json();
    const code = data.current_weather.weathercode;
    
    // Map WMO Weather interpretation codes to severity (0-10)
    if (code >= 95) return 10; // Thunderstorm
    if (code >= 80) return 8;  // Rain showers
    if (code >= 61 && code <= 67) return 7; // Rain
    if (code >= 51 && code <= 57) return 5; // Drizzle
    if (code === 45 || code === 48) return 4; // Fog
    return 1; // Clear / Cloudy
  } catch (error) {
    console.error("Weather API failed, defaulting to 2", error);
    return 2;
  }
}

router.post('/calculate', async (req, res) => {
  const { startNode, endNode } = req.body;
  const session = driver.session();

  try {
    // 1. Get all roads
    const result = await session.run(`
      MATCH (a:Location)-[r:CONNECTED_TO]->(b:Location)
      RETURN DISTINCT r.road_id AS id, r.historical_incidents AS incidents, r.road_quality AS quality
    `);

    const roads = result.records.map(record => ({
      id: record.get('id'),
      incidents: record.get('incidents'),
      quality: record.get('quality')
    }));

    // 2. Automatically Fetch Live Weather & ML Risk predictions
    const severity = await fetchCurrentWeatherSeverity();
    
    for (let road of roads) {
      try {
        const mlResponse = await fetch('http://localhost:8000/predict_risk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            road_id: road.id,
            weather_severity: severity,
            historical_incidents: road.incidents,
            road_quality: road.quality
          })
        });
        const mlData = await mlResponse.json();
        
        // 3. Update Neo4j graph with new weights
        await session.run(`
          MATCH ()-[r:CONNECTED_TO {road_id: $roadId}]->()
          SET r.current_time = r.base_time * $multiplier
        `, {
          roadId: road.id,
          multiplier: mlData.risk_multiplier
        });
      } catch (err) {
        console.error(`Failed to update risk for road ${road.id}`, err);
      }
    }

    // 4. Recalculate GDS Graph Projection
    // We need to mutate the graph projection to use the updated properties
    await session.run(`
      CALL gds.graph.drop('roadNetwork', false) YIELD graphName;
    `);
    
    await session.run(`
      CALL gds.graph.project(
        'roadNetwork',
        'Location',
        'CONNECTED_TO',
        {
            relationshipProperties: 'current_time'
        }
      )
    `);

    // 5. Calculate Shortest Path using Dijkstra
    const pathResult = await session.run(`
      MATCH (source:Location {id: $startNode}), (target:Location {id: $endNode})
      CALL gds.shortestPath.dijkstra.stream('roadNetwork', {
        sourceNode: source,
        targetNode: target,
        relationshipWeightProperty: 'current_time'
      })
      YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs, path
      RETURN
        totalCost,
        [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS nodeNames,
        [nodeId IN nodeIds | gds.util.asNode(nodeId).lat] AS lats,
        [nodeId IN nodeIds | gds.util.asNode(nodeId).lng] AS lngs
    `, { startNode, endNode });

    if (pathResult.records.length === 0) {
      return res.status(404).json({ error: "No path found." });
    }

    const record = pathResult.records[0];
    const totalCost = record.get('totalCost');
    const nodeNames = record.get('nodeNames');
    const lats = record.get('lats');
    const lngs = record.get('lngs');

    // Format for frontend
    const coordinates = lats.map((lat, i) => ({ lat, lng: lngs[i], name: nodeNames[i] }));

    res.json({
      startNode,
      endNode,
      totalTimeMinutes: Math.round(totalCost),
      route: coordinates,
      weatherSeverity: severity
    });

  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(500).json({ error: 'Failed to calculate optimal route' });
  } finally {
    await session.close();
  }
});

module.exports = router;
