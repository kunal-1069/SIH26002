'use client';

import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, Marker, AdvancedMarker, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

// ALL 28 NODES ACROSS SEVEN SISTER STATES (+ SIKKIM)
const SEVEN_SISTER_HUBS = [
  // 1. ASSAM
  { id: 'GAU', name: 'Guwahati (Assam)', state: 'Assam', lat: 26.1445, lng: 91.7362, corridor: 'Gateway to Northeast India / NH-27' },
  { id: 'NAG', name: 'Nagaon (Assam)', state: 'Assam', lat: 26.3464, lng: 92.6840, corridor: 'Central Assam Junction / NH-27 / NH-715' },
  { id: 'TEZ', name: 'Tezpur (Assam)', state: 'Assam', lat: 26.6528, lng: 92.7926, corridor: 'Arunachal Transit Gateway / NH-15' },
  { id: 'JOR', name: 'Jorhat (Assam)', state: 'Assam', lat: 26.7509, lng: 94.2037, corridor: 'Upper Assam Tea Hub / NH-715' },
  { id: 'DIB', name: 'Dibrugarh (Assam)', state: 'Assam', lat: 27.4728, lng: 94.9120, corridor: 'Brahmaputra Valley / Bogibeel / NH-15' },
  { id: 'SIL', name: 'Silchar (Assam)', state: 'Assam', lat: 24.8333, lng: 92.7789, corridor: 'Barak Valley Transit Node / NH-06 / NH-37' },
  { id: 'HAF', name: 'Haflong (Assam)', state: 'Assam', lat: 25.1706, lng: 93.0177, corridor: 'Dima Hasao Hill Highway / NH-54E' },

  // 2. MEGHALAYA
  { id: 'SHL', name: 'Shillong (Meghalaya)', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, corridor: 'State Capital / NH-06 Hill Corridor' },
  { id: 'CHEP', name: 'Cherrapunji / Sohra (Meghalaya)', state: 'Meghalaya', lat: 25.2702, lng: 91.7323, corridor: 'High Rainfall & Monsoon Slope Zone / SH-05' },
  { id: 'JOW', name: 'Jowai (Meghalaya)', state: 'Meghalaya', lat: 25.4544, lng: 92.2033, corridor: 'Jaintia Hills / Sonapur Route / NH-06' },
  { id: 'TURA', name: 'Tura (Meghalaya)', state: 'Meghalaya', lat: 25.5144, lng: 90.2033, corridor: 'West Garo Hills Gateway / NH-51' },

  // 3. ARUNACHAL PRADESH
  { id: 'ITA', name: 'Itanagar (Arunachal)', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053, corridor: 'State Capital / Trans-Arunachal Highway / NH-415' },
  { id: 'BOM', name: 'Bomdila (Arunachal)', state: 'Arunachal Pradesh', lat: 27.2645, lng: 92.4231, corridor: 'West Kameng Foothills / BCT Road' },
  { id: 'TAW', name: 'Tawang (Arunachal)', state: 'Arunachal Pradesh', lat: 27.5861, lng: 91.8594, corridor: 'Sela Pass Alpine Highway / NH-13' },
  { id: 'PSG', name: 'Pasighat (Arunachal)', state: 'Arunachal Pradesh', lat: 28.0664, lng: 95.3267, corridor: 'Siang Valley Gateway / NH-515' },

  // 4. NAGALAND
  { id: 'DIM', name: 'Dimapur (Nagaland)', state: 'Nagaland', lat: 25.9095, lng: 93.7266, corridor: 'Nagaland Commercial Gateway / NH-29' },
  { id: 'KOH', name: 'Kohima (Nagaland)', state: 'Nagaland', lat: 25.6751, lng: 94.1086, corridor: 'State Capital / Dzüdza Valley Corridor / NH-29' },
  { id: 'MOK', name: 'Mokokchung (Nagaland)', state: 'Nagaland', lat: 26.3267, lng: 94.5211, corridor: 'Ao Cultural Center & Central Ridge / NH-02' },

  // 5. MANIPUR
  { id: 'SEN', name: 'Senapati (Manipur)', state: 'Manipur', lat: 25.2680, lng: 94.0180, corridor: 'Northern Hill Corridor / NH-02' },
  { id: 'IMP', name: 'Imphal (Manipur)', state: 'Manipur', lat: 24.8170, lng: 93.9368, corridor: 'State Capital / Imphal Valley / NH-02' },
  { id: 'CHU', name: 'Churachandpur (Manipur)', state: 'Manipur', lat: 24.3333, lng: 93.6833, corridor: 'Southern Manipur Highway / NH-102B' },

  // 6. MIZORAM
  { id: 'KOL', name: 'Kolasib (Mizoram)', state: 'Mizoram', lat: 24.2246, lng: 92.6780, corridor: 'Northern Mizoram Landslide Hotspot / NH-306' },
  { id: 'AIZ', name: 'Aizawl (Mizoram)', state: 'Mizoram', lat: 23.7271, lng: 92.7176, corridor: 'State Capital / Steep Ridge Route / NH-54' },
  { id: 'LUN', name: 'Lunglei (Mizoram)', state: 'Mizoram', lat: 22.8671, lng: 92.7651, corridor: 'Southern Mizoram Hills / NH-54' },

  // 7. TRIPURA
  { id: 'DHM', name: 'Dharmanagar (Tripura)', state: 'Tripura', lat: 24.3752, lng: 92.1643, corridor: 'North Tripura Lifeline / NH-08' },
  { id: 'AGT', name: 'Agartala (Tripura)', state: 'Tripura', lat: 23.8315, lng: 91.2868, corridor: 'State Capital / Western Plains / NH-08' },
  { id: 'UDP', name: 'Udaipur (Tripura)', state: 'Tripura', lat: 23.5333, lng: 91.4833, corridor: 'Gomati District Heritage Corridor / NH-08' },

  // 8. SIKKIM (Brother State)
  { id: 'GTK', name: 'Gangtok (Sikkim)', state: 'Sikkim', lat: 27.3389, lng: 88.6065, corridor: 'State Capital / Teesta River Gorge / NH-10' }
];

const SEVEN_SISTER_STATES = [
  'ALL',
  'Assam',
  'Meghalaya',
  'Arunachal Pradesh',
  'Nagaland',
  'Manipur',
  'Mizoram',
  'Tripura',
  'Sikkim'
];

// Smooth Map Controller for Auto-Framing Routes & Locations
const MapController: React.FC<{
  targetCoords: { lat: number; lng: number } | null;
  routeCoords?: { lat: number; lng: number }[] | null;
}> = ({ targetCoords, routeCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (routeCoords && routeCoords.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      routeCoords.forEach(c => bounds.extend(c));
      map.fitBounds(bounds, { top: 70, right: 340, bottom: 90, left: 390 });
    } else if (targetCoords) {
      map.panTo(targetCoords);
      map.setZoom(11.5);
    }
  }, [map, targetCoords, routeCoords]);
  return null;
};

