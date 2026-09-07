const express = require('express');
const router = express.Router();

// Known regional geotechnical hazard hotspots across North East India
const HAZARD_HOTSPOTS = [
  { id: 'HOTSPOT_SNP', name: 'Sonapur Tunnel Sinking Zone', corridor: 'NH-06', lat: 25.1150, lng: 92.3650, hazardType: 'LANDSLIDE' },
  { id: 'HOTSPOT_DZU', name: 'Paglapahar / Dzüdza Slip Zone', corridor: 'NH-29', lat: 25.7550, lng: 93.9250, hazardType: 'LANDSLIDE' },
  { id: 'HOTSPOT_SELA', name: 'Sela Pass Rockfall Corridor', corridor: 'NH-13 BCT', lat: 27.5050, lng: 92.1050, hazardType: 'DUAL_HAZARD' },
  { id: 'HOTSPOT_KZR', name: 'Kaziranga Flood Inundation', corridor: 'NH-715', lat: 26.5820, lng: 93.1750, hazardType: 'FLOOD' },
  { id: 'HOTSPOT_KOL', name: 'Kolasib Hill Slip Zone', corridor: 'NH-306', lat: 24.2246, lng: 92.6780, hazardType: 'LANDSLIDE' },
  { id: 'HOTSPOT_SEN', name: 'Senapati Hill Slopes', corridor: 'NH-02', lat: 25.2680, lng: 94.0180, hazardType: 'LANDSLIDE' },
  { id: 'HOTSPOT_DHM', name: 'Manu-Dharmanagar Flood Basin', corridor: 'NH-08', lat: 24.3752, lng: 92.1643, hazardType: 'FLOOD' }
];

