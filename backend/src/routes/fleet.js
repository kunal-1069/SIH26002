const express = require('express');
const router = express.Router();

const dummyRoutes = [
  { id: 1, name: "Truck Alpha (GAU-SHL)", start: { lat: 26.1445, lng: 91.7362 }, end: { lat: 25.5788, lng: 91.8933 }, speed: 0.05, offset: 0, geometry: [] },
  { id: 2, name: "Truck Beta (TEZ-TAW)", start: { lat: 26.6528, lng: 92.7926 }, end: { lat: 27.5861, lng: 91.8594 }, speed: 0.03, offset: 1, geometry: [] },
  { id: 3, name: "Truck Gamma (SIL-AIZ)", start: { lat: 24.8333, lng: 92.7789 }, end: { lat: 23.7271, lng: 92.7176 }, speed: 0.04, offset: 2, geometry: [] },
  { id: 4, name: "Truck Delta (DIM-KOH)", start: { lat: 25.9095, lng: 93.7266 }, end: { lat: 25.6751, lng: 94.1086 }, speed: 0.06, offset: 3, geometry: [] },
  { id: 5, name: "Truck Epsilon (GAU-AGT)", start: { lat: 26.1445, lng: 91.7362 }, end: { lat: 23.8315, lng: 91.2868 }, speed: 0.02, offset: 4, geometry: [] }
];

// Pre-fetch actual road geometries from OSRM so trucks don't fly in straight lines
async function initializeRouteGeometries() {
  for (let r of dummyRoutes) {
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${r.start.lng},${r.start.lat};${r.end.lng},${r.end.lat}?overview=full&geometries=geojson`);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0]?.geometry?.coordinates) {
          // OSRM returns [lng, lat]
          r.geometry = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch geometry for ${r.name}`);
    }
  }
}
initializeRouteGeometries();

router.get('/devices', async (req, res) => {
  res.json(dummyRoutes.map(r => ({ id: r.id, name: r.name })));
});

router.get('/positions', async (req, res) => {
  const now = Date.now() / 1000;
  
  const positions = dummyRoutes.map(r => {
    // Smooth back-and-forth movement cycle (0.0 to 1.0)
    const cycle = (Math.sin(now * r.speed + r.offset) + 1) / 2;
    
    let lat, lng;
    if (r.geometry && r.geometry.length > 0) {
      // Interpolate strictly along the winding road geometry array
      const maxIndex = r.geometry.length - 1;
      const exactIndex = cycle * maxIndex;
      const lowerIndex = Math.floor(exactIndex);
      const upperIndex = Math.min(lowerIndex + 1, maxIndex);
      const remainder = exactIndex - lowerIndex;

      // Linear interpolation between the two closest points on the actual road
      lat = r.geometry[lowerIndex].lat + (r.geometry[upperIndex].lat - r.geometry[lowerIndex].lat) * remainder;
      lng = r.geometry[lowerIndex].lng + (r.geometry[upperIndex].lng - r.geometry[lowerIndex].lng) * remainder;
    } else {
      // Fallback to straight line if OSRM failed
      lat = r.start.lat + (r.end.lat - r.start.lat) * cycle;
      lng = r.start.lng + (r.end.lng - r.start.lng) * cycle;
    }

    return {
      id: r.id,
      deviceId: r.id,
      latitude: lat,
      longitude: lng
    };
  });
  
  res.json(positions);
});

module.exports = router;
