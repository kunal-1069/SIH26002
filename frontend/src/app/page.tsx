'use client';

import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, AdvancedMarker, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

function RouteDirections({ route }: { route: any[] | null }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
      map,
      polylineOptions: { strokeColor: '#10b981', strokeWeight: 6, strokeOpacity: 0.9 },
      suppressMarkers: false
    }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    if (!route || route.length < 2) {
      directionsRenderer.setDirections(null); // Clear map
      return;
    }

    const origin = { lat: route[0].lat, lng: route[0].lng };
    const destination = { lat: route[route.length - 1].lat, lng: route[route.length - 1].lng };
    
    // Intermediate waypoints to force the route through Neo4j calculated path
    const waypoints = route.slice(1, -1).map(p => ({
      location: { lat: p.lat, lng: p.lng },
      stopover: true
    }));

    directionsService.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    }).then(response => {
      directionsRenderer.setDirections(response);
    }).catch(e => {
      console.error("Directions API request failed:", e);
    });

  }, [directionsService, directionsRenderer, route]);

  return null;
}

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [hoveredDevice, setHoveredDevice] = useState<any | null>(null);

  const [deviceRoutes, setDeviceRoutes] = useState<Record<string, any>>({});
  const fetchedRoutesRef = React.useRef<Set<number>>(new Set());

  useEffect(() => {
    setIsClient(true);
    
    // Fetch Traccar data
    const fetchFleetData = async () => {
      try {
        const [devicesRes, positionsRes] = await Promise.all([
          fetch('http://localhost:3001/api/fleet/devices'),
          fetch('http://localhost:3001/api/fleet/positions')
        ]);
        if (devicesRes.ok) setDevices(await devicesRes.json());
        if (positionsRes.ok) setPositions(await positionsRes.json());
      } catch (err) {
        console.error("Failed to fetch fleet data", err);
      }
    };
    
    fetchFleetData();
    // Refresh every 10 seconds to get live location updates
    const interval = setInterval(fetchFleetData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Automatically calculate route for each active truck
    positions.forEach(async (pos) => {
      const deviceId = pos.deviceId;
      if (fetchedRoutesRef.current.has(deviceId)) return; // Already fetched
      
      const device = devices.find(d => d.id === deviceId);
      if (!device) return;

      // Extract driver's start and end destinations from attributes (fallback to defaults if missing)
      const startNode = device?.attributes?.startNode || 'A';
      const endNode = device?.attributes?.endNode || 'F';

      fetchedRoutesRef.current.add(deviceId);

      try {
        const res = await fetch('http://localhost:3001/api/route/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startNode, endNode })
        });
        const data = await res.json();
        if (res.ok) {
          setDeviceRoutes(prev => ({ ...prev, [deviceId]: data }));
        }
      } catch (err) {
        console.error("Route calc failed for", deviceId, err);
      }
    });
  }, [positions, devices]);

  if (!isClient) return <div>Loading Command Dashboard...</div>;

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', backgroundColor: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>NER Smart Logistics - AI Command Dashboard</h1>
        
        <div style={{ backgroundColor: '#10b981', padding: '5px 15px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          Auto-Routing Active (Live Weather)
        </div>
      </header>
      
      <main style={{ flex: 1, position: 'relative' }}>
        {/* Map View */}
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
          <Map
            defaultCenter={{ lat: 26.1445, lng: 91.7362 }} // Guwahati Coordinates
            defaultZoom={12}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapId="DEMO_MAP_ID"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Draw AI Calculated Route for each Truck */}
            {Object.entries(deviceRoutes).map(([deviceId, routeData]) => (
              <RouteDirections key={deviceId} route={routeData?.route} />
            ))}

            {/* Dynamic Fleet Markers */}
            {positions.map((pos) => {
              const device = devices.find(d => d.id === pos.deviceId);
              
              // Mocking destination if not provided by Traccar (offsetting coordinates for demo)
              const destLat = device?.attributes?.destinationLat || (pos.latitude + 0.1);
              const destLng = device?.attributes?.destinationLng || (pos.longitude + 0.1);

              return (
                <React.Fragment key={pos.id}>
                  {/* Truck Symbol */}
                  <AdvancedMarker 
                    position={{ lat: pos.latitude, lng: pos.longitude }} 
                    onMouseEnter={() => setHoveredDevice({ device, position: pos })}
                    onMouseLeave={() => setHoveredDevice(null)}
                  >
                    <div style={{ 
                      fontSize: '28px', 
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))',
                      cursor: 'pointer',
                      transform: `rotate(${pos.course || 0}deg)`
                    }}>
                      🚛
                    </div>
                  </AdvancedMarker>

                  {/* Destination Generic Red Marker */}
                  <Marker position={{ lat: destLat, lng: destLng }} />
                </React.Fragment>
              );
            })}

            {/* Hover Tooltip (InfoWindow) */}
            {hoveredDevice && (
              <InfoWindow
                position={{
                  lat: hoveredDevice.position.latitude,
                  lng: hoveredDevice.position.longitude
                }}
                onCloseClick={() => setHoveredDevice(null)}
                options={{ disableAutoPan: true }}
              >
                <div style={{ color: '#333', padding: '5px', minWidth: '150px' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{hoveredDevice.device?.name || `Device ${hoveredDevice.position.deviceId}`}</h4>
                  <p style={{ margin: '3px 0', fontSize: '0.9rem' }}>
                    <strong>Driver:</strong> {hoveredDevice.device?.attributes?.driverName || 'John Doe'}
                  </p>
                  <p style={{ margin: '3px 0', fontSize: '0.9rem' }}>
                    <strong>Destination:</strong> {hoveredDevice.device?.attributes?.destinationName || 'Guwahati Main Hub'}
                  </p>
                  <p style={{ margin: '3px 0', fontSize: '0.8rem', color: '#666' }}>
                    Speed: {hoveredDevice.position.speed ? (hoveredDevice.position.speed * 1.852).toFixed(1) : 0} km/h
                  </p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
        
        {/* Overlay Panel */}
        <div style={{
          position: 'absolute', top: 20, right: 20, zIndex: 1000, 
          backgroundColor: 'white', padding: '1rem', borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px', color: '#333'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Live Fleet Status</h2>
          <p style={{ margin: '5px 0' }}>Total Trucks: {devices.length}</p>
          <p style={{ margin: '5px 0' }}>Online: {devices.filter(d => d.status === 'online').length}</p>
          <p style={{ margin: '5px 0' }}>Offline: {devices.filter(d => d.status === 'offline').length}</p>
          <hr style={{ margin: '15px 0' }} />
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>Active Positions</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem' }}>
            {positions.slice(0, 3).map(pos => {
               const device = devices.find(d => d.id === pos.deviceId);
               return <li key={pos.id}>{device ? device.name : pos.deviceId} - {pos.speed ? (pos.speed * 1.852).toFixed(1) + ' km/h' : 'Stationary'}</li>
            })}
            {positions.length === 0 && <li>No active locations</li>}
          </ul>

          {Object.entries(deviceRoutes).map(([deviceId, route]) => {
            const device = devices.find(d => d.id === Number(deviceId));
            return (
              <div key={deviceId}>
                <hr style={{ margin: '15px 0' }} />
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#10b981' }}>{device?.name || `Truck ${deviceId}`} AI Route</h3>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Est. Time:</strong> {route.totalTimeMinutes} mins</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Route:</strong> {route.route.map((r: any) => r.name).join(' ➔ ')}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
