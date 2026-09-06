const { driver, closeDriver } = require('../db/neo4j');

const seedData = async () => {
  const session = driver.session();
  try {
    console.log("Seeding Neo4j Graph Database with comprehensive Seven Sister States (NER) Highway Network...");
    
    // Clear existing graph
    await session.run('MATCH (n) DETACH DELETE n');

    // Hubs across ALL SEVEN SISTER STATES (+ Sikkim)
    const nodes = [
      // 1. ASSAM (Gateway & Central Hubs)
      { id: 'GAU', name: 'Guwahati (Assam)', state: 'Assam', lat: 26.1445, lng: 91.7362 },
      { id: 'NAG', name: 'Nagaon (Assam)', state: 'Assam', lat: 26.3464, lng: 92.6840 },
      { id: 'TEZ', name: 'Tezpur (Assam)', state: 'Assam', lat: 26.6528, lng: 92.7926 },
      { id: 'JOR', name: 'Jorhat (Assam)', state: 'Assam', lat: 26.7509, lng: 94.2037 },
      { id: 'DIB', name: 'Dibrugarh (Assam)', state: 'Assam', lat: 27.4728, lng: 94.9120 },
      { id: 'SIL', name: 'Silchar (Assam)', state: 'Assam', lat: 24.8333, lng: 92.7789 },
      { id: 'HAF', name: 'Haflong (Assam)', state: 'Assam', lat: 25.1706, lng: 93.0177 },

      // 2. MEGHALAYA (Abode of Clouds)
      { id: 'SHL', name: 'Shillong (Meghalaya)', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
      { id: 'CHEP', name: 'Cherrapunji / Sohra (Meghalaya)', state: 'Meghalaya', lat: 25.2702, lng: 91.7323 },
      { id: 'JOW', name: 'Jowai (Meghalaya)', state: 'Meghalaya', lat: 25.4544, lng: 92.2033 },
      { id: 'TURA', name: 'Tura (Meghalaya)', state: 'Meghalaya', lat: 25.5144, lng: 90.2033 },

      // 3. ARUNACHAL PRADESH (Land of Dawn-lit Mountains)
      { id: 'ITA', name: 'Itanagar (Arunachal)', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053 },
      { id: 'BOM', name: 'Bomdila (Arunachal)', state: 'Arunachal Pradesh', lat: 27.2645, lng: 92.4231 },
      { id: 'TAW', name: 'Tawang (Arunachal)', state: 'Arunachal Pradesh', lat: 27.5861, lng: 91.8594 },
      { id: 'PSG', name: 'Pasighat (Arunachal)', state: 'Arunachal Pradesh', lat: 28.0664, lng: 95.3267 },

      // 4. NAGALAND (Land of Festivals)
      { id: 'DIM', name: 'Dimapur (Nagaland)', state: 'Nagaland', lat: 25.9095, lng: 93.7266 },
      { id: 'KOH', name: 'Kohima (Nagaland)', state: 'Nagaland', lat: 25.6751, lng: 94.1086 },
      { id: 'MOK', name: 'Mokokchung (Nagaland)', state: 'Nagaland', lat: 26.3267, lng: 94.5211 },

      // 5. MANIPUR (Jeweled Land)
      { id: 'SEN', name: 'Senapati (Manipur)', state: 'Manipur', lat: 25.2680, lng: 94.0180 },
      { id: 'IMP', name: 'Imphal (Manipur)', state: 'Manipur', lat: 24.8170, lng: 93.9368 },
      { id: 'CHU', name: 'Churachandpur (Manipur)', state: 'Manipur', lat: 24.3333, lng: 93.6833 },

      // 6. MIZORAM (Land of Hill People)
      { id: 'KOL', name: 'Kolasib (Mizoram)', state: 'Mizoram', lat: 24.2246, lng: 92.6780 },
      { id: 'AIZ', name: 'Aizawl (Mizoram)', state: 'Mizoram', lat: 23.7271, lng: 92.7176 },
      { id: 'LUN', name: 'Lunglei (Mizoram)', state: 'Mizoram', lat: 22.8671, lng: 92.7651 },

      // 7. TRIPURA (Land of Palaces & Heritage)
      { id: 'DHM', name: 'Dharmanagar (Tripura)', state: 'Tripura', lat: 24.3752, lng: 92.1643 },
      { id: 'AGT', name: 'Agartala (Tripura)', state: 'Tripura', lat: 23.8315, lng: 91.2868 },
      { id: 'UDP', name: 'Udaipur (Tripura)', state: 'Tripura', lat: 23.5333, lng: 91.4833 },

      // 8. SIKKIM (Brother State)
      { id: 'GTK', name: 'Gangtok (Sikkim)', state: 'Sikkim', lat: 27.3389, lng: 88.6065 }
    ];

    for (let node of nodes) {
      await session.run(
        `CREATE (l:Location { id: $id, name: $name, state: $state, lat: $lat, lng: $lng })`,
        node
      );
    }

    // Inter-State Highways, Critical Slopes & Alternative Bypasses
    const edges = [
      // === GUWAHATI - SHILLONG (NH-06) ===
      { from: 'GAU', to: 'SHL', distance: 100.0, base_time: 150, quality: 5, incidents: 1, id: 'R_GAU_SHL' },
      { from: 'SHL', to: 'CHEP', distance: 54.0, base_time: 90, quality: 3, incidents: 6, id: 'R_SHL_CHEP' }, // Heavy rain & landslides
      { from: 'SHL', to: 'JOW', distance: 65.0, base_time: 110, quality: 3, incidents: 5, id: 'R_SHL_JOW' },

      // === SHILLONG - SILCHAR CORRIDOR (NH-06 vs Haflong Bypass) ===
      // Primary: Jowai -> Silchar via Sonapur Tunnel (Severe Landslide & Mudflow Hotspot)
      { from: 'JOW', to: 'SIL', distance: 135.0, base_time: 240, quality: 2, incidents: 12, id: 'R_JOW_SIL' }, // Severe Landslide sink zone
      
      // Alternative Safe Bypass: Guwahati -> Nagaon -> Haflong -> Silchar (NH-27 East-West Corridor)
      { from: 'GAU', to: 'NAG', distance: 120.0, base_time: 130, quality: 5, incidents: 1, id: 'R_GAU_NAG' },
      { from: 'NAG', to: 'HAF', distance: 165.0, base_time: 210, quality: 4, incidents: 2, id: 'R_NAG_HAF' },
      { from: 'HAF', to: 'SIL', distance: 105.0, base_time: 140, quality: 4, incidents: 1, id: 'R_HAF_SIL' },

      // === ASSAM - ARUNACHAL PRADESH CORRIDORS ===
      { from: 'NAG', to: 'TEZ', distance: 65.0, base_time: 75, quality: 4, incidents: 1, id: 'R_NAG_TEZ' },
      { from: 'TEZ', to: 'ITA', distance: 150.0, base_time: 200, quality: 4, incidents: 3, id: 'R_TEZ_ITA' }, // Gateway to Arunachal
      { from: 'TEZ', to: 'BOM', distance: 155.0, base_time: 240, quality: 3, incidents: 5, id: 'R_TEZ_BOM' }, // BCT Highway
      { from: 'BOM', to: 'TAW', distance: 175.0, base_time: 330, quality: 2, incidents: 11, id: 'R_BOM_TAW' }, // Sela Pass rockfalls & landslides

      // Upper Assam & Siang Valley
      { from: 'NAG', to: 'JOR', distance: 180.0, base_time: 220, quality: 3, incidents: 6, id: 'R_NAG_JOR' }, // Kaziranga flood inundation
      { from: 'JOR', to: 'DIB', distance: 140.0, base_time: 170, quality: 4, incidents: 2, id: 'R_JOR_DIB' },
      { from: 'DIB', to: 'PSG', distance: 150.0, base_time: 180, quality: 4, incidents: 3, id: 'R_DIB_PSG' }, // Bogibeel to Pasighat

      // === ASSAM - NAGALAND - MANIPUR CORRIDOR (NH-29 / NH-02) ===
      { from: 'NAG', to: 'DIM', distance: 175.0, base_time: 210, quality: 4, incidents: 2, id: 'R_NAG_DIM' },
      // Primary: Dimapur -> Kohima (Dzüdza / Paglapahar sinking zone, highly landslide prone)
      { from: 'DIM', to: 'KOH', distance: 74.0, base_time: 150, quality: 2, incidents: 10, id: 'R_DIM_KOH' },
      { from: 'KOH', to: 'SEN', distance: 60.0, base_time: 90, quality: 3, incidents: 4, id: 'R_KOH_SEN' },
      { from: 'SEN', to: 'IMP', distance: 75.0, base_time: 100, quality: 4, incidents: 3, id: 'R_SEN_IMP' },
      { from: 'IMP', to: 'CHU', distance: 65.0, base_time: 85, quality: 4, incidents: 2, id: 'R_IMP_CHU' },
      { from: 'KOH', to: 'MOK', distance: 145.0, base_time: 220, quality: 3, incidents: 4, id: 'R_KOH_MOK' },

      // Alternative Bypass: Dimapur -> Mokokchung -> Kohima
      { from: 'DIM', to: 'MOK', distance: 160.0, base_time: 210, quality: 4, incidents: 1, id: 'R_DIM_MOK' },

      // === SILCHAR - MIZORAM CORRIDOR (NH-306 / NH-54) ===
      { from: 'SIL', to: 'KOL', distance: 90.0, base_time: 140, quality: 3, incidents: 4, id: 'R_SIL_KOL' },
      { from: 'KOL', to: 'AIZ', distance: 85.0, base_time: 150, quality: 2, incidents: 9, id: 'R_KOL_AIZ' }, // Steep clay cutting, landslide prone
      { from: 'AIZ', to: 'LUN', distance: 165.0, base_time: 280, quality: 3, incidents: 5, id: 'R_AIZ_LUN' },

      // === SILCHAR - TRIPURA CORRIDOR (NH-08) ===
      { from: 'SIL', to: 'DHM', distance: 120.0, base_time: 170, quality: 3, incidents: 3, id: 'R_SIL_DHM' },
      { from: 'DHM', to: 'AGT', distance: 170.0, base_time: 230, quality: 4, incidents: 2, id: 'R_DHM_AGT' },
      { from: 'AGT', to: 'UDP', distance: 55.0, base_time: 75, quality: 4, incidents: 1, id: 'R_AGT_UDP' },

      // === WESTERN ASSAM - GARO HILLS / SIKKIM ===
      { from: 'GAU', to: 'TURA', distance: 220.0, base_time: 290, quality: 3, incidents: 3, id: 'R_GAU_TURA' },
      { from: 'GAU', to: 'GTK', distance: 520.0, base_time: 650, quality: 3, incidents: 7, id: 'R_GAU_GTK' } // NH-10 Teesta landslide corridor
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

    // Rebuild GDS graph projection for routing
    await session.run(`
      CALL gds.graph.drop('roadNetwork', false) YIELD graphName;
    `);

    await session.run(`
      CALL gds.graph.project(
        'roadNetwork',
        'Location',
        'CONNECTED_TO',
        {
          relationshipProperties: ['base_time', 'current_time', 'distance']
        }
      ) YIELD graphName, nodeCount, relationshipCount;
    `);

    console.log("Graph seeding completed successfully for all Seven Sister States!");
  } catch (err) {
    console.error("Error seeding Seven Sisters graph:", err);
  } finally {
    await session.close();
    await closeDriver();
  }
};

seedData();
