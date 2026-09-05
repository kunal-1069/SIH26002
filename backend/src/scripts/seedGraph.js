const { driver, closeDriver } = require('../db/neo4j');

const seedData = async () => {
  const session = driver.session();
  try {
    console.log("Seeding Neo4j Graph Database with road network...");
    
    // Clear existing data
    await session.run('MATCH (n) DETACH DELETE n');

    // Create Intersections (Nodes) around Guwahati
    const nodes = [
      { id: 'A', name: 'Jalukbari', lat: 26.1550, lng: 91.6600 },
      { id: 'B', name: 'Maligaon', lat: 26.1570, lng: 91.7000 },
      { id: 'C', name: 'Paltan Bazaar', lat: 26.1750, lng: 91.7500 },
      { id: 'D', name: 'Ganeshguri', lat: 26.1450, lng: 91.7900 },
      { id: 'E', name: 'Six Mile', lat: 26.1350, lng: 91.8100 },
      { id: 'F', name: 'Khanapara', lat: 26.1200, lng: 91.8200 },
      { id: 'G', name: 'Beltola', lat: 26.1250, lng: 91.7950 }
    ];

    for (let node of nodes) {
      await session.run(
        `CREATE (l:Location { id: $id, name: $name, lat: $lat, lng: $lng })`,
        node
      );
    }

    // Create Roads (Relationships)
    // distance is in km, base_time in minutes, road_quality 1-5, historical_incidents count
    const edges = [
      { from: 'A', to: 'B', distance: 4.5, base_time: 15, quality: 4, incidents: 1, id: 'R_AB' },
      { from: 'B', to: 'C', distance: 6.0, base_time: 25, quality: 3, incidents: 5, id: 'R_BC' },
      { from: 'C', to: 'D', distance: 5.5, base_time: 20, quality: 4, incidents: 2, id: 'R_CD' },
      { from: 'D', to: 'E', distance: 2.5, base_time: 10, quality: 5, incidents: 0, id: 'R_DE' },
      { from: 'E', to: 'F', distance: 2.0, base_time: 8, quality: 5, incidents: 0, id: 'R_EF' },
      { from: 'D', to: 'G', distance: 3.0, base_time: 12, quality: 2, incidents: 10, id: 'R_DG' }, // High incidents
      { from: 'G', to: 'F', distance: 3.5, base_time: 15, quality: 3, incidents: 4, id: 'R_GF' },
      { from: 'A', to: 'C', distance: 10.0, base_time: 35, quality: 4, incidents: 2, id: 'R_AC' } // Bypass
    ];

    for (let edge of edges) {
      await session.run(
        `
        MATCH (a:Location {id: $from}), (b:Location {id: $to})
        CREATE (a)-[:CONNECTED_TO {
          road_id: $id,
          distance: $distance, 
          base_time: $base_time, 
          current_time: $base_time,
          road_quality: $quality,
          historical_incidents: $incidents
        }]->(b)
        CREATE (b)-[:CONNECTED_TO {
          road_id: $id,
          distance: $distance, 
          base_time: $base_time, 
          current_time: $base_time,
          road_quality: $quality,
          historical_incidents: $incidents
        }]->(a)
        `,
        edge
      );
    }
    
    // Create GDS graph projection for routing
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
      ) YIELD graphName, nodeCount, relationshipCount;
    `);

    console.log("Graph seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding graph:", err);
  } finally {
    await session.close();
    await closeDriver();
  }
};

seedData();
