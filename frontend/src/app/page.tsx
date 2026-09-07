'use client';

import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import toast from 'react-hot-toast';
import {
  Navigation,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Radio,
  Activity,
  Sparkles,
  RefreshCw,
  CloudRain,
  Wind,
  Thermometer,
  Search,
  ArrowLeftRight,
  SlidersHorizontal,
  UserPlus,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Zap,
  Maximize2,
  Minimize2,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  Compass,
  LifeBuoy,
  Crosshair,
  Send,
  Eye,
  Sliders
} from 'lucide-react';

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

const TrafficLayerComponent = ({ show }: { show: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const trafficLayer = new google.maps.TrafficLayer();
    if (show) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }
    return () => trafficLayer.setMap(null);
  }, [map, show]);
  return null;
};

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
      map.fitBounds(bounds, { top: 90, right: 360, bottom: 120, left: 420 });
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

// Dual-Route Visualizer with high-visibility glow
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

  // 1. Render Hazardous Road in Crimson Red
  useEffect(() => {
    if (!map) return;

    if (!primaryPolylineRef.current) {
      primaryPolylineRef.current = new google.maps.Polyline({
        map: null,
        strokeColor: '#ef4444',
        strokeWeight: 6,
        strokeOpacity: 0.95,
        zIndex: 5
      });
    }

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
          strokeColor: '#ef4444',
          strokeWeight: 6,
          strokeOpacity: 0.95,
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

  // 2. Render Safe Route in Vibrant Emerald Green
  useEffect(() => {
    if (!map) return;

    if (!safePolylineRef.current) {
      safePolylineRef.current = new google.maps.Polyline({
        map: null,
        strokeColor: '#10b981',
        strokeWeight: 7,
        strokeOpacity: 0.98,
        zIndex: 10
      });
    }

    let routeToRender = null;
    if (!hasHazard) {
      routeToRender = primaryRoute;
    } else if (hasHazard && !isSamePath && viewMode !== 'PRIMARY') {
      routeToRender = safeRoute || primaryRoute;
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
          strokeColor: '#10b981',
          strokeWeight: 7,
          strokeOpacity: 0.98,
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
  const [availableNodes, setAvailableNodes] = useState<any[]>(SEVEN_SISTER_HUBS);

  // Active Route Plan & Hazard Alert state
  const [selectedStart, setSelectedStart] = useState('GAU');
  const [selectedEnd, setSelectedEnd] = useState('SIL');
  const [currentRoutePlan, setCurrentRoutePlan] = useState<any | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeViewMode, setRouteViewMode] = useState<'BOTH' | 'SAFE' | 'PRIMARY'>('BOTH');
  const [acceptedSafeRoute, setAcceptedSafeRoute] = useState(false);
  const [isRouteCardCollapsed, setIsRouteCardCollapsed] = useState(false);

  // Search Bar State
  const [destSearchQuery, setDestSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Regional Hazard Locations & Radar
  const [hazardData, setHazardData] = useState<any | null>(null);
  const [selectedHazard, setSelectedHazard] = useState<any | null>(null);
  const [activeHazardFilter, setActiveHazardFilter] = useState<'ALL' | 'LANDSLIDE' | 'FLOOD'>('ALL');
  const [mapTarget, setMapTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [showAllHotspots, setShowAllHotspots] = useState(false);
  const [isRadarCollapsed, setIsRadarCollapsed] = useState(false);

  // Custom click predictor
  const [customPrediction, setCustomPrediction] = useState<any | null>(null);

  // Model Fine-Tuning Modal
  const [showModelModal, setShowModelModal] = useState(false);
  const [simRain, setSimRain] = useState(90);
  const [simSlope, setSimSlope] = useState(38);
  const [simResult, setSimResult] = useState<any | null>(null);
  const [isFineTuning, setIsFineTuning] = useState(false);
  const [fineTuneStatus, setFineTuneStatus] = useState('');

  // Live Weather Modal
  const [showWeatherTab, setShowWeatherTab] = useState(false);
  const [liveWeatherHubs, setLiveWeatherHubs] = useState<any[]>([]);

  // Traffic and SOS
  const [showTraffic, setShowTraffic] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch nodes from backend
  const fetchNodes = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/route/nodes');
      if (res.ok) {
        const data = await res.json();
        if (data.nodes && data.nodes.length > 0) {
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
      console.error('Failed to fetch hazard predictions:', err);
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
        setRouteViewMode(data.hasHazard ? 'BOTH' : 'PRIMARY');
        setAcceptedSafeRoute(false);

        if (data.hasHazard) {
          toast.error(
            <div>
              <div style={{ fontWeight: 800 }}>⚠️ Critical Hazard on Route!</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                Detour available via safe highway corridor.
              </div>
            </div>,
            { duration: 5000 }
          );
        } else {
          toast.success('Highway corridor is clear of active hazards', { duration: 3000 });
        }
      }
    } catch (err) {
      console.error('Failed to calculate route:', err);
      toast.error('Could not reach routing engine');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    toast('Syncing real-time telemetry...', { icon: '🔄' });
    await Promise.all([
      fetchHazardLocations(),
      planRouteAndCheckHazards(selectedStart, selectedEnd),
    ]);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Telemetry synchronized with all 8 state hubs');
    }, 600);
  };

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
    planRouteAndCheckHazards('GAU', 'SIL');

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

    const fetchRegionalWeather = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/weather/live');
        if (res.ok) {
          const data = await res.json();
          setLiveWeatherHubs(data.cities || []);
        }
      } catch (_) {}
    };
    fetchRegionalWeather();

    const fleetInterval = setInterval(fetchFleetData, 10000);
    const weatherTabInterval = setInterval(fetchRegionalWeather, 20 * 60 * 1000);
    const hazardInterval = setInterval(fetchHazardLocations, 5000);

    return () => {
      clearInterval(fleetInterval);
      clearInterval(weatherTabInterval);
      clearInterval(hazardInterval);
    };
  }, []);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Filter destinations
  const filteredDestinations = availableNodes.filter(node => {
    if (selectedStateFilter !== 'ALL' && node.state !== selectedStateFilter) return false;
    if (!destSearchQuery.trim()) return true;
    const q = destSearchQuery.toLowerCase();
    return (
      node.name.toLowerCase().includes(q) ||
      node.state.toLowerCase().includes(q) ||
      (node.corridor && node.corridor.toLowerCase().includes(q))
    );
  });

  const handleSelectDestination = (destId: string) => {
    setSelectedEnd(destId);
    const found = availableNodes.find(n => n.id === destId);
    if (found) {
      setDestSearchQuery(found.name);
    }
    setIsSearchOpen(false);
    planRouteAndCheckHazards(selectedStart, destId);
  };

  const handleSwapRoute = () => {
    const newStart = selectedEnd;
    const newEnd = selectedStart;
    setSelectedStart(newStart);
    setSelectedEnd(newEnd);
    const found = availableNodes.find(n => n.id === newEnd);
    if (found) setDestSearchQuery(found.name);
    planRouteAndCheckHazards(newStart, newEnd);
  };

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
          locationName: `Corridor Point (${lat.toFixed(3)}, ${lng.toFixed(3)})`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomPrediction(data);
      }
    } catch (err) {
      console.error('Point prediction error:', err);
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

  const startHub = availableNodes.find(n => n.id === selectedStart);
  const endHub = availableNodes.find(n => n.id === selectedEnd);

  const getStateBadgeStyle = (state: string) => {
    switch (state) {
      case 'Assam': return { bg: 'rgba(5, 150, 105, 0.2)', text: '#34d399', border: '#059669' };
      case 'Meghalaya': return { bg: 'rgba(2, 132, 199, 0.2)', text: '#38bdf8', border: '#0284c7' };
      case 'Arunachal Pradesh': return { bg: 'rgba(99, 102, 241, 0.2)', text: '#a5b4fc', border: '#6366f1' };
      case 'Nagaland': return { bg: 'rgba(217, 119, 6, 0.2)', text: '#fbbf24', border: '#d97706' };
      case 'Manipur': return { bg: 'rgba(147, 51, 234, 0.2)', text: '#c084fc', border: '#9333ea' };
      case 'Mizoram': return { bg: 'rgba(219, 39, 119, 0.2)', text: '#f472b6', border: '#db2777' };
      case 'Tripura': return { bg: 'rgba(13, 148, 136, 0.2)', text: '#2dd4bf', border: '#0d9488' };
      case 'Sikkim': return { bg: 'rgba(8, 145, 178, 0.2)', text: '#22d3ee', border: '#0891b2' };
      default: return { bg: 'rgba(71, 85, 105, 0.2)', text: '#94a3b8', border: '#475569' };
    }
  };

  const isCurrentRouteHazardous = Boolean(currentRoutePlan?.hasHazard);
  const hasAlternativeDetour = Boolean(isCurrentRouteHazardous && !checkIsSamePath(currentRoutePlan));

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#090d16', color: '#f8fafc' }}>
      
      {/* 1. TOP ENTERPRISE COMMAND HEADER */}
      <header style={{
        backgroundColor: '#0b1120',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 110,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        {/* Main Branding & Action Button Suite */}
        <div style={{
          padding: '0.65rem 1.4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Logo & Operational Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <Compass size={22} color="#ffffff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(to right, #ffffff, #93c5fd, #67e8f9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  NER SENTRY
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(37, 99, 235, 0.18)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  letterSpacing: '0.04em'
                }}>
                  DUAL-HAZARD AI INTELLIGENCE
                </span>

                {isOffline && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    border: '1px solid #ef4444'
                  }}>
                    OFFLINE SYNC ACTIVE
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.72rem',
                color: '#94a3b8',
                marginTop: '3px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span className="live-indicator" />
                  <strong style={{ color: '#e2e8f0' }}>Radar Live:</strong> 8 States Monitored
                </span>
                <span>•</span>
                <span style={{ color: '#cbd5e1' }}>Graph Engine: Neo4j Dijkstra</span>
                <span>•</span>
                <span style={{ color: '#38bdf8' }}>Active Route: {startHub?.name.split(' (')[0]} ➔ {endHub?.name.split(' (')[0]}</span>
              </div>
            </div>
          </div>

          {/* DASHBOARD ACTION BUTTON SUITE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* SOS / Emergency Dispatch Toggle */}
            <button
              id="btn-sos-toggle"
              onClick={() => {
                setEmergencyMode(!emergencyMode);
                if (!emergencyMode) {
                  toast.error('🚑 Emergency SOS Protocol Activated: Rerouting all convoy fleets.');
                } else {
                  toast('Emergency mode stand down.', { icon: 'ℹ️' });
                }
              }}
              className={`dashboard-btn ${emergencyMode ? 'btn-sos-active' : 'btn-glass'}`}
              style={{
                color: emergencyMode ? '#ffffff' : '#f87171',
                borderColor: emergencyMode ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'
              }}
              title="Toggle emergency priority dispatch"
            >
              <LifeBuoy size={15} />
              <span>{emergencyMode ? 'SOS DISPATCH ACTIVE' : 'Emergency SOS'}</span>
            </button>

            {/* Live Traffic Overlay */}
            <button
              id="btn-traffic-toggle"
              onClick={() => setShowTraffic(!showTraffic)}
              className={`dashboard-btn ${showTraffic ? 'btn-amber-active' : 'btn-glass'}`}
              title="Toggle Google Maps Live Highway Traffic layer"
            >
              <Layers size={15} />
              <span>Live Traffic</span>
            </button>

            {/* Field Incident Reporter Link */}
            <button
              id="btn-field-report"
              onClick={() => window.location.href = '/report'}
              className="dashboard-btn btn-glass"
              title="Submit on-the-ground landslide/flood reports with GPS & Photos"
            >
              <FileText size={15} color="#38bdf8" />
              <span>Report Incident</span>
            </button>

            {/* Responder Registration */}
            <button
              id="btn-register"
              onClick={() => window.location.href = '/register'}
              className="dashboard-btn btn-glass"
              title="Official Responder & Fleet Registration Portal"
            >
              <UserPlus size={15} color="#a78bfa" />
              <span>Portal</span>
            </button>

            {/* Regional Weather Radar */}
            <button
              id="btn-weather-radar"
              onClick={() => setShowWeatherTab(true)}
              className="dashboard-btn btn-glass"
              title="View live 20-min meteorological telemetry across all regional hubs"
            >
              <CloudRain size={15} color="#38bdf8" />
              <span>Weather Matrix</span>
            </button>

            {/* AI Model & Continual Fine-Tuning Lab */}
            <button
              id="btn-ai-lab"
              onClick={() => setShowModelModal(true)}
              className="dashboard-btn btn-glass"
              title="Open dual-hazard geotechnical stress testing & continual learning suite"
            >
              <Sparkles size={15} color="#f59e0b" />
              <span>AI Lab & Telemetry</span>
            </button>

            {/* Manual Sync Button */}
            <button
              id="btn-sync-telemetry"
              onClick={handleManualSync}
              className="dashboard-btn btn-glass"
              disabled={isSyncing}
              title="Instant re-sync of hazard sensors & active route calculation"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* 2. ROUTE COMMAND DECK & DESTINATION SEARCH BAR */}
        <div style={{
          backgroundColor: '#0f172a',
          padding: '0.6rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* ORIGIN SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#94a3b8',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <MapPin size={13} color="#3b82f6" /> ORIGIN:
            </span>
            <div style={{ position: 'relative' }}>
              <select
                id="select-origin"
                value={selectedStart}
                onChange={(e) => {
                  setSelectedStart(e.target.value);
                  planRouteAndCheckHazards(e.target.value, selectedEnd);
                }}
                style={{
                  padding: '7px 28px 7px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none'
                }}
              >
                {availableNodes.map(n => (
                  <option key={`start-${n.id}`} value={n.id} style={{ backgroundColor: '#0f172a', color: 'white' }}>
                    {n.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* SWAP ROUTE BUTTON */}
          <button
            id="btn-swap-route"
            onClick={handleSwapRoute}
            title="Swap Origin and Destination"
            className="dashboard-btn btn-glass"
            style={{ padding: '7px 10px', borderRadius: '8px' }}
          >
            <ArrowLeftRight size={15} />
          </button>

          {/* SEVEN SISTERS DESTINATION SEARCH BAR */}
          <div style={{ position: 'relative', flex: '1 1 320px', minWidth: '280px', maxWidth: '540px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: isSearchOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '2px 10px',
              boxShadow: isSearchOpen ? '0 0 0 3px rgba(56, 189, 248, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <Search size={15} color="#38bdf8" style={{ marginRight: '8px', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                id="input-dest-search"
                type="text"
                value={destSearchQuery}
                placeholder="Search destination across 8 states (e.g. Tawang, Kohima, Silchar, Gangtok)..."
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
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  padding: '7px 0',
                  outline: 'none',
                  fontWeight: 500,
                  fontFamily: 'inherit'
                }}
              />
              {destSearchQuery && (
                <button
                  onClick={() => {
                    setDestSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* AUTOCOMPLETE FLOATING SEARCH RESULTS */}
            {isSearchOpen && (
              <div className="glass-panel-elevated" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                borderRadius: '10px',
                zIndex: 1000,
                maxHeight: '380px',
                overflowY: 'auto',
                padding: '10px'
              }}>
                {/* State Quick-Filter Pills */}
                <div style={{
                  display: 'flex',
                  gap: '5px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '8px'
                }}>
                  {SEVEN_SISTER_STATES.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStateFilter(st)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.67rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        fontWeight: 700,
                        backgroundColor: selectedStateFilter === st ? '#2563eb' : 'rgba(30, 41, 59, 0.7)',
                        color: selectedStateFilter === st ? '#ffffff' : '#94a3b8',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '0.68rem', color: '#64748b', padding: '4px 6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {filteredDestinations.length} Hubs Available
                </div>

                {filteredDestinations.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
                    No matching destinations found for "{destSearchQuery}".
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
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: isCurrent ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                          border: isCurrent ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                          marginBottom: '3px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <MapPin size={15} color={isCurrent ? '#38bdf8' : '#64748b'} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#ffffff' }}>
                              {node.name}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                              {node.corridor}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            padding: '3px 7px',
                            borderRadius: '5px',
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`
                          }}>
                            {node.state}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
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

          {/* SCAN ROUTE ACTION BUTTON */}
          <button
            id="btn-scan-route"
            onClick={() => planRouteAndCheckHazards(selectedStart, selectedEnd)}
            disabled={isCalculatingRoute}
            className="dashboard-btn btn-electric"
            title="Compute optimal path and run dual-hazard prediction"
          >
            {isCalculatingRoute ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Evaluating Corridor...</span>
              </>
            ) : (
              <>
                <Zap size={15} />
                <span>Scan Hazards & Reroute</span>
              </>
            )}
          </button>

          {/* LIVE WEATHER BADGE FOR CORRIDOR */}
          {currentRoutePlan?.weather && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              padding: '5px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem'
            }}>
              <span style={{ fontSize: '1rem' }}>{currentRoutePlan.weather.icon || '🌦️'}</span>
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>{currentRoutePlan.weather.condition}</span>
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>{currentRoutePlan.weather.temperatureC}°C</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
              <span style={{ color: '#94a3b8' }}>
                Precip: <strong style={{ color: '#7dd3fc' }}>{currentRoutePlan.weather.rainfall1hMm} mm/h</strong>
              </span>
            </div>
          )}

          {/* SEGMENTED ROUTE VIEW CONTROLS */}
          {hasAlternativeDetour && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Paths:
              </span>
              <div className="segmented-group">
                <button
                  id="btn-view-both"
                  onClick={() => setRouteViewMode('BOTH')}
                  className={`segmented-btn ${routeViewMode === 'BOTH' ? 'active-blue' : ''}`}
                >
                  <Layers size={12} />
                  <span>Both</span>
                </button>
                <button
                  id="btn-view-primary"
                  onClick={() => setRouteViewMode('PRIMARY')}
                  className={`segmented-btn ${routeViewMode === 'PRIMARY' ? 'active-red' : ''}`}
                >
                  <AlertTriangle size={12} />
                  <span>Hazard</span>
                </button>
                <button
                  id="btn-view-safe"
                  onClick={() => {
                    setRouteViewMode('SAFE');
                    setAcceptedSafeRoute(true);
                  }}
                  className={`segmented-btn ${routeViewMode === 'SAFE' ? 'active-green' : ''}`}
                >
                  <ShieldCheck size={12} />
                  <span>Safe Detour</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. HOTSPOT CORRIDORS QUICK PRESET BUTTONS RIBBON */}
        <div style={{
          backgroundColor: '#090d16',
          padding: '0.4rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <span style={{
            color: '#64748b',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Radio size={12} color="#06b6d4" /> Priority Corridors:
          </span>

          <button
            onClick={() => {
              setSelectedStart('GAU');
              setSelectedEnd('SIL');
              setDestSearchQuery('Silchar (Assam)');
              planRouteAndCheckHazards('GAU', 'SIL');
            }}
            className={`preset-chip ${selectedStart === 'GAU' && selectedEnd === 'SIL' ? 'active' : ''}`}
          >
            <span>🏔️</span>
            <span>Guwahati ➔ Silchar</span>
            <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>(Sonapur Mudflow)</span>
          </button>

          <button
            onClick={() => {
              setSelectedStart('TEZ');
              setSelectedEnd('TAW');
              setDestSearchQuery('Tawang (Arunachal)');
              planRouteAndCheckHazards('TEZ', 'TAW');
            }}
            className={`preset-chip ${selectedStart === 'TEZ' && selectedEnd === 'TAW' ? 'active' : ''}`}
          >
            <span>🏔️</span>
            <span>Tezpur ➔ Tawang</span>
            <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>(Sela Pass Hazard)</span>
          </button>

          <button
            onClick={() => {
              setSelectedStart('DIM');
              setSelectedEnd('KOH');
              setDestSearchQuery('Kohima (Nagaland)');
              planRouteAndCheckHazards('DIM', 'KOH');
            }}
            className={`preset-chip ${selectedStart === 'DIM' && selectedEnd === 'KOH' ? 'active' : ''}`}
          >
            <span>🏔️</span>
            <span>Dimapur ➔ Kohima</span>
            <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>(Dzüdza Sinkage)</span>
          </button>

          <button
            onClick={() => {
              setSelectedStart('SIL');
              setSelectedEnd('AIZ');
              setDestSearchQuery('Aizawl (Mizoram)');
              planRouteAndCheckHazards('SIL', 'AIZ');
            }}
            className={`preset-chip ${selectedStart === 'SIL' && selectedEnd === 'AIZ' ? 'active' : ''}`}
          >
            <span>🏔️</span>
            <span>Silchar ➔ Aizawl</span>
            <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>(NH-306 Slip)</span>
          </button>

          <button
            onClick={() => {
              setSelectedStart('NAG');
              setSelectedEnd('JOR');
              setDestSearchQuery('Jorhat (Assam)');
              planRouteAndCheckHazards('NAG', 'JOR');
            }}
            className={`preset-chip ${selectedStart === 'NAG' && selectedEnd === 'JOR' ? 'active' : ''}`}
          >
            <span>🌊</span>
            <span>Nagaon ➔ Jorhat</span>
            <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>(Kaziranga Flood)</span>
          </button>

          <button
            onClick={() => {
              setSelectedStart('GAU');
              setSelectedEnd('SHL');
              setDestSearchQuery('Shillong (Meghalaya)');
              planRouteAndCheckHazards('GAU', 'SHL');
            }}
            className={`preset-chip ${selectedStart === 'GAU' && selectedEnd === 'SHL' ? 'active' : ''}`}
          >
            <span>🚗</span>
            <span>Guwahati ➔ Shillong</span>
            <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>(Scenic NH-06)</span>
          </button>

          <button
            onClick={() => {
              setSelectedStart('GAU');
              setSelectedEnd('AGT');
              setDestSearchQuery('Agartala (Tripura)');
              planRouteAndCheckHazards('GAU', 'AGT');
            }}
            className={`preset-chip ${selectedStart === 'GAU' && selectedEnd === 'AGT' ? 'active' : ''}`}
          >
            <span>🚗</span>
            <span>Guwahati ➔ Agartala</span>
            <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>(Tripura Transit)</span>
          </button>
        </div>
      </header>

      {/* 4. DYNAMIC HAZARD STATUS BANNER */}
      {isCurrentRouteHazardous && routeViewMode !== 'SAFE' && (
        <div style={{
          background: 'linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)',
          color: '#ffffff',
          padding: '0.65rem 1.4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 18px rgba(220, 38, 38, 0.4)',
          borderBottom: '2px solid #ef4444',
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', letterSpacing: '-0.01em' }}>
                ACTIVE HAZARD DETECTED ON PRIMARY ROUTE!
              </div>
              <div style={{ fontSize: '0.74rem', color: '#fee2e2', marginTop: '1px' }}>
                {currentRoutePlan.alertMessage}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasAlternativeDetour && (
              <button
                id="btn-engage-detour-banner"
                onClick={() => {
                  setRouteViewMode('SAFE');
                  setAcceptedSafeRoute(true);
                  toast.success('🛡️ Safe detour engaged. Dangerous sector avoided.');
                }}
                className="dashboard-btn btn-emerald-glow"
              >
                <ShieldCheck size={16} />
                <span>{acceptedSafeRoute ? '✓ Safe Detour Active' : 'Engage Suggested Safe Detour'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {isCurrentRouteHazardous && routeViewMode === 'SAFE' && (
        <div style={{
          background: 'linear-gradient(90deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          color: '#d1fae5',
          padding: '0.55rem 1.4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 16px rgba(5, 150, 105, 0.35)',
          borderBottom: '2px solid #10b981',
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#34d399" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#ffffff' }}>
                AI SUGGESTED SAFE DETOUR ENGAGED
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>
                Active hazard zone bypassed. Rerouted via verified safe mountain corridor.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setRouteViewMode('BOTH');
              setAcceptedSafeRoute(false);
            }}
            className="dashboard-btn btn-glass"
            style={{ fontSize: '0.72rem', padding: '4px 10px' }}
          >
            Show Hazard Comparison
          </button>
        </div>
      )}

      {!isCurrentRouteHazardous && currentRoutePlan && (
        <div style={{
          backgroundColor: 'rgba(6, 95, 70, 0.85)',
          backdropFilter: 'blur(8px)',
          color: '#d1fae5',
          padding: '0.5rem 1.4rem',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #059669'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#34d399" />
            <span>
              <strong>Corridor Clear:</strong> No active landslides or floods detected between {startHub?.name} and {endHub?.name}.
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#a7f3d0', fontWeight: 600 }}>
            Geotechnical Slope Stability: Normal (1.0x Cost Multiplier)
          </span>
        </div>
      )}

      {/* 5. MAIN MAP VIEWPORT */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          width: '100%',
          minHeight: 0,
          overflow: 'hidden',
          backgroundColor: '#090d16'
        }}
        onClick={() => {
          if (isSearchOpen) setIsSearchOpen(false);
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}>
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

              <TrafficLayerComponent show={showTraffic} />

              {/* DUAL ROAD-SNAPPED ROUTE VISUALIZATION */}
              {currentRoutePlan && (
                <DualRouteVisualizer
                  primaryRoute={currentRoutePlan.primaryRoute || null}
                  safeRoute={currentRoutePlan.suggestedSafeRoute || null}
                  hasHazard={currentRoutePlan.hasHazard}
                  viewMode={routeViewMode}
                  isSamePath={checkIsSamePath(currentRoutePlan)}
                />
              )}

              {/* ACTIVE START & DESTINATION HUBS */}
              {availableNodes
                .filter((node) => node.id === selectedStart || node.id === selectedEnd)
                .map((node) => {
                  const isSelectedStart = node.id === selectedStart;
                  const pinBg = isSelectedStart ? '#2563eb' : '#ef4444';
                  const pinLabel = isSelectedStart ? 'START' : 'DEST';

                  return (
                    <AdvancedMarker key={`hub-${node.id}`} position={{ lat: node.lat, lng: node.lng }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                        <div style={{
                          backgroundColor: pinBg,
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          border: '2px solid #ffffff',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <span>{isSelectedStart ? '🟢' : '🏁'}</span>
                          <span>{pinLabel}: {node.name.split(' (')[0]}</span>
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}

              {/* HAZARD CORRIDOR PINS */}
              {currentRoutePlan?.hasHazard && routeViewMode !== 'SAFE' && currentRoutePlan.hazardsOnPrimaryRoute?.map((h: any, idx: number) => (
                <AdvancedMarker key={`route-hazard-${idx}`} position={h.midpoint}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transform: 'translateY(-8px)'
                  }}>
                    <div style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      border: '2px solid white',
                      boxShadow: '0 6px 18px rgba(220,38,38,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <AlertTriangle size={14} />
                      <span>{h.hazardType}</span>
                    </div>
                  </div>
                </AdvancedMarker>
              ))}

              {/* INDIVIDUAL SELECTED HAZARD PIN */}
              {selectedHazard && (
                <AdvancedMarker
                  position={{ lat: selectedHazard.lat, lng: selectedHazard.lng }}
                  onClick={() => setSelectedHazard(null)}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transform: 'translateY(-8px)'
                  }}>
                    <div style={{
                      backgroundColor: '#ea580c',
                      color: 'white',
                      padding: '4px 9px',
                      borderRadius: '12px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1.5px solid white'
                    }}>
                      <Radio size={12} />
                      <span>{selectedHazard.name}</span>
                    </div>
                  </div>
                </AdvancedMarker>
              )}

              {/* EVALUATED CUSTOM POINT PIN */}
              {customPrediction && (
                <AdvancedMarker position={{ lat: customPrediction.location?.lat || customPrediction.lat, lng: customPrediction.location?.lng || customPrediction.lng }}>
                  <div style={{
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    padding: '4px 9px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    border: '2px solid white',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.5)'
                  }}>
                    📍 Evaluated Point
                  </div>
                </AdvancedMarker>
              )}

              {/* DYNAMIC FLEET VEHICLES */}
              {positions.map((pos) => (
                <AdvancedMarker key={pos.id} position={{ lat: pos.latitude, lng: pos.longitude }}>
                  <div style={{ fontSize: '24px', cursor: 'pointer', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.6))' }}>
                    🚛
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        </div>

        {/* 6. FLOATING ACTION MAP TOOLBAR (Top-Left of Map) */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            className="map-tool-btn"
            onClick={() => setMapTarget({ lat: 26.1445, lng: 91.7362 })}
            title="Reset Map to Northeast India Center"
          >
            <Crosshair size={18} />
          </button>
          <button
            className="map-tool-btn"
            onClick={() => setShowAllHotspots(!showAllHotspots)}
            style={{ color: showAllHotspots ? '#ef4444' : '#e2e8f0' }}
            title={showAllHotspots ? 'Hide regional hazard pins' : 'Show all regional hazard pins'}
          >
            <MapPin size={18} />
          </button>
        </div>

        {/* 7. BOTTOM-LEFT ROUTE SAFETY & DETOUR ASSESSMENT HUD */}
        {currentRoutePlan && (
          <div className="glass-panel-elevated" style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            zIndex: 100,
            borderRadius: '14px',
            width: '400px',
            maxHeight: 'calc(100% - 40px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>
                    Corridor Safety Assessment
                  </span>
                  <span style={{
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: isCurrentRouteHazardous ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: isCurrentRouteHazardous ? '#f87171' : '#34d399',
                    border: isCurrentRouteHazardous ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
                  }}>
                    {isCurrentRouteHazardous ? 'HAZARD ELEVATED' : 'CLEAR'}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {startHub?.name.split(' (')[0]} ➔ {endHub?.name.split(' (')[0]}
                </div>
              </div>

              <button
                onClick={() => setIsRouteCardCollapsed(!isRouteCardCollapsed)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isRouteCardCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {/* Expandable Body */}
            {!isRouteCardCollapsed && (
              <div style={{ padding: '12px 14px', overflowY: 'auto', flex: 1 }}>
                {/* Primary Route Status Box */}
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  backgroundColor: isCurrentRouteHazardous ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                  border: isCurrentRouteHazardous ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      color: isCurrentRouteHazardous ? '#fca5a5' : '#86efac',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Clock size={14} />
                      {currentRoutePlan.primaryRoute?.estTimeMinutes} mins
                      <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>({(currentRoutePlan.primaryRoute?.totalCost || 0).toFixed(0)} km equivalent)</span>
                    </span>

                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor: isCurrentRouteHazardous ? '#dc2626' : '#059669',
                      color: '#ffffff'
                    }}>
                      {isCurrentRouteHazardous ? '⚠️ HAZARDOUS' : '✓ CLEAR CORRIDOR'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px' }}>
                    Via: {currentRoutePlan.primaryRoute?.coordinates?.map((c: any) => c.name.split(' (')[0]).join(' ➔ ')}
                  </div>

                  {isCurrentRouteHazardous && currentRoutePlan.hazardsOnPrimaryRoute && (
                    <div style={{ marginTop: '8px', borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '6px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fca5a5' }}>
                        Identified Bottlenecks:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '3px' }}>
                        {currentRoutePlan.hazardsOnPrimaryRoute.map((h: any, i: number) => (
                          <div key={i} style={{ fontSize: '0.68rem', color: '#fecaca', display: 'flex', justifyContent: 'space-between' }}>
                            <span>• {h.corridorName}: {h.hazardType}</span>
                            <span style={{ fontWeight: 700 }}>LS: {h.landslide?.probability || 'High'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Logistics & Economic Impact Metric Tiles */}
                {currentRoutePlan.economicImpact && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: 800,
                      fontSize: '0.76rem',
                      color: '#ffffff',
                      marginBottom: '8px'
                    }}>
                      <TrendingUp size={14} color="#10b981" />
                      <span>Logistics Resilience & Asset Protection</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.7)',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>Disruptions Avoided</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isCurrentRouteHazardous ? '#34d399' : '#e2e8f0', marginTop: '2px' }}>
                          {currentRoutePlan.economicImpact.supplyDisruptionPrevented}
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.7)',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>Cargo Value Protected</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                          ${currentRoutePlan.economicImpact.estimatedCargoValueSaved.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Safe Detour Engagement Card */}
                {hasAlternativeDetour && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ShieldCheck size={15} color="#10b981" />
                        Safe Bypass ({currentRoutePlan.suggestedSafeRoute?.estTimeMinutes} mins)
                      </span>
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#059669',
                        color: '#ffffff'
                      }}>
                        100% CLEAR
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px' }}>
                      Detour Via: {currentRoutePlan.suggestedSafeRoute?.coordinates?.map((c: any) => c.name.split(' (')[0]).join(' ➔ ')}
                    </div>

                    <button
                      id="btn-engage-detour-card"
                      onClick={() => {
                        setRouteViewMode('SAFE');
                        setAcceptedSafeRoute(true);
                        toast.success('🛡️ Safe detour selected and active.');
                      }}
                      className="dashboard-btn btn-emerald-glow"
                      style={{ width: '100%', marginTop: '10px', padding: '8px 12px' }}
                    >
                      <ShieldCheck size={16} />
                      <span>{acceptedSafeRoute ? '✓ Active Safe Detour Selected' : 'Engage Suggested Safe Detour'}</span>
                    </button>
                  </div>
                )}

                {/* Single Corridor Advisory */}
                {isCurrentRouteHazardous && !hasAlternativeDetour && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '0.76rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={15} color="#ef4444" />
                      <span>Single Mountain Lifeline - No Alternate Bypass</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#fecaca', marginTop: '4px', lineHeight: 1.4 }}>
                      This isolated ridge highway has no alternative road detour. Convoy escort or heavy machinery escort recommended before entering sector.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 8. RIGHT REGIONAL HAZARD RADAR HUD */}
        <div className="glass-panel-elevated" style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 100,
          borderRadius: '14px',
          width: '320px',
          maxHeight: 'calc(100% - 32px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '10px 12px',
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderBottom: isRadarCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div
              onClick={() => setIsRadarCollapsed(!isRadarCollapsed)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}
              title="Click to toggle"
            >
              <Radio size={16} color="#38bdf8" />
              <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>Regional Radar</h3>
              <span className="live-indicator" />
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.4)'
              }}>
                {filteredHazardLocations.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                id="btn-radar-collapse"
                onClick={() => setIsRadarCollapsed(!isRadarCollapsed)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isRadarCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
            </div>
          </div>

          {/* Collapsible Body */}
          {!isRadarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <button
                  onClick={() => setActiveHazardFilter('ALL')}
                  className="radar-tab"
                  style={{
                    backgroundColor: activeHazardFilter === 'ALL' ? '#2563eb' : 'rgba(30, 41, 59, 0.6)',
                    color: activeHazardFilter === 'ALL' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  All ({allLocations.length})
                </button>
                <button
                  onClick={() => setActiveHazardFilter('LANDSLIDE')}
                  className="radar-tab"
                  style={{
                    backgroundColor: activeHazardFilter === 'LANDSLIDE' ? '#ea580c' : 'rgba(30, 41, 59, 0.6)',
                    color: activeHazardFilter === 'LANDSLIDE' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  🏔️ Landslide
                </button>
                <button
                  onClick={() => setActiveHazardFilter('FLOOD')}
                  className="radar-tab"
                  style={{
                    backgroundColor: activeHazardFilter === 'FLOOD' ? '#0284c7' : 'rgba(30, 41, 59, 0.6)',
                    color: activeHazardFilter === 'FLOOD' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  🌊 Flood
                </button>
              </div>

              {/* Scrollable Hotspot Cards */}
              <div style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: '6px 12px 12px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {filteredHazardLocations.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => {
                      setSelectedHazard(spot);
                      setMapTarget({ lat: spot.lat, lng: spot.lng });
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: selectedHazard?.id === spot.id ? 'rgba(37, 99, 235, 0.25)' : 'rgba(30, 41, 59, 0.5)',
                      border: selectedHazard?.id === spot.id ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedHazard?.id !== spot.id) e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedHazard?.id !== spot.id) e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.5)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#ffffff' }}>
                        {spot.name}
                      </div>
                      <span style={{
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: spot.severityBadge === 'CRITICAL' ? '#dc2626' : '#d97706',
                        color: '#ffffff'
                      }}>
                        {spot.severityBadge}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.67rem', color: '#94a3b8', marginTop: '2px' }}>
                      {spot.corridor}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.68rem', marginTop: '4px' }}>
                      <span style={{ color: spot.landslide.predicted ? '#f97316' : '#64748b' }}>
                        🏔️ {spot.landslide.probability}
                      </span>
                      <span style={{ color: spot.flood.predicted ? '#38bdf8' : '#64748b' }}>
                        🌊 {spot.flood.probability}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 9. AI MODEL LAB & CONTINUAL LEARNING MODAL */}
        {showModelModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="glass-panel-elevated" style={{
              width: '90%',
              maxWidth: '580px',
              maxHeight: '88vh',
              borderRadius: '16px',
              padding: '1.6rem',
              overflowY: 'auto',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#f59e0b" />
                  <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                    Dual-Hazard AI Lab & Telemetry
                  </h2>
                </div>
                <button
                  onClick={() => setShowModelModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Stress Simulation Section */}
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                padding: '14px',
                borderRadius: '10px',
                marginBottom: '1.2rem',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Sliders size={16} color="#38bdf8" />
                  <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700 }}>
                    Geotechnical Parameter Stress Test
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.78rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>
                      24h Antecedent Rain: <strong style={{ color: '#38bdf8' }}>{simRain} mm</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="250"
                      value={simRain}
                      onChange={e => setSimRain(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#0284c7' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>
                      Slope Gradient: <strong style={{ color: '#f97316' }}>{simSlope}°</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={simSlope}
                      onChange={e => setSimSlope(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#ea580c' }}
                    />
                  </div>
                </div>

                <button
                  id="btn-run-simulation"
                  onClick={runStressSimulation}
                  className="dashboard-btn btn-electric"
                  style={{ marginTop: '12px', width: '100%' }}
                >
                  <span>Evaluate Hazard Inference</span>
                </button>

                {simResult && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    fontSize: '0.76rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>Landslide Prob</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f97316' }}>
                          {(simResult.landslide?.landslide_probability * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>Flood Prob</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
                          {(simResult.flood?.flood_probability * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>Cost Multiplier</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#a78bfa' }}>
                          {simResult.risk_multiplier}x
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Continual Learning Pipeline */}
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <RefreshCw size={16} color="#10b981" />
                  <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700 }}>
                    Warm-Start Continual Learning Ingestion
                  </h4>
                </div>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  Trigger warm-start retrain incorporating newly verified field incident reports into the production decision tree models.
                </p>

                <button
                  id="btn-trigger-finetune"
                  onClick={handleTriggerFineTune}
                  disabled={isFineTuning}
                  className="dashboard-btn btn-emerald-glow"
                  style={{ width: '100%' }}
                >
                  {isFineTuning ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Fine-Tuning Trees in Background...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Ingest Incident Batch & Calibrate</span>
                    </>
                  )}
                </button>

                {fineTuneStatus && (
                  <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>
                    {fineTuneStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 10. LIVE WEATHER TAB MODAL */}
        {showWeatherTab && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="glass-panel-elevated" style={{
              width: '90%',
              maxWidth: '680px',
              maxHeight: '85vh',
              borderRadius: '16px',
              padding: '1.6rem',
              color: '#ffffff',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CloudRain size={20} color="#38bdf8" />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                      Regional Weather Telemetry
                    </h2>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                      Real-time Open-Meteo feeds across all 8 Northeastern State Capitals
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowWeatherTab(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                {liveWeatherHubs.map((city, idx) => (
                  <div key={idx} style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>{city.name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>{city.icon}</span> <span>{city.condition}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>{city.temp}°C</div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Wind: {city.windspeed} km/h</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
