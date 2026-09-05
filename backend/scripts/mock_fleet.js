// mock_fleet.js
// Simulates AIS-140 GPS trackers sending pings to the backend

const axios = require('axios'); // Requires axios, run npm install axios

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

const generateMockFleet = (numTrucks) => {
  const fleet = [];
  for (let i = 0; i < numTrucks; i++) {
    fleet.push({
      truckId: `TRK-${1000 + i}`,
      lat: 26.1445 + (Math.random() * 0.1 - 0.05), // near Guwahati
      lng: 91.7362 + (Math.random() * 0.1 - 0.05),
      speed: Math.floor(Math.random() * 60) + 10, // 10 to 70 km/h
      status: 'active'
    });
  }
  return fleet;
};

const sendPings = async (fleet) => {
  for (const truck of fleet) {
    // Update location slightly to simulate movement
    truck.lat += (Math.random() * 0.002 - 0.001);
    truck.lng += (Math.random() * 0.002 - 0.001);

    try {
      // In a real scenario, this would POST to /api/fleet/ping
      // console.log(`Sending ping for ${truck.truckId}: ${truck.lat}, ${truck.lng}`);
      // await axios.post(`${BACKEND_URL}/api/fleet/ping`, truck);
    } catch (error) {
      // console.error(`Error sending ping for ${truck.truckId}:`, error.message);
    }
  }
};

const main = () => {
  console.log('Starting mock fleet simulation...');
  const fleet = generateMockFleet(5); // Simulate 5 trucks

  setInterval(() => {
    sendPings(fleet);
  }, 10000); // Send ping every 10 seconds
};

main();