// Helper to check if dangerous path and safe path follow the exact same corridor
const checkIsSamePath = (plan: any) => {
  if (!plan) return true;
  if (!plan.hasHazard) return true;
  if (!plan.suggestedSafeRoute) return true;
  if (plan.isDiverted === false) return true;
  const primIds = plan.primaryRoute?.coordinates?.map((c: any) => c.id || `${Number(c.lat).toFixed(3)},${Number(c.lng).toFixed(3)}`).join('-');
  const safeIds = plan.suggestedSafeRoute?.coordinates?.map((c: any) => c.id || `${Number(c.lat).toFixed(3)},${Number(c.lng).toFixed(3)}`).join('-');
  return !safeIds || primIds === safeIds;
};

// Dual-Route Visualizer:
// 1. If NO danger truly (!hasHazard): ONLY show safe path (in emerald green)
// 2. If danger exists AND safe path & dangerous path are same: ONLY show dangerous path (in bold red)
// 3. Otherwise (hazard exists and detour is available): show BOTH (Red dangerous path + Green safe detour)
const DualRouteVisualizer: React.FC<{
  primaryRoute: { coordinates?: any[]; roadGeometry?: any[] } | null;
  safeRoute: { coordinates?: any[]; roadGeometry?: any[] } | null;
  hasHazard: boolean;
  viewMode: 'BOTH' | 'SAFE' | 'PRIMARY';
  isSamePath: boolean;
}> = ({ primaryRoute, safeRoute, hasHazard, viewMode, isSamePath }) => {
  const map = useMap();
  const primaryPolylineRef = useRef<google.maps.Polyline | null>(null);
  const safePolylineRef = useRef<google.maps.Polyline | null>(null);

  // Cleanup Polylines on unmount only
  useEffect(() => {
    return () => {
      if (primaryPolylineRef.current) {
        primaryPolylineRef.current.setMap(null);
        primaryPolylineRef.current = null;
      }
      if (safePolylineRef.current) {
        safePolylineRef.current.setMap(null);
        safePolylineRef.current = null;
      }
    };
  }, []);

  // Helper to resolve road-attached geometry (from backend or OSRM vehicle driving API)
  const resolveRoadPoints = async (routeObj: { coordinates?: any[]; roadGeometry?: any[] } | null) => {
    if (!routeObj) return [];
    if (routeObj.roadGeometry && routeObj.roadGeometry.length > 5) {
      return routeObj.roadGeometry;
    }
    const coords = routeObj.coordinates;
    if (!coords || coords.length < 2) return [];

    try {
      const coordStr = coords.map((c: any) => `${c.lng},${c.lat}`).join(';');
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0]?.geometry?.coordinates) {
          return data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng }));
        }
      }
    } catch (_) {}
    return coords.map((c: any) => ({ lat: c.lat, lng: c.lng }));
  };

  // 1. Render Dangerous Road in RED (Only when hasHazard is true, and user has not selected SAFE mode)
  useEffect(() => {
    if (!map) return;

    if (!primaryPolylineRef.current) {
      primaryPolylineRef.current = new google.maps.Polyline({
        map: null,
        strokeColor: '#dc2626',
        strokeWeight: 6,
        strokeOpacity: 0.92,
        zIndex: 5
      });
    }

    // Rules:
    // - If NO danger truly (!hasHazard): do NOT show dangerous path (show only safe path)
    // - If user engaged safe detour (viewMode === 'SAFE'): do NOT show dangerous path
    // - If hazard exists: show dangerous path in RED (both when same path, or when detour exists)
    const shouldShowDangerousPath = Boolean(hasHazard && viewMode !== 'SAFE' && primaryRoute);

    if (!shouldShowDangerousPath) {
      primaryPolylineRef.current.setMap(null);
      return;
    }

    let isCurrent = true;
    resolveRoadPoints(primaryRoute).then((roadPts) => {
      if (!isCurrent || !primaryPolylineRef.current || !map) return;
      if (roadPts && roadPts.length > 0) {
        primaryPolylineRef.current.setPath(roadPts);
        primaryPolylineRef.current.setOptions({
          strokeColor: '#dc2626', // Bold RED for hazardous road
          strokeWeight: 6,
          strokeOpacity: 0.92,
          zIndex: 5
        });
        primaryPolylineRef.current.setMap(map);
      } else {
        primaryPolylineRef.current.setMap(null);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [primaryRoute, hasHazard, viewMode, isSamePath, map]);

  // 2. Render Safe Road in EMERALD GREEN:
  // - If NO danger truly (!hasHazard): ONLY show safe path (primary route rendered in green)
  // - If hazard exists AND dangerous path & safe path are same: do NOT show safe path (show only dangerous path)
  // - If hazard exists AND detour exists: SHOW safe detour in green (unless viewMode === 'PRIMARY')
  useEffect(() => {
    if (!map) return;

    if (!safePolylineRef.current) {
      safePolylineRef.current = new google.maps.Polyline({
        map: null,
        strokeColor: '#059669',
        strokeWeight: 7,
        strokeOpacity: 0.95,
        zIndex: 10
      });
    }

    let routeToRender = null;
    if (!hasHazard) {
      routeToRender = primaryRoute; // No hazard truly: show the road as a safe path
    } else if (hasHazard && !isSamePath && viewMode !== 'PRIMARY') {
      routeToRender = safeRoute || primaryRoute; // Has hazard and detour exists: show safe detour
    }

    if (!routeToRender) {
      safePolylineRef.current.setMap(null);
      return;
    }

    let isCurrent = true;
    resolveRoadPoints(routeToRender).then((roadPts) => {
      if (!isCurrent || !safePolylineRef.current || !map) return;
      if (roadPts && roadPts.length > 0) {
        safePolylineRef.current.setPath(roadPts);
        safePolylineRef.current.setOptions({
          strokeColor: '#059669', // Emerald Green safe path
          strokeWeight: 7,
          strokeOpacity: 0.95,
          zIndex: 10
        });
        safePolylineRef.current.setMap(map);
      } else {
        safePolylineRef.current.setMap(null);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [primaryRoute, safeRoute, hasHazard, viewMode, isSamePath, map]);

  return null;
};

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  // ALL 28 SEVEN SISTER HUBS IN STATE
  const [availableNodes, setAvailableNodes] = useState<any[]>(SEVEN_SISTER_HUBS);

  // Active Route Plan & Hazard Alert state
  const [selectedStart, setSelectedStart] = useState('GAU'); // Default Gateway: Guwahati
  const [selectedEnd, setSelectedEnd] = useState('SIL'); // Default Destination: Silchar (demonstrating Sonapur landslide corridor)
  const [currentRoutePlan, setCurrentRoutePlan] = useState<any | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeViewMode, setRouteViewMode] = useState<'BOTH' | 'SAFE' | 'PRIMARY'>('BOTH');
  const [acceptedSafeRoute, setAcceptedSafeRoute] = useState(false);

  // SEARCH BAR STATE FOR DESTINATIONS ACROSS SEVEN SISTER STATES
  const [destSearchQuery, setDestSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Regional Hazard Locations & Hotspots
  const [hazardData, setHazardData] = useState<any | null>(null);
  const [selectedHazard, setSelectedHazard] = useState<any | null>(null);
  const [activeHazardFilter, setActiveHazardFilter] = useState<'ALL' | 'LANDSLIDE' | 'FLOOD'>('ALL');
  const [mapTarget, setMapTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [showAllHotspots, setShowAllHotspots] = useState(false); // Reduced map clutter by default
  const [isRadarCollapsed, setIsRadarCollapsed] = useState(false);

  // Custom coordinate click predictor
  const [customPrediction, setCustomPrediction] = useState<any | null>(null);

  // Model Fine-Tuning Modal
  const [showModelModal, setShowModelModal] = useState(false);
  const [simRain, setSimRain] = useState(90);
  const [simSlope, setSimSlope] = useState(38);
  const [simResult, setSimResult] = useState<any | null>(null);
  const [isFineTuning, setIsFineTuning] = useState(false);
  const [fineTuneStatus, setFineTuneStatus] = useState('');

  // Fetch nodes from backend
  const fetchNodes = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/route/nodes');
      if (res.ok) {
        const data = await res.json();
        if (data.nodes && data.nodes.length > 0) {
          // Merge with predefined details
          const merged = data.nodes.map((n: any) => {
            const found = SEVEN_SISTER_HUBS.find(h => h.id === n.id);
            return {
              ...n,
              state: n.state || found?.state || 'Northeast India',
              corridor: found?.corridor || ''
            };
          });
          setAvailableNodes(merged);
        }
      }
    } catch (_) {}
  };

  // Fetch predicted hazard locations
  const fetchHazardLocations = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/hazards/locations');
      if (res.ok) {
        const data = await res.json();
        setHazardData(data);
      }
    } catch (err) {
      console.error("Failed to fetch hazard predictions:", err);
    }
  };

  // Calculate route with hazard check
  const planRouteAndCheckHazards = async (start = selectedStart, end = selectedEnd) => {
    setIsCalculatingRoute(true);
    setAcceptedSafeRoute(false);
    setSelectedStart(start);
    setSelectedEnd(end);

    try {
      const res = await fetch('http://localhost:3001/api/route/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startNode: start, endNode: end })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentRoutePlan(data);
        // When choosing another location, always reset view mode:
        // If the new corridor has hazards, display BOTH so the user immediately sees the dangerous red route & detour!
        setRouteViewMode(data.hasHazard ? 'BOTH' : 'PRIMARY');
        setAcceptedSafeRoute(false);
      }
    } catch (err) {
      console.error("Failed to calculate route:", err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Maintain refs for live interval polling of selected route
  const startNodeRef = useRef(selectedStart);
  const endNodeRef = useRef(selectedEnd);
  useEffect(() => {
    startNodeRef.current = selectedStart;
    endNodeRef.current = selectedEnd;
  }, [selectedStart, selectedEnd]);

  useEffect(() => {
    setIsClient(true);
    fetchNodes();
    fetchHazardLocations();
    // Calculate initial route between Guwahati and Silchar (high-profile Seven Sisters corridor)
    planRouteAndCheckHazards('GAU', 'SIL');

    // Fetch Fleet data from Traccar
    const fetchFleetData = async () => {
      try {
        const [devicesRes, positionsRes] = await Promise.all([
          fetch('http://localhost:3001/api/fleet/devices'),
          fetch('http://localhost:3001/api/fleet/positions')
        ]);
        if (devicesRes.ok) setDevices(await devicesRes.json());
        if (positionsRes.ok) setPositions(await positionsRes.json());
      } catch (_) {}
    };
    fetchFleetData();

    const fleetInterval = setInterval(fetchFleetData, 10000);
    // Poll hazard radar telemetry every 5 seconds so live sensor fluctuations stream in real time
    const hazardInterval = setInterval(fetchHazardLocations, 5000);
    // Poll active route telemetry every 6 seconds so route hazard percentages update live
    const routeTelemetryInterval = setInterval(async () => {
      if (startNodeRef.current && endNodeRef.current) {
        try {
          const res = await fetch('http://localhost:3001/api/route/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startNode: startNodeRef.current, endNode: endNodeRef.current })
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentRoutePlan((prev: any) => {
              if (!prev) return data;
              return {
                ...data,
                primaryRoute: {
                  ...data.primaryRoute,
                  roadGeometry: prev.primaryRoute?.roadGeometry || data.primaryRoute?.roadGeometry
                },
                suggestedSafeRoute: {
                  ...data.suggestedSafeRoute,
                  roadGeometry: prev.suggestedSafeRoute?.roadGeometry || data.suggestedSafeRoute?.roadGeometry
                }
              };
            });
          }
        } catch (_) {}
      }
    }, 6000);

    return () => {
      clearInterval(fleetInterval);
      clearInterval(hazardInterval);
      clearInterval(routeTelemetryInterval);
    };
  }, []);

  // Filtered Destinations for Search Bar
  const filteredDestinations = availableNodes.filter(node => {
    const matchesState = selectedStateFilter === 'ALL' || node.state?.toLowerCase() === selectedStateFilter.toLowerCase();
    const query = destSearchQuery.toLowerCase().trim();
    if (!query) return matchesState;
    const matchesQuery = (
      node.name?.toLowerCase().includes(query) ||
      node.state?.toLowerCase().includes(query) ||
      node.id?.toLowerCase().includes(query) ||
      node.corridor?.toLowerCase().includes(query)
    );
    return matchesState && matchesQuery;
  });

  // Handle Selection from Destination Search Bar
  const handleSelectDestination = (nodeId: string) => {
    setSelectedEnd(nodeId);
    setIsSearchOpen(false);
    const nodeObj = availableNodes.find(n => n.id === nodeId);
    if (nodeObj) {
      setDestSearchQuery(nodeObj.name);
    }
    planRouteAndCheckHazards(selectedStart, nodeId);
  };

  // Swap Origin and Destination
  const handleSwapRoute = () => {
    const newStart = selectedEnd;
    const newEnd = selectedStart;
    setSelectedStart(newStart);
    setSelectedEnd(newEnd);
    const nodeObj = availableNodes.find(n => n.id === newEnd);
    if (nodeObj) setDestSearchQuery(nodeObj.name);
    planRouteAndCheckHazards(newStart, newEnd);
  };

  // Handle map click for custom point analysis
  const handleMapClick = async (e: any) => {
    if (!e.detail?.latLng) return;
    const { lat, lng } = e.detail.latLng;
    setCustomPrediction({ loading: true, lat, lng });

    try {
      const res = await fetch('http://localhost:3001/api/hazards/predict-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          locationName: `Seven Sisters Corridor Point (${lat.toFixed(3)}, ${lng.toFixed(3)})`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomPrediction(data);
      }
    } catch (err) {
      console.error("Point prediction error:", err);
      setCustomPrediction(null);
    }
  };

  const runStressSimulation = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/hazards/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          road_id: 'SEVEN_SISTERS_STRESS_SEGMENT',
          slope_deg: simSlope,
          elevation_m: 350.0,
          rainfall_1h_mm: Math.round(simRain * 0.35),
          rainfall_24h_mm: simRain,
          rainfall_72h_mm: Math.round(simRain * 2.4),
          soil_clay_percent: 48.0,
          distance_to_river_m: 180.0,
          vegetation_ndvi: 0.28,
          historical_incidents: 7,
          road_quality: 2
        })
      });
      if (res.ok) setSimResult(await res.json());
    } catch (_) {}
  };

  const handleTriggerFineTune = async () => {
    setIsFineTuning(true);
    setFineTuneStatus('Streaming continuous incident reports across Seven Sisters...');
    try {
      const res = await fetch('http://localhost:3001/api/hazards/finetune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'warm_start',
          incidents: [{
            road_corridor: 'NH-06 Sonapur / Barak Valley',
            slope_deg: 44.0,
            elevation_m: 290.0,
            rainfall_1h_mm: 42.0,
            rainfall_24h_mm: 165.0,
            rainfall_72h_mm: 310.0,
            soil_clay_percent: 52.0,
            distance_to_river_m: 120.0,
            vegetation_ndvi: 0.22,
            historical_incidents: 12,
            road_quality: 2,
            landslide_occurred: 1,
            flood_occurred: 1,
            risk_multiplier: 5.2
          }]
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFineTuneStatus(`✓ Model fine-tuned! Total training samples: ${data.result?.total_training_samples}`);
        fetchHazardLocations();
        planRouteAndCheckHazards();
      }
    } catch (err: any) {
      setFineTuneStatus(`Error: ${err.message}`);
    } finally {
      setIsFineTuning(false);
    }
  };

  const allLocations: any[] = hazardData?.locations || [];
  const filteredHazardLocations = allLocations.filter(loc => {
    if (activeHazardFilter === 'LANDSLIDE') return loc.hazardType === 'LANDSLIDE' || loc.hazardType === 'DUAL_HAZARD';
    if (activeHazardFilter === 'FLOOD') return loc.hazardType === 'FLOOD' || loc.hazardType === 'DUAL_HAZARD';
    return true;
  });

  // Selected Hub objects
  const startHub = availableNodes.find(n => n.id === selectedStart);
  const endHub = availableNodes.find(n => n.id === selectedEnd);

  // State Badge Colors
  const getStateBadgeStyle = (state: string) => {
    switch (state) {
      case 'Assam': return { bg: '#064e3b', text: '#34d399', border: '#059669' };
      case 'Meghalaya': return { bg: '#0c4a6e', text: '#38bdf8', border: '#0284c7' };
      case 'Arunachal Pradesh': return { bg: '#312e81', text: '#a5b4fc', border: '#6366f1' };
      case 'Nagaland': return { bg: '#78350f', text: '#fbbf24', border: '#d97706' };
      case 'Manipur': return { bg: '#581c87', text: '#c084fc', border: '#9333ea' };
      case 'Mizoram': return { bg: '#831843', text: '#f472b6', border: '#db2777' };
      case 'Tripura': return { bg: '#134e4a', text: '#2dd4bf', border: '#0d9488' };
      case 'Sikkim': return { bg: '#164e63', text: '#22d3ee', border: '#0891b2' };
      default: return { bg: '#1e293b', text: '#94a3b8', border: '#475569' };
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#0f172a' }}>
      
      {/* 1. TOP HEADER & NAVIGATION CONTROL BAR */}
      <header style={{ backgroundColor: '#0f172a', color: 'white', borderBottom: '1px solid #1e293b', zIndex: 100 }}>
        {/* Main Title Row */}
        <div style={{ padding: '0.6rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🏔️🌊</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Seven Sisters Route Intelligence
                </h1>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 800, padding: '2px 7px', borderRadius: '12px',
                  backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #0284c7'
                }}>
                  All 7 Sister States + Sikkim
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                AI Landslide & Flood Hazard Detection with Automatic Safe Detour Routing
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowModelModal(true)}
              style={{
                padding: '6px 12px', backgroundColor: '#1e293b', color: '#e2e8f0',
                border: '1px solid #334155', borderRadius: '6px', fontSize: '0.75rem',
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              <span>🔬</span> AI Telemetry
            </button>
          </div>
        </div>

        {/* 2. SEVEN SISTERS ROUTE CONTROLS & DESTINATION SEARCH BAR */}
        <div style={{
          backgroundColor: '#1e293b', padding: '0.55rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
          borderTop: '1px solid #334155', fontSize: '0.82rem', position: 'relative'
        }}>
          
          {/* Origin Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>FROM:</span>
            <select
              value={selectedStart}
              onChange={(e) => {
                setSelectedStart(e.target.value);
                planRouteAndCheckHazards(e.target.value, selectedEnd);
              }}
              style={{
                padding: '6px 10px', borderRadius: '6px', backgroundColor: '#0f172a',
                color: 'white', border: '1px solid #475569', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {availableNodes.map(n => (
                <option key={`start-${n.id}`} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapRoute}
            title="Swap Origin and Destination"
            style={{
              padding: '5px 8px', backgroundColor: '#334155', color: '#94a3b8',
              border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.9rem'
            }}
          >
            ⇄
          </button>

          {/* DEDICATED SEVEN SISTERS DESTINATION SEARCH BAR */}
          <div style={{ position: 'relative', flex: '1 1 320px', minWidth: '280px', maxWidth: '520px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', backgroundColor: '#0f172a',
              border: isSearchOpen ? '1.5px solid #38bdf8' : '1px solid #475569',
              borderRadius: '6px', padding: '2px 8px',
              boxShadow: isSearchOpen ? '0 0 0 3px rgba(56,189,248,0.15)' : 'none'
            }}>
              <span style={{ fontSize: '0.9rem', marginRight: '6px', color: '#38bdf8' }}>🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                value={destSearchQuery}
                placeholder="Search destination across all Seven Sister States (e.g. Tawang, Kohima, Aizawl, Shillong)..."
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setDestSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredDestinations.length > 0) {
                    handleSelectDestination(filteredDestinations[0].id);
                  } else if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                  }
                }}
                style={{
                  flex: 1, backgroundColor: 'transparent', border: 'none', color: 'white',
                  fontSize: '0.8rem', padding: '6px 0', outline: 'none', fontWeight: 500
                }}
              />
              {destSearchQuery && (
                <button
                  onClick={() => {
                    setDestSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  style={{
                    background: 'none', border: 'none', color: '#94a3b8',
                    cursor: 'pointer', fontSize: '0.85rem', padding: '0 4px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* AUTOCOMPLETE FLOATING SEARCH RESULTS PANEL */}
            {isSearchOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px',
                backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.5)', zIndex: 1000,
                maxHeight: '380px', overflowY: 'auto', padding: '8px'
              }}>
                {/* State Quick-Filter Pills Inside Search Bar */}
                <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid #1e293b', marginBottom: '6px' }}>
                  {SEVEN_SISTER_STATES.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStateFilter(st)}
                      style={{
                        padding: '3px 7px', fontSize: '0.66rem', borderRadius: '4px', border: 'none',
                        cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 700,
                        backgroundColor: selectedStateFilter === st ? '#2563eb' : '#1e293b',
                        color: selectedStateFilter === st ? 'white' : '#94a3b8'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '0.7rem', color: '#64748b', padding: '4px 6px', fontWeight: 700 }}>
                  Found {filteredDestinations.length} Seven Sister destinations:
                </div>

                {filteredDestinations.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                    No matching Seven Sister destinations found for "{destSearchQuery}".
                  </div>
                ) : (
                  filteredDestinations.map((node) => {
                    const badge = getStateBadgeStyle(node.state);
                    const isCurrent = node.id === selectedEnd;
                    return (
                      <div
                        key={node.id}
                        onClick={() => handleSelectDestination(node.id)}
                        style={{
                          padding: '7px 10px', borderRadius: '6px', cursor: 'pointer',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          backgroundColor: isCurrent ? '#1e293b' : 'transparent',
                          transition: 'background-color 0.15s ease',
                          marginBottom: '2px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isCurrent ? '#1e293b' : 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.9rem' }}>📍</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'white' }}>
                              {node.name}
                            </div>
                            <div style={{ fontSize: '0.67rem', color: '#64748b' }}>
                              {node.corridor}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px',
                            backgroundColor: badge.bg, color: badge.text, border: `1px solid ${badge.border}`
                          }}>
                            {node.state}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>
                            Select ➔
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Action Button: Scan Route */}
          <button
            onClick={() => planRouteAndCheckHazards(selectedStart, selectedEnd)}
            disabled={isCalculatingRoute}
            style={{
              padding: '6px 14px', backgroundColor: '#2563eb', color: 'white',
              border: 'none', borderRadius: '6px', fontWeight: 700, cursor: isCalculatingRoute ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(37,99,235,0.4)'
            }}
          >
            {isCalculatingRoute ? 'Scanning Hazards...' : '⚡ Scan Corridor Hazards'}
          </button>

          {/* Live Route Weather Badge */}
          {currentRoutePlan?.weather && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#0f172a', padding: '4px 10px', borderRadius: '6px',
              border: '1px solid #334155', fontSize: '0.74rem', color: '#e2e8f0'
            }}>
              <span style={{ fontSize: '0.92rem' }}>{currentRoutePlan.weather.icon || '🌦️'}</span>
              <span style={{ fontWeight: 700 }}>{currentRoutePlan.weather.condition}</span>
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>{currentRoutePlan.weather.temperatureC}°C</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#94a3b8' }}>Rain: <strong style={{ color: '#7dd3fc' }}>{currentRoutePlan.weather.rainfall1hMm} mm/h</strong></span>
            </div>
          )}

          {/* Route Display Toggles: Only shown when hazard exists AND an alternative detour is available */}
          {currentRoutePlan && currentRoutePlan.hasHazard && !checkIsSamePath(currentRoutePlan) && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>Display:</span>
              <button
                onClick={() => setRouteViewMode('BOTH')}
                style={{
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  backgroundColor: routeViewMode === 'BOTH' ? '#3b82f6' : '#334155', color: 'white'
                }}
              >
                Both Paths
              </button>
              <button
                onClick={() => setRouteViewMode('PRIMARY')}
                style={{
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  backgroundColor: routeViewMode === 'PRIMARY' ? '#dc2626' : '#334155', color: 'white'
                }}
              >
                🔴 Dangerous Path
              </button>
              <button
                onClick={() => setRouteViewMode('SAFE')}
                style={{
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  backgroundColor: routeViewMode === 'SAFE' ? '#059669' : '#334155', color: 'white'
                }}
              >
                🟢 Safe Detour
              </button>
            </div>
          )}
        </div>

        {/* 3. SEVEN SISTERS POPULAR CORRIDORS QUICK PRESET BAR */}
        <div style={{
          backgroundColor: '#0f172a', padding: '0.35rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto',
          borderTop: '1px solid #1e293b', fontSize: '0.72rem'
        }}>
          <span style={{ color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>Hotspot Corridors:</span>

          <button
            onClick={() => {
              setSelectedStart('GAU');
              setSelectedEnd('SIL');
              setDestSearchQuery('Silchar (Assam)');
              planRouteAndCheckHazards('GAU', 'SIL');
            }}
            style={{
              padding: '2px 8px', backgroundColor: '#1e293b', color: '#fca5a5',
              border: '1px solid #7f1d1d', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600
            }}
          >
            🏔️ Guwahati ➔ Silchar (Sonapur Mudflow)
          </button>

          <button
            onClick={() => {
              setSelectedStart('TEZ');
              setSelectedEnd('TAW');
              setDestSearchQuery('Tawang (Arunachal)');
              planRouteAndCheckHazards('TEZ', 'TAW');
            }}
            style={{
              padding: '2px 8px', backgroundColor: '#1e293b', color: '#fed7aa',
              border: '1px solid #9a3412', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600
            }}
          >
            🏔️ Tezpur ➔ Tawang (Sela Pass Hazard)
          </button>

          <button
            onClick={() => {
              setSelectedStart('DIM');
              setSelectedEnd('KOH');
              setDestSearchQuery('Kohima (Nagaland)');
              planRouteAndCheckHazards('DIM', 'KOH');
            }}
            style={{
              padding: '2px 8px', backgroundColor: '#1e293b', color: '#fef08a',
              border: '1px solid #854d0e', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600
            }}
          >
            🏔️ Dimapur ➔ Kohima (Dzüdza Sinkage)
          </button>

          <button
            onClick={() => {
              setSelectedStart('SIL');
              setSelectedEnd('AIZ');
              setDestSearchQuery('Aizawl (Mizoram)');
              planRouteAndCheckHazards('SIL', 'AIZ');
            }}
            style={{
              padding: '2px 8px', backgroundColor: '#1e293b', color: '#fbcfe8',
              border: '1px solid #9d174d', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600
            }}
          >
            🏔️ Silchar ➔ Aizawl (NH-306 Kolasib Slip)
          </button>

          <button
            onClick={() => {
              setSelectedStart('NAG');
              setSelectedEnd('JOR');
              setDestSearchQuery('Jorhat (Assam)');
              planRouteAndCheckHazards('NAG', 'JOR');
            }}
            style={{
              padding: '2px 8px', backgroundColor: '#1e293b', color: '#bae6fd',
              border: '1px solid #0369a1', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600
            }}
          >
            🌊 Nagaon ➔ Jorhat (Kaziranga Flood)
          </button>

          <button
            onClick={() => {
              setSelectedStart('GAU');
              setSelectedEnd('SHL');
              setDestSearchQuery('Shillong (Meghalaya)');
              planRouteAndCheckHazards('GAU', 'SHL');
            }}
            style={{
              padding: '2px 8px', backgroundColor: '#1e293b', color: '#a7f3d0',
              border: '1px solid #047857', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600
            }}
          >
            🚗 Guwahati ➔ Shillong (Scenic NH-06)
          </button>

          <button
            onClick={() => {
              setSelectedStart('GAU');
              setSelectedEnd('AGT');
              setDestSearchQuery('Agartala (Tripura)');
              planRouteAndCheckHazards('GAU', 'AGT');
            }}
            style={{
              padding: '2px 8px', backgroundColor: '#1e293b', color: '#99f6e4',
              border: '1px solid #0f766e', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600
            }}
          >
            🚗 Guwahati ➔ Agartala (Tripura Transit)
          </button>
        </div>
      </header>

      {/* 4. DYNAMIC HAZARD ALERT BANNER (If Landslide / Flood Detected on Route) */}
      {currentRoutePlan && currentRoutePlan.hasHazard && routeViewMode !== 'SAFE' && (
        <div style={{
          backgroundColor: '#991b1b', color: 'white', padding: '0.65rem 1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)', borderBottom: '2px solid #ef4444',
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem', animation: 'bounce 1s infinite' }}>🚨</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>
                ACTIVE HAZARD DETECTED ON PRIMARY ROUTE!
              </div>
              <div style={{ fontSize: '0.78rem', color: '#fecaca', marginTop: '2px' }}>
                {currentRoutePlan.alertMessage}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                setRouteViewMode('SAFE');
                setAcceptedSafeRoute(true);
              }}
              style={{
                backgroundColor: '#10b981', color: '#064e3b',
                padding: '7px 14px', borderRadius: '6px', border: 'none',
                fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
              }}
            >
              {acceptedSafeRoute ? '✓ Safe Reroute Engaged' : '🛡️ Take Suggested Safe Detour'}
            </button>
          </div>
        </div>
      )}

      {currentRoutePlan && currentRoutePlan.hasHazard && routeViewMode === 'SAFE' && (
        <div style={{
          backgroundColor: '#065f46', color: '#d1fae5', padding: '0.6rem 1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)', borderBottom: '2px solid #10b981',
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>
                AI SUGGESTED SAFE DETOUR ENGAGED
              </div>
              <div style={{ fontSize: '0.78rem', color: '#a7f3d0', marginTop: '2px' }}>
                Active hazard zone on direct route bypassed. Navigating via verified safe corridor.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setRouteViewMode('BOTH');
              setAcceptedSafeRoute(false);
            }}
            style={{
              backgroundColor: '#1e293b', color: '#94a3b8',
              padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155',
              fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer'
            }}
          >
            Show Comparison
          </button>
        </div>
      )}

      {currentRoutePlan && !currentRoutePlan.hasHazard && (
        <div style={{
          backgroundColor: '#065f46', color: '#d1fae5', padding: '0.55rem 1.25rem',
          fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
          borderBottom: '2px solid #059669', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <span style={{ fontSize: '1.2rem' }}>✓</span>
          <div>
            <div><strong>Clear Highway Corridor:</strong> No active landslides or flood inundations detected along this route ({startHub?.name} ➔ {endHub?.name}).</div>
            <div style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 500 }}>Corridor verified clear based on real-time geotechnical slope and rainfall telemetry.</div>
          </div>
        </div>
      )}

      {/* 5. MAIN MAP CONTAINER */}
      <main
        style={{ flex: 1, position: 'relative', width: '100%', minHeight: 0, overflow: 'hidden', backgroundColor: '#0f172a' }}
        onClick={() => {
          if (isSearchOpen) setIsSearchOpen(false);
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <Map
              defaultCenter={{ lat: 26.1445, lng: 91.7362 }}
              defaultZoom={7.5}
              gestureHandling={'greedy'}
              disableDefaultUI={false}
              mapId="DEMO_MAP_ID"
              onClick={handleMapClick}
              style={{ width: '100%', height: '100%' }}
            >
            <MapController
              targetCoords={mapTarget}
              routeCoords={
                routeViewMode === 'SAFE' && currentRoutePlan?.suggestedSafeRoute?.roadGeometry
                  ? currentRoutePlan.suggestedSafeRoute.roadGeometry
                  : (currentRoutePlan?.primaryRoute?.roadGeometry || currentRoutePlan?.primaryRoute?.coordinates || null)
              }
            />

            {/* DUAL ROUTE RENDERER: PRIMARY (RED) & SAFE DETOUR (GREEN) - 100% ROAD-SNAPPED */}
            {currentRoutePlan && (
              <DualRouteVisualizer
                primaryRoute={currentRoutePlan.primaryRoute || null}
                safeRoute={currentRoutePlan.suggestedSafeRoute || null}
                hasHazard={currentRoutePlan.hasHazard}
                viewMode={routeViewMode}
                isSamePath={checkIsSamePath(currentRoutePlan)}
              />
            )}

            {/* 1. SEVEN SISTERS HUBS PINS: ONLY THE ACTIVE START AND DESTINATION */}
            {availableNodes
              .filter((node) => node.id === selectedStart || node.id === selectedEnd)
              .map((node) => {
                const isSelectedStart = node.id === selectedStart;
                const pinBg = isSelectedStart ? '#2563eb' : '#dc2626';
                const pinEmoji = isSelectedStart ? '🟢 START:' : '🏁 DEST:';

                return (
                  <AdvancedMarker
                    key={`hub-${node.id}`}
                    position={{ lat: node.lat, lng: node.lng }}
                  >
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'
                    }}>
                      <div style={{
                        backgroundColor: pinBg, color: 'white', padding: '4px 9px', borderRadius: '12px',
                        fontSize: '0.74rem', fontWeight: 800, border: '2px solid white',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <span>{pinEmoji}</span>
                        <span>{node.name.split(' (')[0]}</span>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}


            {/* 2. ROUTE HAZARD PINS: CLEARED AS SOON AS USER CHOOSES SAFE PATH */}
            {currentRoutePlan?.hasHazard && routeViewMode !== 'SAFE' && currentRoutePlan.hazardsOnPrimaryRoute?.map((h: any, idx: number) => (
              <AdvancedMarker key={`route-hazard-${idx}`} position={h.midpoint}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                  transform: 'translateY(-10px)'
                }}>
                  <div style={{
                    backgroundColor: '#dc2626', color: 'white', padding: '5px 10px', borderRadius: '12px',
                    fontSize: '0.72rem', fontWeight: 800, border: '2px solid white',
                    boxShadow: '0 4px 14px rgba(220,38,38,0.65)', display: 'flex', alignItems: 'center', gap: '5px'
                  }}>
                    <span style={{ fontSize: '0.9rem' }}>⚠️</span>
                    <span>DANGER: {h.hazardType}</span>
                  </div>
                  <div style={{
                    width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                    borderTop: '6px solid #dc2626'
                  }} />
                </div>
              </AdvancedMarker>
            ))}

            {/* 3. INDIVIDUAL HAZARD DETAIL: ONLY IF USER SPECIFICALLY CLICKS A HOTSPOT IN THE RADAR LIST */}
            {selectedHazard && (
              <AdvancedMarker
                position={{ lat: selectedHazard.lat, lng: selectedHazard.lng }}
                onClick={() => setSelectedHazard(null)}
              >
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                  transform: 'translateY(-8px)'
                }}>
                  <div style={{
                    backgroundColor: '#ea580c', color: 'white', padding: '4px 9px', borderRadius: '14px',
                    fontSize: '0.68rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', gap: '4px', border: '1.5px solid white'
                  }}>
                    <span>📍</span>
                    <span>{selectedHazard.name}</span>
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Custom Evaluated Point Marker */}
            {customPrediction && (
              <AdvancedMarker position={{ lat: customPrediction.location?.lat || customPrediction.lat, lng: customPrediction.location?.lng || customPrediction.lng }}>
                <div style={{
                  backgroundColor: '#7c3aed', color: 'white', padding: '4px 8px',
                  borderRadius: '16px', fontSize: '0.72rem', fontWeight: 800,
                  border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.35)'
                }}>
                  📍 Evaluated Point
                </div>
              </AdvancedMarker>
            )}

            {/* Hazard InfoWindow */}
            {selectedHazard && (
              <InfoWindow
                position={{ lat: selectedHazard.lat, lng: selectedHazard.lng }}
                onCloseClick={() => setSelectedHazard(null)}
              >
                <div style={{ color: '#0f172a', padding: '4px', maxWidth: '280px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{selectedHazard.name}</h4>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                      {selectedHazard.severityBadge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '6px' }}>{selectedHazard.corridor}</div>

                  <div style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                    🏔️ <strong>Landslide:</strong> {selectedHazard.landslide.probability} ({selectedHazard.landslide.hazardLevel})
                  </div>
                  <div style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                    🌊 <strong>Flood:</strong> {selectedHazard.flood.probability} ({selectedHazard.flood.hazardLevel})
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#334155', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
                    📢 {selectedHazard.advisory}
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Dynamic Fleet Vehicles */}
            {positions.map((pos) => (
              <AdvancedMarker key={pos.id} position={{ lat: pos.latitude, lng: pos.longitude }}>
                <div style={{ fontSize: '24px', cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                  🚛
                </div>
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </div>

        {/* 6. ROUTE COMPARISON & SAFETY DETOUR CARD (Bottom-Left) */}
        {currentRoutePlan && (
          <div style={{
            position: 'absolute', bottom: 20, left: 20, zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(8px)',
            borderRadius: '12px', boxShadow: '0 12px 28px -5px rgba(0,0,0,0.25)',
            width: '390px', border: '1px solid #e2e8f0', overflow: 'hidden',
            maxHeight: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                    Seven Sisters Route Safety Assessment
                  </div>
                  <span style={{
                    fontSize: '0.56rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px',
                    backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', gap: '3px'
                  }}>
                    <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                    LIVE
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {startHub?.name} ➔ {endHub?.name}
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#e2e8f0', color: '#334155' }}>
                AI Reroute Engine
              </span>
            </div>

            <div style={{ padding: '12px 14px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
              {/* Route Status Card */}
              <div style={{
                padding: '10px', borderRadius: '8px', marginBottom: '8px',
                backgroundColor: currentRoutePlan.hasHazard ? '#fef2f2' : '#f0fdf4',
                border: currentRoutePlan.hasHazard ? '1.5px solid #f87171' : '1.5px solid #86efac'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: currentRoutePlan.hasHazard ? '#991b1b' : '#166534' }}>
                    {currentRoutePlan.hasHazard ? '🔴 Dangerous Route' : '🟢 Safe Corridor'} ({currentRoutePlan.primaryRoute?.estTimeMinutes} mins)
                  </span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px',
                    backgroundColor: currentRoutePlan.hasHazard ? '#fee2e2' : '#dcfce7',
                    color: currentRoutePlan.hasHazard ? '#b91c1c' : '#15803d'
                  }}>
                    {currentRoutePlan.hasHazard ? '⚠️ HAZARDOUS' : '✓ 100% CLEAR'}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '3px' }}>
                  Path: {currentRoutePlan.primaryRoute?.coordinates?.map((c: any) => c.name).join(' ➔ ')}
                </div>

                {currentRoutePlan.hasHazard && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#7f1d1d' }}>
                    <strong>Detected Hazards:</strong>
                    <ul style={{ margin: '2px 0 0 0', paddingLeft: '14px' }}>
                      {currentRoutePlan.hazardsOnPrimaryRoute?.map((h: any, i: number) => (
                        <li key={i}>{h.corridorName}: {h.hazardType} (LS: {h.landslide.probability}, Flood: {h.flood.level})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* LIVE CORRIDOR WEATHER TELEMETRY CARD */}
              {currentRoutePlan.weather && (
                <div style={{
                  padding: '9px 11px', borderRadius: '8px', marginBottom: '8px',
                  backgroundColor: '#f8fafc', border: '1px solid #cbd5e1'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.78rem', color: '#0f172a' }}>
                      <span style={{ fontSize: '1rem' }}>{currentRoutePlan.weather.icon || '🌦️'}</span>
                      <span>Corridor Weather: {currentRoutePlan.weather.condition}</span>
                    </div>
                    <span style={{
                      fontSize: '0.74rem', fontWeight: 800, padding: '2px 7px', borderRadius: '4px',
                      backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd'
                    }}>
                      {currentRoutePlan.weather.temperatureC}°C
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
                    <div style={{ backgroundColor: 'white', padding: '4px 6px', borderRadius: '5px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700 }}>Rain (1h / 24h)</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7' }}>
                        {currentRoutePlan.weather.rainfall1hMm} / {currentRoutePlan.weather.rainfall24hMm} mm
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '4px 6px', borderRadius: '5px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700 }}>Humidity</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155' }}>
                        {currentRoutePlan.weather.humidityPercent}%
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '4px 6px', borderRadius: '5px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700 }}>Wind Speed</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155' }}>
                        {currentRoutePlan.weather.windSpeedKmh} km/h
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Case 1: Hazard exists AND an alternate safe detour is available */}
              {currentRoutePlan.hasHazard && !checkIsSamePath(currentRoutePlan) && (
                <div style={{
                  padding: '10px', borderRadius: '8px',
                  backgroundColor: '#f0fdf4', border: '1.5px solid #34d399'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#065f46' }}>
                      🟢 Suggested Safe Detour ({currentRoutePlan.suggestedSafeRoute?.estTimeMinutes} mins)
                    </span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px',
                      backgroundColor: '#dcfce7', color: '#15803d'
                    }}>
                      🛡️ 100% HAZARD-FREE
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#14532d', marginTop: '3px' }}>
                    Path: {currentRoutePlan.suggestedSafeRoute?.coordinates?.map((c: any) => c.name).join(' ➔ ')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '4px' }}>
                    ✓ <strong>Bypass Advantage:</strong> Safely diverts around active mountain slips and waterlogged highway sectors.
                  </div>

                  <button
                    onClick={() => {
                      setRouteViewMode('SAFE');
                      setAcceptedSafeRoute(true);
                    }}
                    style={{
                      width: '100%', marginTop: '8px', padding: '7px 10px',
                      backgroundColor: '#059669', color: 'white', border: 'none',
                      borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {acceptedSafeRoute ? '✓ Active Detour Selected' : 'Engage Suggested Safe Detour'}
                  </button>
                </div>
              )}

              {/* Case 2: Hazard exists, but safe path and dangerous path are same (single isolated corridor) */}
              {currentRoutePlan.hasHazard && checkIsSamePath(currentRoutePlan) && (
                <div style={{
                  padding: '9px 11px', borderRadius: '8px',
                  backgroundColor: '#fef2f2', border: '1.5px solid #fca5a5', marginTop: '4px'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>⚠️</span> Single Corridor - No Bypass Detour Available
                  </div>
                  <div style={{ fontSize: '0.71rem', color: '#7f1d1d', marginTop: '3px', lineHeight: 1.35 }}>
                    This isolated mountain highway has no alternate road detour. Showing the primary hazardous corridor. Proceed with convoy or heavy transport only.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. RIGHT PANEL: REGIONAL HAZARD RADAR */}
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)', width: '315px',
          border: '1px solid #e2e8f0',
          maxHeight: 'calc(100% - 32px)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.2s ease'
        }}>
          {/* Header row with Title and Controls */}
          <div style={{
            padding: '10px 12px',
            backgroundColor: '#f8fafc',
            borderBottom: isRadarCollapsed ? 'none' : '1px solid #e2e8f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0
          }}>
            <div
              onClick={() => setIsRadarCollapsed(!isRadarCollapsed)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}
              title="Click to collapse/expand"
            >
              <span style={{ fontSize: '0.9rem' }}>📡</span>
              <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>Hazard Radar</h3>
              <span style={{
                fontSize: '0.56rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px',
                backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', gap: '3px'
              }}>
                <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                LIVE
              </span>
              <span style={{
                fontSize: '0.62rem', fontWeight: 800, padding: '1px 6px', borderRadius: '10px',
                backgroundColor: '#fee2e2', color: '#991b1b'
              }}>
                {filteredHazardLocations.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                onClick={() => setShowAllHotspots(!showAllHotspots)}
                title={showAllHotspots ? 'Hide all pins from map' : 'Show all hotspot pins on map'}
                style={{
                  fontSize: '0.62rem', fontWeight: 700, padding: '3px 6px', borderRadius: '4px',
                  border: '1px solid #cbd5e1', cursor: 'pointer',
                  backgroundColor: showAllHotspots ? '#fee2e2' : '#ffffff',
                  color: showAllHotspots ? '#991b1b' : '#475569'
                }}
              >
                {showAllHotspots ? '✕ Pins' : '📍 Pins'}
              </button>
              <button
                onClick={() => setIsRadarCollapsed(!isRadarCollapsed)}
                title={isRadarCollapsed ? 'Expand Radar' : 'Minimize Radar'}
                style={{
                  fontSize: '0.72rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px',
                  border: '1px solid #cbd5e1', cursor: 'pointer',
                  backgroundColor: '#ffffff', color: '#475569', lineHeight: 1
                }}
              >
                {isRadarCollapsed ? '▼' : '▲'}
              </button>
            </div>
          </div>

          {/* Collapsible Body */}
          {!isRadarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '4px', padding: '8px 12px 6px 12px', flexShrink: 0 }}>
                <button
                  onClick={() => setActiveHazardFilter('ALL')}
                  style={{
                    flex: 1, padding: '3px 5px', fontSize: '0.66rem', fontWeight: 700, borderRadius: '4px',
                    border: 'none', cursor: 'pointer',
                    backgroundColor: activeHazardFilter === 'ALL' ? '#0f172a' : '#f1f5f9',
                    color: activeHazardFilter === 'ALL' ? 'white' : '#475569'
                  }}
                >
                  All ({allLocations.length})
                </button>
                <button
                  onClick={() => setActiveHazardFilter('LANDSLIDE')}
                  style={{
                    flex: 1, padding: '3px 5px', fontSize: '0.66rem', fontWeight: 700, borderRadius: '4px',
                    border: 'none', cursor: 'pointer',
                    backgroundColor: activeHazardFilter === 'LANDSLIDE' ? '#ea580c' : '#f1f5f9',
                    color: activeHazardFilter === 'LANDSLIDE' ? 'white' : '#475569'
                  }}
                >
                  🏔️ Landslide
                </button>
                <button
                  onClick={() => setActiveHazardFilter('FLOOD')}
                  style={{
                    flex: 1, padding: '3px 5px', fontSize: '0.66rem', fontWeight: 700, borderRadius: '4px',
                    border: 'none', cursor: 'pointer',
                    backgroundColor: activeHazardFilter === 'FLOOD' ? '#0284c7' : '#f1f5f9',
                    color: activeHazardFilter === 'FLOOD' ? 'white' : '#475569'
                  }}
                >
                  🌊 Flood
                </button>
              </div>

              {/* Scrollable Hotspots List */}
              <div style={{
                flex: 1, minHeight: 0, overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '5px',
                padding: '4px 12px 10px 12px'
              }}>
                {filteredHazardLocations.map(spot => (
                  <div
                    key={spot.id}
                    onClick={() => {
                      setSelectedHazard(spot);
                      setMapTarget({ lat: spot.lat, lng: spot.lng });
                    }}
                    style={{
                      padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0',
                      backgroundColor: selectedHazard?.id === spot.id ? '#eff6ff' : 'white',
                      cursor: 'pointer', transition: 'background-color 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.76rem', color: '#0f172a' }}>{spot.name}</div>
                      <span style={{
                        fontSize: '0.58rem', fontWeight: 800, padding: '1px 4px', borderRadius: '3px',
                        backgroundColor: spot.severityBadge === 'CRITICAL' ? '#fee2e2' : '#ffedd5',
                        color: spot.severityBadge === 'CRITICAL' ? '#991b1b' : '#9a3412'
                      }}>
                        {spot.severityBadge}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.68rem', marginTop: '2px' }}>
                      <span style={{ color: spot.landslide.predicted ? '#ea580c' : '#94a3b8' }}>🏔️ {spot.landslide.probability}</span>
                      <span style={{ color: spot.flood.predicted ? '#0284c7' : '#94a3b8' }}>🌊 {spot.flood.probability}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 8. MODEL INSPECTOR & CONTINUAL LEARNING MODAL */}
        {showModelModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              backgroundColor: 'white', width: '90%', maxWidth: '560px', maxHeight: '85vh',
              borderRadius: '16px', padding: '1.5rem', overflowY: 'auto', color: '#1e293b'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>🏔️🌊 Dual-Hazard Model & Fine-Tuning</h2>
                <button onClick={() => setShowModelModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
              </div>

              {/* Stress simulation */}
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem' }}>Seven Sisters Live Parameter Stress Testing</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                  <div>
                    <label>24h Rain: {simRain} mm</label>
                    <input type="range" min="0" max="250" value={simRain} onChange={e => setSimRain(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label>Slope: {simSlope}°</label>
                    <input type="range" min="0" max="60" value={simSlope} onChange={e => setSimSlope(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                </div>
                <button onClick={runStressSimulation} style={{ marginTop: '8px', padding: '5px 10px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                  Evaluate
                </button>
                {simResult && (
                  <div style={{ marginTop: '6px', fontSize: '0.75rem', backgroundColor: 'white', padding: '6px', borderRadius: '4px' }}>
                    LS: {(simResult.landslide?.landslide_probability * 100).toFixed(1)}% | FL: {(simResult.flood?.flood_probability * 100).toFixed(1)}% | Delay: {simResult.risk_multiplier}x
                  </div>
                )}
              </div>

              {/* Continual learning */}
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem' }}>Continual Learning Batch</h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 8px 0' }}>Ingest ground-truth field incident reports to update model trees live.</p>
                <button onClick={handleTriggerFineTune} disabled={isFineTuning} style={{ padding: '6px 14px', backgroundColor: isFineTuning ? '#94a3b8' : '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: isFineTuning ? 'not-allowed' : 'pointer' }}>
                  {isFineTuning ? 'Fine-Tuning...' : 'Trigger Fine-Tuning Batch'}
                </button>
                {fineTuneStatus && <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>{fineTuneStatus}</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
