'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
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
  MapPin,
  TrendingUp,
  Clock,
  Compass,
  LifeBuoy,
  Crosshair,
  Truck,
  Gauge,
  Fuel,
  Phone,
  Mountain,
  Droplets,
  Package,
  UserCheck,
  Cpu,
  Wrench
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
      map.fitBounds(bounds, { top: 80, right: 340, bottom: 110, left: 400 });
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

// Bearing helper
function getBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return Math.round((brng + 360) % 360);
}

// Dual-Route Visualizer with high-visibility enterprise road paths
const DualRouteVisualizer: React.FC<{
  primaryRoute: { coordinates?: any[]; roadGeometry?: any[] } | null;
  safeRoute: { coordinates?: any[]; roadGeometry?: any[] } | null;
  hasHazard: boolean;
  viewMode: 'BOTH' | 'SAFE' | 'PRIMARY';
  isSamePath: boolean;
  onRoadPointsReady?: (pts: { lat: number; lng: number }[]) => void;
}> = ({ primaryRoute, safeRoute, hasHazard, viewMode, isSamePath, onRoadPointsReady }) => {
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
        strokeColor: '#dc2626',
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
          strokeColor: '#dc2626',
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

  // 2. Render Safe Route in Solid Emerald
  useEffect(() => {
    if (!map) return;

    if (!safePolylineRef.current) {
      safePolylineRef.current = new google.maps.Polyline({
        map: null,
        strokeColor: '#059669',
        strokeWeight: 6,
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
          strokeColor: '#059669',
          strokeWeight: 6,
          strokeOpacity: 0.98,
          zIndex: 10
        });
        safePolylineRef.current.setMap(map);
        if (onRoadPointsReady) {
          onRoadPointsReady(roadPts);
        }
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
  const [selectedTruck, setSelectedTruck] = useState<any | null>(null);
  const [showFleetDrawer, setShowFleetDrawer] = useState<boolean>(false);
  const [availableNodes, setAvailableNodes] = useState<any[]>(SEVEN_SISTER_HUBS);

  // Active Route Plan & Hazard Alert state
  const [selectedStart, setSelectedStart] = useState('GAU');
  const [selectedEnd, setSelectedEnd] = useState('SIL');
  const [currentRoutePlan, setCurrentRoutePlan] = useState<any | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeViewMode, setRouteViewMode] = useState<'BOTH' | 'SAFE' | 'PRIMARY'>('BOTH');
  const [acceptedSafeRoute, setAcceptedSafeRoute] = useState(false);
  const [isRouteCardCollapsed, setIsRouteCardCollapsed] = useState(false);

  // Active Road Navigation Tracking
  const [activeRoadPts, setActiveRoadPts] = useState<{ lat: number; lng: number }[]>([]);
  const [activeTruckProgress, setActiveTruckProgress] = useState(0.24);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTruckProgress((prev) => {
        const next = prev + 0.003;
        return next >= 0.98 ? 0.02 : next;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

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

  // Geotechnical Diagnostics Modal
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
              <div style={{ fontWeight: 700 }}>Corridor Disruption Detected</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                Official detour available via verified mountain bypass.
              </div>
            </div>,
            { duration: 5000 }
          );
        } else {
          toast.success('Corridor clearance confirmed: Zero active obstructions', { duration: 3000 });
        }
      }
    } catch (err) {
      console.error('Failed to calculate route:', err);
      toast.error('Routing engine offline');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    toast('Syncing regional sensor telemetry...', { icon: '🔄' });
    await Promise.all([
      fetchHazardLocations(),
      planRouteAndCheckHazards(selectedStart, selectedEnd),
    ]);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Sensor telemetry synchronized across all 8 states');
    }, 600);
  };

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) reg.unregister();
        });
      }
      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) caches.delete(key);
        });
      }
    }

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
        if (positionsRes.ok) {
          const posData = await positionsRes.json();
          setPositions(posData);
          setSelectedTruck((prev: any) => {
            if (!prev) return null;
            return posData.find((p: any) => p.id === prev.id) || prev;
          });
        }
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

    const fleetInterval = setInterval(fetchFleetData, 4000);
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
          locationName: `Corridor Sector (${lat.toFixed(3)}, ${lng.toFixed(3)})`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomPrediction(data);
      }
    } catch (err) {
      console.error('Point evaluation error:', err);
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
    setFineTuneStatus('Calibrating telemetry logs against verified field reports...');
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
        setFineTuneStatus(`✓ Calibration Complete: ${data.result?.total_training_samples} verified ground records incorporated.`);
        fetchHazardLocations();
        planRouteAndCheckHazards();
      }
    } catch (err: any) {
      setFineTuneStatus(`Calibration Error: ${err.message}`);
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

  const isCurrentRouteHazardous = Boolean(currentRoutePlan?.hasHazard);
  const hasAlternativeDetour = Boolean(isCurrentRouteHazardous && !checkIsSamePath(currentRoutePlan));

  // Compute Active Commercial Freight Vehicle directly traversing current highway road
  const activeRouteVehicle = useMemo(() => {
    if (!activeRoadPts || activeRoadPts.length < 2) return null;
    const maxIdx = activeRoadPts.length - 1;
    const exactIdx = activeTruckProgress * maxIdx;
    const lowerIdx = Math.floor(exactIdx);
    const upperIdx = Math.min(lowerIdx + 1, maxIdx);
    const rem = exactIdx - lowerIdx;
    const lat = activeRoadPts[lowerIdx].lat + (activeRoadPts[upperIdx].lat - activeRoadPts[lowerIdx].lat) * rem;
    const lng = activeRoadPts[lowerIdx].lng + (activeRoadPts[upperIdx].lng - activeRoadPts[lowerIdx].lng) * rem;
    const lookAhead = Math.min(lowerIdx + 4, maxIdx);
    const bearing = getBearing(lat, lng, activeRoadPts[lookAhead].lat, activeRoadPts[lookAhead].lng);
    return {
      id: 1,
      callsign: 'CONVOY-NER-01',
      name: 'Truck Alpha (Guwahati ➔ Silchar)',
      plateNumber: 'AS-01-GC-4921',
      model: 'Tata Prima 5530.S (16-Wheeler Multi-Axle)',
      vehicleClass: 'Heavy Commercial Vehicle (HCV)',
      speedKmh: Math.round(52 + Math.sin(activeTruckProgress * 15) * 6),
      latitude: lat,
      longitude: lng,
      bearing,
      progressPercent: Math.round(activeTruckProgress * 100),
      fuelPercent: Math.max(25, Math.round(85 - activeTruckProgress * 30)),
      engineTempC: 86,
      compass: 'NE',
      corridor: currentRoutePlan?.primaryRoute?.name || 'NH-06 (Guwahati ➔ Silchar Lifeline Highway)',
      status: (isCurrentRouteHazardous && routeViewMode !== 'SAFE') ? 'ALERT_HAZARD_ZONE' : 'EN_ROUTE_NOMINAL'
    };
  }, [activeRoadPts, activeTruckProgress, isCurrentRouteHazardous, routeViewMode, currentRoutePlan]);

  const allDisplayVehicles = useMemo(() => {
    const list = [...positions];
    if (activeRouteVehicle) {
      const existingIdx = list.findIndex(p => p.id === 1 || p.callsign === 'CONVOY-NER-01');
      if (existingIdx >= 0) {
        list[existingIdx] = {
          ...list[existingIdx],
          ...activeRouteVehicle,
          id: list[existingIdx].id
        };
      } else {
        list.unshift(activeRouteVehicle);
      }
    }
    return list;
  }, [positions, activeRouteVehicle]);

  return (
    <div style={{ height: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#080c14', color: '#f8fafc', boxSizing: 'border-box' }}>
      
      {/* 1. UNIFIED EXECUTIVE OPERATIONS COMMAND BAR (Top Row) */}
      <header style={{
        backgroundColor: '#0c1322',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 110,
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0
      }}>
        <div style={{
          padding: '0.4rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Official MoRTH / PM GatiShakti Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 auto', minWidth: 0 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '5px',
              backgroundColor: '#131c2e',
              border: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}>
              <ShieldCheck size={17} />
            </div>

            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                <span style={{
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  color: '#ffffff',
                  whiteSpace: 'nowrap'
                }}>
                  BHARAT HIGHWAY SURAKSHA
                </span>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '3px',
                  backgroundColor: '#131c2e',
                  color: '#94a3b8',
                  border: '1px solid #24324f',
                  whiteSpace: 'nowrap'
                }}>
                  MoRTH · GATISHAKTI
                </span>

                {isOffline && (
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    color: '#f87171',
                    border: '1px solid #dc2626',
                    whiteSpace: 'nowrap'
                  }}>
                    OFFLINE
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.66rem',
                color: '#94a3b8',
                marginTop: '1px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="live-indicator" />
                  <span style={{ color: '#cbd5e1' }}>8-State Grid</span>
                </span>
                <span>•</span>
                <span style={{ color: '#38bdf8' }}>{startHub?.name.split(' (')[0]} ➔ {endHub?.name.split(' (')[0]}</span>
              </div>
            </div>
          </div>

          {/* COMPACT CORRIDOR SELECTOR */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#080c14',
            padding: '2px 6px',
            borderRadius: '5px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            flex: '0 1 auto',
            maxWidth: '430px',
            minWidth: 0,
            boxSizing: 'border-box'
          }}>
            {/* Origin */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <select
                id="select-origin"
                value={selectedStart}
                onChange={(e) => {
                  setSelectedStart(e.target.value);
                  planRouteAndCheckHazards(e.target.value, selectedEnd);
                }}
                style={{
                  padding: '4px 18px 4px 6px',
                  borderRadius: '3px',
                  backgroundColor: '#131c2e',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none'
                }}
              >
                {availableNodes.map(n => (
                  <option key={`start-${n.id}`} value={n.id} style={{ backgroundColor: '#0f172a', color: 'white' }}>
                    {n.name.split(' (')[0]}
                  </option>
                ))}
              </select>
              <ChevronDown size={11} color="#94a3b8" style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Swap */}
            <button
              id="btn-swap-route"
              onClick={handleSwapRoute}
              title="Swap Origin and Destination"
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <ArrowLeftRight size={12} />
            </button>

            {/* Destination Search/Dropdown */}
            <div style={{ position: 'relative', flex: '1 1 auto', minWidth: '80px', maxWidth: '140px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#131c2e',
                border: isSearchOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                padding: '1px 5px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <Search size={11} color="#64748b" style={{ marginRight: '4px', flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  id="input-dest-search"
                  type="text"
                  value={destSearchQuery}
                  placeholder={endHub ? endHub.name.split(' (')[0] : "Destination..."}
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
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    padding: '3px 0',
                    outline: 'none',
                    fontWeight: 600,
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Floating Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="glass-panel-elevated" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  borderRadius: '8px',
                  zIndex: 1000,
                  width: 'min(300px, calc(100vw - 32px))',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  padding: '8px',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '3px',
                    overflowX: 'auto',
                    paddingBottom: '5px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '5px'
                  }}>
                    {SEVEN_SISTER_STATES.map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStateFilter(st)}
                        style={{
                          padding: '2px 6px',
                          fontSize: '0.62rem',
                          borderRadius: '3px',
                          border: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          fontWeight: 700,
                          backgroundColor: selectedStateFilter === st ? '#1d4ed8' : 'rgba(30, 41, 59, 0.7)',
                          color: selectedStateFilter === st ? '#ffffff' : '#94a3b8'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {filteredDestinations.map((node) => {
                    const isCurrent = node.id === selectedEnd;
                    return (
                      <div
                        key={node.id}
                        onClick={() => handleSelectDestination(node.id)}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: isCurrent ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                          marginBottom: '2px'
                        }}
                      >
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.74rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {node.name}
                          </div>
                          <div style={{ fontSize: '0.62rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {node.corridor}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.64rem', color: '#38bdf8', fontWeight: 700, flexShrink: 0, marginLeft: '6px' }}>Select</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Evaluate Corridor Action */}
            <button
              id="btn-scan-route"
              onClick={() => planRouteAndCheckHazards(selectedStart, selectedEnd)}
              disabled={isCalculatingRoute}
              className="dashboard-btn btn-electric"
              style={{ padding: '4px 9px', fontSize: '0.7rem', flexShrink: 0 }}
              title="Assess corridor clearances and structural slope stability"
            >
              {isCalculatingRoute ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Assessing...</span>
                </>
              ) : (
                <>
                  <Activity size={12} />
                  <span>Evaluate</span>
                </>
              )}
            </button>

            {/* Segmented Detour Selector (if hazard exists) */}
            {hasAlternativeDetour && (
              <div className="segmented-group">
                <button
                  id="btn-view-both"
                  onClick={() => setRouteViewMode('BOTH')}
                  className={`segmented-btn ${routeViewMode === 'BOTH' ? 'active-blue' : ''}`}
                >
                  Both
                </button>
                <button
                  id="btn-view-primary"
                  onClick={() => setRouteViewMode('PRIMARY')}
                  className={`segmented-btn ${routeViewMode === 'PRIMARY' ? 'active-red' : ''}`}
                >
                  Direct
                </button>
                <button
                  id="btn-view-safe"
                  onClick={() => {
                    setRouteViewMode('SAFE');
                    setAcceptedSafeRoute(true);
                  }}
                  className={`segmented-btn ${routeViewMode === 'SAFE' ? 'active-green' : ''}`}
                >
                  Detour
                </button>
              </div>
            )}
          </div>

          {/* DASHBOARD ACTION BUTTON SUITE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flex: '0 1 auto',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Live Traffic */}
            <button
              id="btn-traffic-toggle"
              onClick={() => setShowTraffic(!showTraffic)}
              className={`dashboard-btn ${showTraffic ? 'btn-amber-active' : 'btn-glass'}`}
              title="Toggle Google Maps Live Highway Traffic"
            >
              <Layers size={12} />
              <span>Traffic</span>
            </button>

            {/* Weather Matrix */}
            <button
              id="btn-weather-radar"
              onClick={() => setShowWeatherTab(true)}
              className="dashboard-btn btn-glass"
              title="Regional meteorological telemetry"
            >
              <CloudRain size={12} color="#38bdf8" />
              <span>Weather</span>
            </button>

            {/* Geotechnical Analysis */}
            <button
              id="btn-ai-lab"
              onClick={() => setShowModelModal(true)}
              className="dashboard-btn btn-glass"
              title="Geotechnical stress simulation and calibration"
            >
              <SlidersHorizontal size={12} color="#f59e0b" />
              <span>Geotech</span>
            </button>

            {/* Field Incident Reporter Link */}
            <button
              id="btn-field-report"
              onClick={() => window.location.href = '/report'}
              className="dashboard-btn btn-glass"
              title="Submit verified field hazard report"
            >
              <FileText size={12} color="#38bdf8" />
              <span>Reports</span>
            </button>

            {/* Responder Registration */}
            <button
              id="btn-register"
              onClick={() => window.location.href = '/register'}
              className="dashboard-btn btn-glass"
              title="Official Responder & Fleet Registration Portal"
            >
              <UserPlus size={12} color="#a78bfa" />
              <span>Portal</span>
            </button>

            {/* Manual Sync Button */}
            <button
              id="btn-sync-telemetry"
              onClick={handleManualSync}
              className="dashboard-btn btn-glass"
              disabled={isSyncing}
              title="Synchronize hazard sensors"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            </button>

            {/* SOS / Emergency Dispatch Toggle */}
            <button
              id="btn-sos-toggle"
              onClick={() => {
                setEmergencyMode(!emergencyMode);
                if (!emergencyMode) {
                  toast.error('EMERGENCY SOS: Priority dispatch engaged.');
                } else {
                  toast('Emergency stand down.', { icon: 'ℹ️' });
                }
              }}
              className={`dashboard-btn ${emergencyMode ? 'btn-sos-active' : 'btn-glass'}`}
              style={{
                color: emergencyMode ? '#ffffff' : '#f87171',
                borderColor: emergencyMode ? '#dc2626' : 'rgba(239, 68, 68, 0.3)'
              }}
              title="Toggle emergency priority dispatch"
            >
              <LifeBuoy size={12} />
              <span>{emergencyMode ? 'SOS ACTIVE' : 'SOS'}</span>
            </button>
          </div>
        </div>

        {/* 2. SUB-RIBBON: PRIORITY NATIONAL HIGHWAY CORRIDORS */}
        <div style={{
          backgroundColor: '#090d16',
          padding: '0.3rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: '100%',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          boxSizing: 'border-box'
        }}>
          <span style={{
            color: '#64748b',
            fontSize: '0.62rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0
          }}>
            <Radio size={11} color="#06b6d4" /> Strategic Arterials:
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
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>NH-06</span>
            <span>Guwahati ➔ Silchar</span>
            <span style={{ fontSize: '0.6rem', color: '#64748b' }}>(Sonapur)</span>
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
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>NH-13</span>
            <span>Tezpur ➔ Tawang</span>
            <span style={{ fontSize: '0.6rem', color: '#64748b' }}>(Sela Pass)</span>
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
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>NH-29</span>
            <span>Dimapur ➔ Kohima</span>
            <span style={{ fontSize: '0.6rem', color: '#64748b' }}>(Dzüdza)</span>
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
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>NH-306</span>
            <span>Silchar ➔ Aizawl</span>
            <span style={{ fontSize: '0.6rem', color: '#64748b' }}>(Kolasib)</span>
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
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>NH-715</span>
            <span>Nagaon ➔ Jorhat</span>
            <span style={{ fontSize: '0.6rem', color: '#64748b' }}>(Kaziranga)</span>
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
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>NH-06</span>
            <span>Guwahati ➔ Shillong</span>
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
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>NH-08</span>
            <span>Guwahati ➔ Agartala</span>
          </button>
        </div>
      </header>

      {/* 3. OFFICIAL CIVIL HIGHWAY ADVISORY STRIP */}
      {isCurrentRouteHazardous && routeViewMode !== 'SAFE' && (
        <div style={{
          backgroundColor: '#7f1d1d',
          color: '#ffffff',
          padding: '0.4rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          borderBottom: '2px solid #b91c1c',
          zIndex: 90,
          maxWidth: '100vw',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: '1 1 auto' }}>
            <AlertTriangle size={15} color="#fca5a5" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.76rem', fontWeight: 700, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span>CIVIL ADVISORY: ACTIVE HAZARD IDENTIFIED ON PRIMARY HIGHWAY SECTOR</span>
              <span style={{ marginLeft: '8px', opacity: 0.85, fontWeight: 500 }}>
                {currentRoutePlan.alertMessage}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {hasAlternativeDetour && (
              <button
                id="btn-engage-detour-banner"
                onClick={() => {
                  setRouteViewMode('SAFE');
                  setAcceptedSafeRoute(true);
                  toast.success('Official safe detour bypass engaged.');
                }}
                className="dashboard-btn btn-emerald-glow"
                style={{ padding: '3px 8px', fontSize: '0.68rem' }}
              >
                <ShieldCheck size={13} />
                <span>{acceptedSafeRoute ? '✓ Detour Active' : 'Engage Detour'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {isCurrentRouteHazardous && routeViewMode === 'SAFE' && (
        <div style={{
          backgroundColor: '#064e3b',
          color: '#d1fae5',
          padding: '0.35rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          borderBottom: '2px solid #059669',
          zIndex: 90,
          maxWidth: '100vw',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <ShieldCheck size={15} color="#34d399" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.74rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              OFFICIAL DETOUR ACTIVE: HAZARDOUS SECTOR BYPASSED VIA VERIFIED CORRIDOR
            </div>
          </div>
          <button
            onClick={() => {
              setRouteViewMode('BOTH');
              setAcceptedSafeRoute(false);
            }}
            className="dashboard-btn btn-glass"
            style={{ fontSize: '0.68rem', padding: '2px 7px', flexShrink: 0 }}
          >
            Show Comparison
          </button>
        </div>
      )}

      {!isCurrentRouteHazardous && currentRoutePlan && (
        <div style={{
          backgroundColor: '#064e3b',
          color: '#d1fae5',
          padding: '0.3rem 1rem',
          fontSize: '0.72rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
          borderBottom: '1px solid #059669',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <CheckCircle2 size={13} color="#34d399" style={{ flexShrink: 0 }} />
            <span>
              <strong>Corridor Nominal:</strong> All stations report clear transit between {startHub?.name.split(' (')[0]} and {endHub?.name.split(' (')[0]}.
            </span>
          </div>
          <span style={{ fontSize: '0.66rem', color: '#a7f3d0', flexShrink: 0 }}>
            Slope Stability: 1.0 (Normal)
          </span>
        </div>
      )}

      {/* 4. MAIN MAP VIEWPORT */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          width: '100%',
          maxWidth: '100vw',
          minHeight: 0,
          overflow: 'hidden',
          backgroundColor: '#080c14',
          boxSizing: 'border-box'
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
                  onRoadPointsReady={setActiveRoadPts}
                />
              )}

              {/* ACTIVE START & DESTINATION HUBS */}
              {availableNodes
                .filter((node) => node.id === selectedStart || node.id === selectedEnd)
                .map((node) => {
                  const isSelectedStart = node.id === selectedStart;
                  const pinBg = isSelectedStart ? '#1d4ed8' : '#b91c1c';
                  const pinLabel = isSelectedStart ? 'ORIGIN' : 'TERMINUS';

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
                          padding: '3px 7px',
                          borderRadius: '4px',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          border: '1.5px solid #ffffff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap'
                        }}>
                          <MapPin size={11} />
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
                    transform: 'translateY(-6px)'
                  }}>
                    <div style={{
                      backgroundColor: '#b91c1c',
                      color: 'white',
                      padding: '3px 7px',
                      borderRadius: '4px',
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      border: '1.5px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      <AlertTriangle size={11} />
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
                    transform: 'translateY(-6px)'
                  }}>
                    <div style={{
                      backgroundColor: '#d97706',
                      color: 'white',
                      padding: '3px 7px',
                      borderRadius: '4px',
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1px solid white',
                      whiteSpace: 'nowrap'
                    }}>
                      <Radio size={11} />
                      <span>{selectedHazard.name}</span>
                    </div>
                  </div>
                </AdvancedMarker>
              )}

              {/* EVALUATED CUSTOM POINT PIN */}
              {customPrediction && (
                <AdvancedMarker position={{ lat: customPrediction.location?.lat || customPrediction.lat, lng: customPrediction.location?.lng || customPrediction.lng }}>
                  <div style={{
                    backgroundColor: '#475569',
                    color: 'white',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    border: '1px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    <Crosshair size={11} />
                    <span>Sector Evaluation</span>
                  </div>
                </AdvancedMarker>
              )}

              {/* COMMERCIAL CONVOY VEHICLES - CENTERED 100% DEAD ON ROAD ASPHALT */}
              {allDisplayVehicles.map((pos) => {
                const isSelected = selectedTruck?.id === pos.id;
                const isAlert = pos.status === 'ALERT_HAZARD_ZONE';
                const isCaution = pos.status === 'CAUTION_MONITORED_CORRIDOR';
                const statusColor = isAlert ? '#ef4444' : isCaution ? '#f59e0b' : '#10b981';

                return (
                  <AdvancedMarker
                    key={pos.id}
                    position={{ lat: pos.latitude, lng: pos.longitude }}
                    onClick={() => {
                      setSelectedTruck(pos);
                      setMapTarget({ lat: pos.latitude, lng: pos.longitude });
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '0px',
                      height: '0px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}>
                      {/* Telematics Registration Pill positioned cleanly above truck */}
                      <div style={{
                        position: 'absolute',
                        bottom: '28px',
                        left: '0px',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: '#0c1322',
                        color: '#f8fafc',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: isSelected ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.7)',
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        zIndex: 10,
                        pointerEvents: 'none'
                      }}>
                        <span style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: statusColor,
                          flexShrink: 0
                        }} />
                        <span style={{ fontFamily: 'var(--font-mono), monospace' }}>
                          {pos.plateNumber || pos.callsign?.replace('CONVOY-', '') || `TRK-${pos.id}`}
                        </span>
                        <span style={{
                          color: '#94a3b8',
                          fontSize: '0.58rem',
                          fontWeight: 600,
                          paddingLeft: '3px',
                          borderLeft: '1px solid rgba(255,255,255,0.15)'
                        }}>
                          {pos.speedKmh} km/h
                        </span>
                      </div>

                      {/* Commercial Heavy Transport Tractor-Trailer Centered Exactly on Road (0, 0) */}
                      <div style={{
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        width: '24px',
                        height: '52px',
                        transform: `translate(-50%, -50%) rotate(${pos.bearing || 0}deg)`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                        filter: isSelected
                          ? 'drop-shadow(0 0 5px rgba(56, 189, 248, 0.7)) drop-shadow(0 2px 5px rgba(0,0,0,0.6))'
                          : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))'
                      }}>
                        <svg viewBox="0 0 24 52" width="24" height="52" style={{ display: 'block', overflow: 'visible' }}>
                          <defs>
                            <linearGradient id={`cab-body-${pos.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f8fafc" />
                              <stop offset="50%" stopColor="#e2e8f0" />
                              <stop offset="100%" stopColor="#94a3b8" />
                            </linearGradient>
                            <linearGradient id={`trailer-body-${pos.id}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#1e293b" />
                              <stop offset="35%" stopColor="#334155" />
                              <stop offset="70%" stopColor="#334155" />
                              <stop offset="100%" stopColor="#1e293b" />
                            </linearGradient>
                          </defs>

                          {/* Axles & Road Tires */}
                          <rect x="0.5" y="5" width="2.5" height="6" rx="1" fill="#090d16" />
                          <rect x="21" y="5" width="2.5" height="6" rx="1" fill="#090d16" />
                          <rect x="0.5" y="32" width="2.5" height="6" rx="1" fill="#090d16" />
                          <rect x="21" y="32" width="2.5" height="6" rx="1" fill="#090d16" />
                          <rect x="0.5" y="41" width="2.5" height="6" rx="1" fill="#090d16" />
                          <rect x="21" y="41" width="2.5" height="6" rx="1" fill="#090d16" />

                          {/* Coupling Turntable */}
                          <rect x="8" y="14" width="8" height="4" rx="1" fill="#475569" />
                          <circle cx="12" cy="16" r="1.5" fill="#64748b" />

                          {/* Commercial Cargo Container Trailer */}
                          <rect x="2.5" y="16" width="19" height="34" rx="2" fill={`url(#trailer-body-${pos.id})`} stroke="#0f172a" strokeWidth="0.8" />
                          <line x1="3.5" y1="22" x2="20.5" y2="22" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
                          <line x1="3.5" y1="28" x2="20.5" y2="28" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
                          <line x1="3.5" y1="34" x2="20.5" y2="34" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
                          <line x1="3.5" y1="40" x2="20.5" y2="40" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />

                          {/* Safety Bumper & Reflectors */}
                          <rect x="3.5" y="48.5" width="17" height="1.5" fill="#0f172a" />
                          <rect x="4.5" y="48.8" width="3" height="0.9" fill="#ef4444" />
                          <rect x="16.5" y="48.8" width="3" height="0.9" fill="#ef4444" />

                          {/* Commercial Tractor Cabin (Tata Prima Profile) */}
                          <rect x="0.5" y="5" width="1.8" height="2.8" rx="0.5" fill="#475569" />
                          <rect x="21.7" y="5" width="1.8" height="2.8" rx="0.5" fill="#475569" />
                          <path d="M 3.5 5 Q 3.5 1.5 7 1.5 L 17 1.5 Q 20.5 1.5 20.5 5 L 20.5 15 L 3.5 15 Z" fill={`url(#cab-body-${pos.id})`} stroke="#0f172a" strokeWidth="0.8" />
                          <rect x="5.5" y="0.8" width="13" height="1.4" rx="0.5" fill="#94a3b8" />
                          <path d="M 5 4.5 Q 5 2.8 7.5 2.8 L 16.5 2.8 Q 19 2.8 19 4.5 L 19 7.5 L 5 7.5 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="0.5" />
                          <rect x="6.5" y="8.5" width="11" height="4.5" rx="1" fill="#334155" stroke="#1e293b" strokeWidth="0.4" />
                          <circle cx="5.5" cy="1.6" r="0.9" fill="#fef08a" />
                          <circle cx="18.5" cy="1.6" r="0.9" fill="#fef08a" />
                        </svg>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        </div>

        {/* 5. FLOATING MAP TOOLBAR (Top-Left of Map) */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            className="map-tool-btn"
            onClick={() => setMapTarget({ lat: 26.1445, lng: 91.7362 })}
            title="Reset to Northeast India Center"
          >
            <Crosshair size={16} />
          </button>
          <button
            className="map-tool-btn"
            onClick={() => setShowAllHotspots(!showAllHotspots)}
            style={{ color: showAllHotspots ? '#ef4444' : '#e2e8f0' }}
            title={showAllHotspots ? 'Hide hazard stations' : 'Show all hazard stations'}
          >
            <MapPin size={16} />
          </button>
          <button
            className="map-tool-btn"
            onClick={() => setShowFleetDrawer(!showFleetDrawer)}
            style={{ color: showFleetDrawer ? '#38bdf8' : '#e2e8f0' }}
            title="Toggle Fleet Telematics Panel"
          >
            <Truck size={16} />
          </button>
        </div>

        {/* CONVOY FLEET QUICK SWITCHER DRAWER */}
        {showFleetDrawer && (
          <div className="glass-panel-elevated" style={{
            position: 'absolute',
            top: 14,
            left: 54,
            zIndex: 100,
            borderRadius: '8px',
            width: 'min(310px, calc(100vw - 68px))',
            maxWidth: 'calc(100vw - 68px)',
            maxHeight: 'calc(100% - 28px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            <div style={{
              padding: '8px 10px',
              backgroundColor: '#131c2e',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.78rem', color: '#ffffff', minWidth: 0, overflow: 'hidden' }}>
                <Truck size={14} color="#38bdf8" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fleet Units ({positions.length})</span>
              </div>
              <button
                onClick={() => setShowFleetDrawer(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ padding: '6px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '380px', boxSizing: 'border-box' }}>
              {positions.map((truck) => {
                const isAlert = truck.status === 'ALERT_HAZARD_ZONE';
                const isSelected = selectedTruck?.id === truck.id;
                return (
                  <div
                    key={truck.id}
                    onClick={() => {
                      setSelectedTruck(truck);
                      setMapTarget({ lat: truck.latitude, lng: truck.longitude });
                    }}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.15)' : '#0e1524',
                      borderRadius: '5px',
                      border: isSelected ? '1px solid #3b82f6' : isAlert ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.74rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {truck.callsign}
                      </div>
                      <span style={{
                        fontSize: '0.56rem',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '3px',
                        backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: isAlert ? '#fca5a5' : '#34d399',
                        flexShrink: 0
                      }}>
                        {isAlert ? 'HAZARD' : `${truck.speedKmh} km/h`}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.64rem', color: '#94a3b8', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {truck.name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#cbd5e1', marginTop: '3px', paddingTop: '3px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span>Reg: <strong style={{ color: '#ffffff' }}>{truck.plateNumber}</strong></span>
                      <span>Progress: <strong style={{ color: '#38bdf8' }}>{truck.progressPercent}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. BOTTOM-LEFT CORRIDOR RESILIENCE & SAFETY ASSESSMENT HUD */}
        {currentRoutePlan && (
          <div className="glass-panel-elevated" style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            zIndex: 100,
            borderRadius: '8px',
            width: 'min(380px, calc(100vw - 28px))',
            maxWidth: 'calc(100vw - 28px)',
            maxHeight: 'calc(100% - 28px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            {/* Header */}
            <div style={{
              padding: '8px 10px',
              backgroundColor: '#131c2e',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxSizing: 'border-box'
            }}>
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#ffffff', whiteSpace: 'nowrap' }}>
                    Safety Assessment
                  </span>
                  <span style={{
                    fontSize: '0.56rem',
                    fontWeight: 700,
                    padding: '1px 4px',
                    borderRadius: '3px',
                    backgroundColor: isCurrentRouteHazardous ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: isCurrentRouteHazardous ? '#f87171' : '#34d399',
                    whiteSpace: 'nowrap'
                  }}>
                    {isCurrentRouteHazardous ? 'DISRUPTION' : 'CLEAR'}
                  </span>
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {startHub?.name.split(' (')[0]} ➔ {endHub?.name.split(' (')[0]}
                </div>
              </div>

              <button
                onClick={() => setIsRouteCardCollapsed(!isRouteCardCollapsed)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
              >
                {isRouteCardCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Expandable Body */}
            {!isRouteCardCollapsed && (
              <div style={{ padding: '8px 10px', overflowY: 'auto', maxHeight: 'calc(100vh - 210px)', boxSizing: 'border-box' }}>
                {/* Primary Route Status Box */}
                <div style={{
                  padding: '7px 9px',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  backgroundColor: isCurrentRouteHazardous ? 'rgba(220, 38, 38, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                  border: isCurrentRouteHazardous ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(5, 150, 105, 0.3)',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      color: isCurrentRouteHazardous ? '#fca5a5' : '#86efac',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      <Clock size={12} />
                      {currentRoutePlan.primaryRoute?.estTimeMinutes} mins
                      <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({(currentRoutePlan.primaryRoute?.totalCost || 0).toFixed(0)} km)</span>
                    </span>

                    <span style={{
                      fontSize: '0.58rem',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '3px',
                      backgroundColor: isCurrentRouteHazardous ? '#dc2626' : '#059669',
                      color: '#ffffff',
                      flexShrink: 0
                    }}>
                      {isCurrentRouteHazardous ? 'HAZARDOUS' : 'NOMINAL'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.66rem', color: '#cbd5e1', marginTop: '3px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    Via: {currentRoutePlan.primaryRoute?.coordinates?.map((c: any) => c.name.split(' (')[0]).join(' ➔ ')}
                  </div>

                  {isCurrentRouteHazardous && currentRoutePlan.hazardsOnPrimaryRoute && (
                    <div style={{ marginTop: '5px', borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '4px' }}>
                      <div style={{ fontSize: '0.64rem', fontWeight: 700, color: '#fca5a5' }}>
                        Identified Obstruction Sectors:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                        {currentRoutePlan.hazardsOnPrimaryRoute.map((h: any, i: number) => (
                          <div key={i} style={{ fontSize: '0.64rem', color: '#fecaca', display: 'flex', justifyContent: 'space-between', gap: '6px', minWidth: 0 }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>• {h.corridorName}: {h.hazardType}</span>
                            <span style={{ fontWeight: 700, flexShrink: 0 }}>Risk: {h.landslide?.probability || 'High'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Logistics & Supply Chain Impact Metric Tiles */}
                {currentRoutePlan.economicImpact && (
                  <div style={{
                    padding: '7px 9px',
                    borderRadius: '6px',
                    marginBottom: '6px',
                    backgroundColor: '#0e1524',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      color: '#ffffff',
                      marginBottom: '5px'
                    }}>
                      <TrendingUp size={12} color="#10b981" />
                      <span>Supply Chain Resilience Impact</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                      <div style={{
                        backgroundColor: '#131c2e',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        minWidth: 0,
                        overflow: 'hidden'
                      }}>
                        <div style={{ fontSize: '0.56rem', color: '#94a3b8', fontWeight: 700 }}>Disruptions Prevented</div>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isCurrentRouteHazardous ? '#34d399' : '#e2e8f0', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {currentRoutePlan.economicImpact.supplyDisruptionPrevented}
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: '#131c2e',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        minWidth: 0,
                        overflow: 'hidden'
                      }}>
                        <div style={{ fontSize: '0.56rem', color: '#94a3b8', fontWeight: 700 }}>Cargo Value Protected</div>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          ${currentRoutePlan.economicImpact.estimatedCargoValueSaved.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Safe Detour Engagement Card */}
                {hasAlternativeDetour && (
                  <div style={{
                    padding: '7px 9px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.74rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <ShieldCheck size={13} color="#10b981" style={{ flexShrink: 0 }} />
                        Bypass ({currentRoutePlan.suggestedSafeRoute?.estTimeMinutes} mins)
                      </span>
                      <span style={{
                        fontSize: '0.56rem',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '3px',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        flexShrink: 0
                      }}>
                        CLEAR
                      </span>
                    </div>

                    <div style={{ fontSize: '0.66rem', color: '#cbd5e1', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      Detour Via: {currentRoutePlan.suggestedSafeRoute?.coordinates?.map((c: any) => c.name.split(' (')[0]).join(' ➔ ')}
                    </div>

                    <button
                      id="btn-engage-detour-card"
                      onClick={() => {
                        setRouteViewMode('SAFE');
                        setAcceptedSafeRoute(true);
                        toast.success('Official safe detour bypass engaged.');
                      }}
                      className="dashboard-btn btn-emerald-glow"
                      style={{ width: '100%', marginTop: '6px', padding: '5px 8px', fontSize: '0.7rem' }}
                    >
                      <ShieldCheck size={13} />
                      <span>{acceptedSafeRoute ? '✓ Detour Active' : 'Engage Verified Detour'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 7. RIGHT REGIONAL GEOTECHNICAL SENSOR GRID HUD */}
        <div className="glass-panel-elevated" style={{
          position: 'absolute',
          top: 14,
          right: 14,
          zIndex: 100,
          borderRadius: '8px',
          width: 'min(300px, calc(100vw - 28px))',
          maxWidth: 'calc(100vw - 28px)',
          maxHeight: 'calc(100% - 28px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <div style={{
            padding: '7px 10px',
            backgroundColor: '#131c2e',
            borderBottom: isRadarCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            <div
              onClick={() => setIsRadarCollapsed(!isRadarCollapsed)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', userSelect: 'none', minWidth: 0, overflow: 'hidden' }}
              title="Click to toggle"
            >
              <Radio size={13} color="#38bdf8" style={{ flexShrink: 0 }} />
              <h3 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>Sensor Grid</h3>
              <span className="live-indicator" />
              <span style={{
                fontSize: '0.56rem',
                fontWeight: 700,
                padding: '1px 4px',
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                flexShrink: 0
              }}>
                {filteredHazardLocations.length} Stations
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
              <button
                id="btn-radar-collapse"
                onClick={() => setIsRadarCollapsed(!isRadarCollapsed)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                {isRadarCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>
            </div>
          </div>

          {/* Collapsible Body */}
          {!isRadarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, boxSizing: 'border-box' }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '3px', padding: '5px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', boxSizing: 'border-box' }}>
                <button
                  onClick={() => setActiveHazardFilter('ALL')}
                  className="radar-tab"
                  style={{
                    backgroundColor: activeHazardFilter === 'ALL' ? '#1d4ed8' : '#131c2e',
                    color: activeHazardFilter === 'ALL' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  All ({allLocations.length})
                </button>
                <button
                  onClick={() => setActiveHazardFilter('LANDSLIDE')}
                  className="radar-tab"
                  style={{
                    backgroundColor: activeHazardFilter === 'LANDSLIDE' ? '#d97706' : '#131c2e',
                    color: activeHazardFilter === 'LANDSLIDE' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  <Mountain size={11} /> Landslide
                </button>
                <button
                  onClick={() => setActiveHazardFilter('FLOOD')}
                  className="radar-tab"
                  style={{
                    backgroundColor: activeHazardFilter === 'FLOOD' ? '#0284c7' : '#131c2e',
                    color: activeHazardFilter === 'FLOOD' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  <Droplets size={11} /> Flood
                </button>
              </div>

              {/* Scrollable Hotspot Cards */}
              <div style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: '5px 8px 8px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxSizing: 'border-box'
              }}>
                {filteredHazardLocations.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => {
                      setSelectedHazard(spot);
                      setMapTarget({ lat: spot.lat, lng: spot.lng });
                    }}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '5px',
                      backgroundColor: selectedHazard?.id === spot.id ? 'rgba(37, 99, 235, 0.2)' : '#0e1524',
                      border: selectedHazard?.id === spot.id ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.72rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
                        {spot.name}
                      </div>
                      <span style={{
                        fontSize: '0.54rem',
                        fontWeight: 700,
                        padding: '1px 3px',
                        borderRadius: '3px',
                        backgroundColor: spot.severityBadge === 'CRITICAL' ? '#dc2626' : '#d97706',
                        color: '#ffffff',
                        flexShrink: 0
                      }}>
                        {spot.severityBadge}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {spot.corridor}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.64rem', marginTop: '2px' }}>
                      <span style={{ color: spot.landslide.predicted ? '#f97316' : '#64748b', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Mountain size={10} /> {spot.landslide.probability}
                      </span>
                      <span style={{ color: spot.flood.predicted ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Droplets size={10} /> {spot.flood.probability}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 8. GEOTECHNICAL TELEMETRY & STRESS SIMULATION WORKBENCH */}
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
            justifyContent: 'center',
            padding: '10px',
            boxSizing: 'border-box'
          }}>
            <div className="glass-panel-elevated" style={{
              width: '100%',
              maxWidth: 'min(560px, calc(100vw - 20px))',
              maxHeight: 'calc(100vh - 20px)',
              borderRadius: '10px',
              padding: '1.2rem',
              overflowY: 'auto',
              color: '#ffffff',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SlidersHorizontal size={17} color="#f59e0b" />
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                    Geotechnical Diagnostics & Stress Simulation
                  </h2>
                </div>
                <button
                  onClick={() => setShowModelModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '3px' }}
                >
                  <X size={17} />
                </button>
              </div>

              {/* Stress Simulation Section */}
              <div style={{
                backgroundColor: '#0e1524',
                padding: '10px',
                borderRadius: '7px',
                marginBottom: '0.8rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                  <Wrench size={13} color="#38bdf8" />
                  <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>
                    Slope & Precipitation Calibration
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '0.72rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '3px' }}>
                      24h Rainfall: <strong style={{ color: '#38bdf8' }}>{simRain} mm</strong>
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
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '3px' }}>
                      Slope Incline: <strong style={{ color: '#f97316' }}>{simSlope}°</strong>
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
                  style={{ marginTop: '8px', width: '100%', padding: '5px' }}
                >
                  <span>Compute Sector Hazard Probability</span>
                </button>

                {simResult && (
                  <div style={{
                    marginTop: '6px',
                    padding: '6px',
                    borderRadius: '5px',
                    backgroundColor: '#131c2e',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    fontSize: '0.7rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.6rem' }}>Landslide Index</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f97316' }}>
                          {(simResult.landslide?.landslide_probability * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.6rem' }}>Flood Index</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>
                          {(simResult.flood?.flood_probability * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.6rem' }}>Cost Impact</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#a78bfa' }}>
                          {simResult.risk_multiplier}x
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Station Calibration Pipeline */}
              <div style={{
                backgroundColor: '#0e1524',
                padding: '10px',
                borderRadius: '7px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <RefreshCw size={13} color="#10b981" />
                  <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>
                    Sensor Telemetry Calibration
                  </h4>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                  Incorporate verified field station incident records into the analytical models.
                </p>

                <button
                  id="btn-trigger-finetune"
                  onClick={handleTriggerFineTune}
                  disabled={isFineTuning}
                  className="dashboard-btn btn-emerald-glow"
                  style={{ width: '100%', padding: '5px' }}
                >
                  {isFineTuning ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Calibrating Sensors...</span>
                    </>
                  ) : (
                    <>
                      <Cpu size={12} />
                      <span>Synchronize Ground Station Records</span>
                    </>
                  )}
                </button>

                {fineTuneStatus && (
                  <div style={{ marginTop: '5px', fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                    {fineTuneStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 9. LIVE WEATHER TAB MODAL */}
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
            justifyContent: 'center',
            padding: '10px',
            boxSizing: 'border-box'
          }}>
            <div className="glass-panel-elevated" style={{
              width: '100%',
              maxWidth: 'min(640px, calc(100vw - 20px))',
              maxHeight: 'calc(100vh - 20px)',
              borderRadius: '10px',
              padding: '1.2rem',
              color: '#ffffff',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudRain size={17} color="#38bdf8" />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                      Regional Meteorological Telemetry
                    </h2>
                    <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '1px' }}>
                      Station feeds across Northeastern State Capitals
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowWeatherTab(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '3px' }}
                >
                  <X size={17} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '6px' }}>
                {liveWeatherHubs.map((city, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#0e1524',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{city.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {city.condition}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '6px' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{city.temp}°C</div>
                      <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Wind: {city.windspeed} km/h</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. COMMERCIAL FLEET VEHICLE INSPECTOR MODAL */}
        {selectedTruck && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 2200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              boxSizing: 'border-box'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTruck(null);
            }}
          >
            <div
              className="glass-panel-elevated"
              style={{
                width: '100%',
                maxWidth: 'min(620px, calc(100vw - 20px))',
                maxHeight: 'calc(100vh - 20px)',
                borderRadius: '10px',
                padding: '1.2rem',
                color: '#ffffff',
                overflowY: 'auto',
                border: selectedTruck.status === 'ALERT_HAZARD_ZONE' ? '1.5px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)',
                boxSizing: 'border-box'
              }}
            >
              {/* Header: Callsign, Indian Plate, Status & Close */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px', boxSizing: 'border-box' }}>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Truck size={17} />
                      {selectedTruck.callsign}
                    </span>

                    {/* Official Indian License Plate Styling */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      borderRadius: '3px',
                      border: '1.5px solid #334155',
                      overflow: 'hidden',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      fontSize: '0.74rem'
                    }}>
                      <div style={{
                        backgroundColor: '#1d4ed8',
                        color: '#ffffff',
                        padding: '1px 3px',
                        fontSize: '0.48rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span>IND</span>
                      </div>
                      <div style={{ padding: '1px 6px' }}>
                        {selectedTruck.plateNumber}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span style={{
                      fontSize: '0.58rem',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '3px',
                      backgroundColor: selectedTruck.status === 'ALERT_HAZARD_ZONE' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.2)',
                      color: selectedTruck.status === 'ALERT_HAZARD_ZONE' ? '#fca5a5' : '#34d399',
                      border: `1px solid ${selectedTruck.status === 'ALERT_HAZARD_ZONE' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.4)'}`
                    }}>
                      {selectedTruck.status === 'ALERT_HAZARD_ZONE' ? 'HAZARD ZONE PROXIMITY' : 'ACTIVE ON-TIME'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {selectedTruck.model} • {selectedTruck.corridor}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTruck(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '3px', flexShrink: 0 }}
                >
                  <X size={17} />
                </button>
              </div>

              {/* Commercial Convoy Photographic Showcase */}
              <div style={{
                position: 'relative',
                borderRadius: '7px',
                overflow: 'hidden',
                marginBottom: '0.7rem',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                height: '150px',
                boxSizing: 'border-box'
              }}>
                <img
                  src="/truck_tata_prima.jpg"
                  alt="Commercial Heavy Transport Freight"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(14, 21, 36, 0.95) 0%, rgba(14, 21, 36, 0.2) 60%, transparent 100%)'
                }} />

                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '8px',
                  right: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.6rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Certified Lifeline Commercial Transport
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedTruck.model}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(14, 21, 36, 0.85)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: '#34d399',
                    flexShrink: 0
                  }}>
                    AIS-140 Active
                  </div>
                </div>
              </div>

              {/* Primary Telemetry Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '5px', marginBottom: '0.7rem', boxSizing: 'border-box' }}>
                <div style={{ backgroundColor: '#0e1524', padding: '6px 8px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.06)', minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Gauge size={11} color="#38bdf8" /> Live Speed
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginTop: '1px' }}>
                    {selectedTruck.speedKmh} <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>km/h</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#0e1524', padding: '6px 8px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.06)', minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Compass size={11} color="#34d399" /> Heading
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399', marginTop: '1px' }}>
                    {selectedTruck.bearing}° <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>{selectedTruck.compass}</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#0e1524', padding: '6px 8px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.06)', minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Fuel size={11} color="#fbbf24" /> Fuel Tank
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24', marginTop: '1px' }}>
                    {selectedTruck.fuelPercent}%
                  </div>
                </div>

                <div style={{ backgroundColor: '#0e1524', padding: '6px 8px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.06)', minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Thermometer size={11} color="#f87171" /> Engine Temp
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f87171', marginTop: '1px' }}>
                    {selectedTruck.engineTempC}°C
                  </div>
                </div>
              </div>

              {/* Corridor Route Progression */}
              <div style={{ backgroundColor: '#0e1524', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.7rem', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e2e8f0' }}>
                    Transit Route Progression
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8' }}>
                    {selectedTruck.progressPercent}% Completed
                  </div>
                </div>

                <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{
                    width: `${selectedTruck.progressPercent}%`,
                    height: '100%',
                    backgroundColor: '#1d4ed8'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#cbd5e1' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Origin:</span> {selectedTruck.origin?.name?.split(' (')[0]}
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Destination:</span> {selectedTruck.destination?.name?.split(' (')[0]}
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Cargo Manifest & Driver Dossier */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px', marginBottom: '0.7rem', boxSizing: 'border-box' }}>
                {/* Cargo Manifest */}
                <div style={{ backgroundColor: '#0e1524', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#a78bfa', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Package size={12} /> Cargo Consignment Manifest
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedTruck.cargo?.type}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#94a3b8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Weight: <strong style={{ color: '#e2e8f0' }}>{selectedTruck.cargo?.weightTons} Tons</strong> • Value: <strong style={{ color: '#34d399' }}>{selectedTruck.cargo?.valueInr}</strong>
                  </div>
                </div>

                {/* Driver Dossier */}
                <div style={{ backgroundColor: '#0e1524', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserCheck size={12} /> Certified Operator
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedTruck.driver?.name}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#94a3b8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Badge: <strong style={{ color: '#e2e8f0' }}>{selectedTruck.driver?.badge}</strong> • Exp: <strong style={{ color: '#e2e8f0' }}>{selectedTruck.driver?.experienceYears} Yrs</strong>
                  </div>
                </div>
              </div>

              {/* Powertrain & Mechanical Engineering Telematics */}
              <div style={{ backgroundColor: '#0e1524', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '0.7rem', boxSizing: 'border-box' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Cpu size={12} /> Mechanical Powertrain & Subsystem Telematics
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '5px', fontSize: '0.66rem' }}>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ color: '#94a3b8' }}>Powertrain:</span>
                    <div style={{ fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Cummins ISBe 6.7L</div>
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ color: '#94a3b8' }}>Transmission:</span>
                    <div style={{ fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>9-Speed Sync</div>
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ color: '#94a3b8' }}>Axle:</span>
                    <div style={{ fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>6x4 Multi-Axle</div>
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ color: '#94a3b8' }}>Braking:</span>
                    <div style={{ fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dual Air ABS</div>
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ color: '#94a3b8' }}>Oil Pressure:</span>
                    <div style={{ fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>52 PSI (Nominal)</div>
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ color: '#94a3b8' }}>Battery:</span>
                    <div style={{ fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>27.6 V DC</div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', boxSizing: 'border-box' }}>
                <div style={{ fontSize: '0.64rem', color: '#94a3b8', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Odometer: <strong style={{ color: '#ffffff' }}>{selectedTruck.odometerKm?.toLocaleString()} km</strong>
                </div>
                <button
                  onClick={() => {
                    setMapTarget({ lat: selectedTruck.latitude, lng: selectedTruck.longitude });
                    toast.success(`Tracking camera locked on ${selectedTruck.callsign}`);
                  }}
                  className="dashboard-btn btn-electric"
                  style={{ padding: '4px 10px', fontSize: '0.7rem', flexShrink: 0 }}
                >
                  <Crosshair size={11} /> Center Vehicle
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