// 6 Realistic Convoy Vehicles operating across Key North Eastern Lifeline Corridors
const dummyRoutes = [
  {
    id: 1,
    callsign: 'CONVOY-NER-01',
    name: 'Truck Alpha (Guwahati ➔ Silchar)',
    plateNumber: 'AS-01-GC-4921',
    model: 'Tata Prima 5530.S (16-Wheeler Multi-Axle)',
    vehicleClass: 'Heavy Commercial Vehicle (HCV)',
    corridor: 'NH-06 (Guwahati ➔ Silchar Lifeline Highway)',
    origin: { name: 'Guwahati Logistics Hub (Assam)', lat: 26.1445, lng: 91.7362 },
    destination: { name: 'Silchar Central ICD (Assam)', lat: 24.8333, lng: 92.7789 },
    driver: {
      name: 'Biren Gogoi',
      badge: 'IND-AS-8942',
      phone: '+91 98640 12891',
      experienceYears: 14,
      bloodGroup: 'O+'
    },
    cargo: {
      type: 'Life-Saving Medical Supplies & Vaccines',
      weightTons: 14.2,
      category: 'Cold-Chain Sensitive (2°C - 8°C)',
      valueInr: '₹ 85,00,000'
    },
    speedKmhBase: 48,
    speedFactor: 0.0025,
    offset: 0.22,
    totalDistanceKm: 304,
    geometry: []
  },
  {
    id: 2,
    callsign: 'CONVOY-NER-02',
    name: 'Truck Beta (Tezpur ➔ Tawang)',
    plateNumber: 'AR-02-B-6104',
    model: 'Ashok Leyland 2820 Mountain Hauler 6x4',
    vehicleClass: 'Specialized High-Altitude All-Terrain',
    corridor: 'NH-13 BCT (Balipara-Charduar-Tawang Alpine Highway)',
    origin: { name: 'Tezpur Military Base (Assam)', lat: 26.6528, lng: 92.7926 },
    destination: { name: 'Tawang Frontier Depot (Arunachal Pradesh)', lat: 27.5861, lng: 91.8594 },
    driver: {
      name: 'Tashi Dorjee',
      badge: 'IND-AR-1102',
      phone: '+91 94360 44210',
      experienceYears: 18,
      bloodGroup: 'A+'
    },
    cargo: {
      type: 'Strategic Food Grains & Rations (FCI Buffer)',
      weightTons: 18.5,
      category: 'Essential Civil Food Stock',
      valueInr: '₹ 42,00,000'
    },
    speedKmhBase: 32,
    speedFactor: 0.0022,
    offset: 0.42,
    totalDistanceKm: 310,
    geometry: []
  },
  {
    id: 3,
    callsign: 'CONVOY-NER-03',
    name: 'Truck Gamma (Silchar ➔ Aizawl)',
    plateNumber: 'MZ-01-E-8219',
    model: 'BharatBenz 3528C Heavy Hauler',
    vehicleClass: 'Heavy Rigid Multi-Axle',
    corridor: 'NH-306 / NH-54 (Barak Valley ➔ Mizoram Corridor)',
    origin: { name: 'Silchar Railhead Terminal (Assam)', lat: 24.8333, lng: 92.7789 },
    destination: { name: 'Aizawl Supply Complex (Mizoram)', lat: 23.7271, lng: 92.7176 },
    driver: {
      name: 'Lalremruata Pachuau',
      badge: 'IND-MZ-4401',
      phone: '+91 98623 88102',
      experienceYears: 12,
      bloodGroup: 'B+'
    },
    cargo: {
      type: 'Domestic Cryogenic LPG Gas Cylinders',
      weightTons: 15.0,
      category: 'Hazardous Bulk Fuel (Class 2.1)',
      valueInr: '₹ 56,00,000'
    },
    speedKmhBase: 36,
    speedFactor: 0.0028,
    offset: 0.70,
    totalDistanceKm: 172,
    geometry: []
  },
  {
    id: 4,
    callsign: 'CONVOY-NER-04',
    name: 'Truck Delta (Dimapur ➔ Kohima)',
    plateNumber: 'NL-07-A-5412',
    model: 'Eicher Pro 6035 High-Torque Multi-Axle',
    vehicleClass: 'Heavy Commercial Vehicle (HCV)',
    corridor: 'NH-29 (Nagaland-Manipur Gateway Corridor)',
    origin: { name: 'Dimapur Freight Yard (Nagaland)', lat: 25.9095, lng: 93.7266 },
    destination: { name: 'Kohima City Depot (Nagaland)', lat: 25.6751, lng: 94.1086 },
    driver: {
      name: 'Imtisunep Ao',
      badge: 'IND-NL-7320',
      phone: '+91 97740 55182',
      experienceYears: 15,
      bloodGroup: 'AB+'
    },
    cargo: {
      type: 'Bridge Structural Steel & High-Grade Cement',
      weightTons: 22.8,
      category: 'Critical Infrastructure Material',
      valueInr: '₹ 68,00,000'
    },
    speedKmhBase: 38,
    speedFactor: 0.0040,
    offset: 0.85,
    totalDistanceKm: 74,
    geometry: []
  },
  {
    id: 5,
    callsign: 'CONVOY-NER-05',
    name: 'Truck Epsilon (Guwahati ➔ Agartala)',
    plateNumber: 'TR-01-F-3908',
    model: 'Mahindra Blazo X 49 Bulk Liquid Tanker',
    vehicleClass: 'Liquid Bulk Petroleum Carrier',
    corridor: 'NH-06 ➔ NH-08 (Trans-Meghalaya-Tripura Lifeline)',
    origin: { name: 'Guwahati IOCL Refinery Terminal (Assam)', lat: 26.1445, lng: 91.7362 },
    destination: { name: 'Agartala Fuel Depot (Tripura)', lat: 23.8315, lng: 91.2868 },
    driver: {
      name: 'Debabrata Debbarma',
      badge: 'IND-TR-9081',
      phone: '+91 94361 77319',
      experienceYears: 20,
      bloodGroup: 'O+'
    },
    cargo: {
      type: 'High-Speed Diesel & Aviation Turbine Fuel',
      weightTons: 20.5,
      category: 'Flammable Liquid Fuel (24,000 Liters)',
      valueInr: '₹ 92,00,000'
    },
    speedKmhBase: 46,
    speedFactor: 0.0018,
    offset: 0.30,
    totalDistanceKm: 550,
    geometry: []
  },
  {
    id: 6,
    callsign: 'CONVOY-NER-06',
    name: 'Truck Zeta (Kohima ➔ Imphal)',
    plateNumber: 'MN-01-AA-2290',
    model: 'Tata Signa 4825.TK Heavy Freight',
    vehicleClass: 'Heavy Commercial Vehicle (HCV)',
    corridor: 'NH-02 (Manipur Lifeline Highway)',
    origin: { name: 'Kohima Transit Depot (Nagaland)', lat: 25.6751, lng: 94.1086 },
    destination: { name: 'Imphal Central Complex (Manipur)', lat: 24.8170, lng: 93.9368 },
    driver: {
      name: 'Nongmaithem Singh',
      badge: 'IND-MN-3180',
      phone: '+91 98561 33490',
      experienceYears: 16,
      bloodGroup: 'A+'
    },
    cargo: {
      type: 'Essential FMCG, Baby Food & Relief Kits',
      weightTons: 16.4,
      category: 'Disaster Preparedness Stock',
      valueInr: '₹ 48,00,000'
    },
    speedKmhBase: 40,
    speedFactor: 0.0030,
    offset: 0.55,
    totalDistanceKm: 138,
    geometry: []
  }
];

// Helper: Haversine distance in kilometers
function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Bearing angle in degrees (0 - 360)
function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return Math.round((brng + 360) % 360);
}

// Helper: Compass direction from bearing
function getCompassDirection(bearing) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
}

// Generate direct corridor road points if OSRM is unreachable
function generateFallbackGeometry(start, end, steps = 100) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push({
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t
    });
  }
  return points;
}

// Pre-fetch actual high-resolution road geometries from OSRM
async function initializeRouteGeometries() {
  for (let r of dummyRoutes) {
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${r.origin.lng},${r.origin.lat};${r.destination.lng},${r.destination.lat}?overview=full&geometries=geojson`);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0]?.geometry?.coordinates) {
          r.geometry = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
          if (data.routes[0].distance) {
            r.totalDistanceKm = Math.round(data.routes[0].distance / 1000);
          }
          continue;
        }
      }
    } catch (err) {
      console.warn(`[Fleet] OSRM fetch failed for ${r.callsign}, using high-resolution fallback geometry.`);
    }
    r.geometry = generateFallbackGeometry(r.origin, r.destination);
  }
}
initializeRouteGeometries();

// GET /api/fleet/devices - Detailed Convoy Fleet Manifest
router.get('/devices', async (req, res) => {
  res.json(dummyRoutes.map(r => ({
    id: r.id,
    callsign: r.callsign,
    name: r.name,
    plateNumber: r.plateNumber,
    model: r.model,
    vehicleClass: r.vehicleClass,
    corridor: r.corridor,
    origin: r.origin,
    destination: r.destination,
    driver: r.driver,
    cargo: r.cargo,
    totalDistanceKm: r.totalDistanceKm,
    baseSpeedKmh: r.speedKmhBase
  })));
});

// GET /api/fleet/positions - Real-Time Dynamic Telemetry & Proximity Risk Intelligence
router.get('/positions', async (req, res) => {
  const now = Date.now() / 1000;

  const positions = dummyRoutes.map(r => {
    // Continuous forward progress along route (0.0 to 1.0)
    const rawProgress = (now * r.speedFactor + r.offset) % 1.0;
    
    // Simulate slight natural speed variation (hills, traffic, curves)
    const speedVariation = Math.sin(now * 0.2 + r.id) * 6;
    const currentSpeed = Math.max(18, Math.round(r.speedKmhBase + speedVariation));

    let lat, lng, bearing = 0;

    if (r.geometry && r.geometry.length > 1) {
      const maxIndex = r.geometry.length - 1;
      const exactIndex = rawProgress * maxIndex;
      const lowerIndex = Math.floor(exactIndex);
      const upperIndex = Math.min(lowerIndex + 1, maxIndex);
      const remainder = exactIndex - lowerIndex;

      // Linear interpolation along road segment
      lat = r.geometry[lowerIndex].lat + (r.geometry[upperIndex].lat - r.geometry[lowerIndex].lat) * remainder;
      lng = r.geometry[lowerIndex].lng + (r.geometry[upperIndex].lng - r.geometry[lowerIndex].lng) * remainder;

      // Look ahead 3 points to determine accurate vehicle heading
      const lookAheadIndex = Math.min(lowerIndex + 3, maxIndex);
      const targetPoint = r.geometry[lookAheadIndex];
      bearing = calculateBearing(lat, lng, targetPoint.lat, targetPoint.lng);
    } else {
      lat = r.origin.lat + (r.destination.lat - r.origin.lat) * rawProgress;
      lng = r.origin.lng + (r.destination.lng - r.origin.lng) * rawProgress;
      bearing = calculateBearing(r.origin.lat, r.origin.lng, r.destination.lat, r.destination.lng);
    }

    // Evaluate proximity to known geotechnical hazard hotspots
    let proximityAlert = null;
    let status = 'EN_ROUTE_NOMINAL';
    let minHazardDist = 999;
    let closestHazard = null;

    for (const h of HAZARD_HOTSPOTS) {
      const dist = getHaversineDistanceKm(lat, lng, h.lat, h.lng);
      if (dist < minHazardDist) {
        minHazardDist = dist;
        closestHazard = h;
      }
    }

    if (closestHazard && minHazardDist < 25) {
      if (minHazardDist < 10) {
        status = 'ALERT_HAZARD_ZONE';
      } else {
        status = 'CAUTION_MONITORED_CORRIDOR';
      }
      proximityAlert = {
        hotspotId: closestHazard.id,
        hotspotName: closestHazard.name,
        corridor: closestHazard.corridor,
        hazardType: closestHazard.hazardType,
        distanceKm: Math.round(minHazardDist * 10) / 10,
        advisory: minHazardDist < 10
          ? `CRITICAL PROXIMITY: ${Math.round(minHazardDist * 10) / 10} km to active ${closestHazard.hazardType} zone (${closestHazard.name}). Reroute advisory broadcasted.`
          : `MONITORING: ${Math.round(minHazardDist * 10) / 10} km approaching ${closestHazard.name}. Speed governed to 30 km/h.`
      };
    }

    // Telematics & Mechanical Diagnostics
    const distanceCoveredKm = Math.round(rawProgress * r.totalDistanceKm);
    const distanceRemainingKm = Math.max(0, r.totalDistanceKm - distanceCoveredKm);
    const etaMinutes = Math.round((distanceRemainingKm / currentSpeed) * 60);

    return {
      id: r.id,
      deviceId: r.id,
      callsign: r.callsign,
      name: r.name,
      plateNumber: r.plateNumber,
      model: r.model,
      vehicleClass: r.vehicleClass,
      corridor: r.corridor,
      origin: r.origin,
      destination: r.destination,
      driver: r.driver,
      cargo: r.cargo,
      latitude: lat,
      longitude: lng,
      bearing: bearing,
      compass: getCompassDirection(bearing),
      speedKmh: currentSpeed,
      progressPercent: Math.round(rawProgress * 100),
      distanceCoveredKm: distanceCoveredKm,
      distanceRemainingKm: distanceRemainingKm,
      etaMinutes: etaMinutes,
      fuelPercent: Math.max(18, Math.round(92 - rawProgress * 48)),
      engineTempC: Math.round(87 + Math.sin(now * 0.15 + r.id) * 4),
      oilPressurePsi: Math.round(52 + Math.cos(now * 0.1 + r.id) * 3),
      batteryVoltage: 27.6,
      odometerKm: Math.round(124500 + r.id * 14200 + distanceCoveredKm),
      status: status,
      proximityAlert: proximityAlert
    };
  });

  res.json(positions);
});

// GET /api/fleet/vehicle/:id - Detailed telematics & route geometry for focused truck
router.get('/vehicle/:id', async (req, res) => {
  const truckId = parseInt(req.params.id, 10);
  const truck = dummyRoutes.find(t => t.id === truckId);
  if (!truck) {
    return res.status(404).json({ error: 'Truck not found in active fleet manifest' });
  }

  res.json({
    ...truck,
    geometryCount: truck.geometry?.length || 0,
    geometry: truck.geometry || []
  });
});

module.exports = router;
