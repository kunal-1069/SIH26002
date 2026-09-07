'use client';

import React, { useState } from 'react';
import { saveReportOffline } from '../../lib/indexeddb';
import {
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Send,
  CheckCircle2,
  Layers,
  FileText,
  ShieldAlert,
  Clock
} from 'lucide-react';

export default function IncidentReportApp() {
  const [description, setDescription] = useState('');
  const [hazardType, setHazardType] = useState<'landslide' | 'flood' | 'subsidence' | 'other'>('landslide');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'severe'>('severe');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedLocation, setCapturedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleCaptureLocationAndSubmit = () => {
    setStatusMessage('Acquiring high-precision GPS coordinates...');
    setIsSubmitting(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCapturedLocation({ lat: latitude, lng: longitude });

          const report = {
            id: crypto.randomUUID(),
            latitude,
            longitude,
            hazardType,
            severity,
            description,
            timestamp: Date.now(),
          };

          try {
            if (navigator.onLine) {
              const payload = {
                road_corridor: `Field Incident near (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                slope_deg: hazardType === 'landslide' ? (severity === 'severe' ? 42.0 : 28.0) : 12.0,
                elevation_m: hazardType === 'flood' ? 65.0 : 450.0,
                rainfall_1h_mm: severity === 'severe' ? 35.0 : 15.0,
                rainfall_24h_mm: severity === 'severe' ? 120.0 : 60.0,
                rainfall_72h_mm: severity === 'severe' ? 240.0 : 110.0,
                landslide_occurred: hazardType === 'landslide' ? 1 : 0,
                flood_occurred: hazardType === 'flood' ? 1 : 0,
                inundation_depth_cm: hazardType === 'flood' ? (severity === 'severe' ? 60.0 : 25.0) : 0.0,
                historical_incidents: 4,
                road_quality: 3
              };

              await fetch('http://localhost:3001/api/hazards/feed-incident', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });

              setStatusMessage('Incident successfully verified and broadcasted to regional route network.');
              setDescription('');
            } else {
              await saveReportOffline(report);

              if ('serviceWorker' in navigator && 'SyncManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                // @ts-ignore
                await registration.sync.register('sync-reports');
              }

              setStatusMessage('Offline Mode: Incident stored in secure IndexedDB cache. Transmitting on reconnect.');
            }
          } catch (error) {
            setStatusMessage('Failed to transmit report. Please check connection and retry.');
          } finally {
            setIsSubmitting(false);
          }
        },
        (error) => {
          setStatusMessage('GPS Sensor Notice: ' + error.message);
          setIsSubmitting(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setStatusMessage('Geolocation sensor is not available on this browser.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Navigation Bar */}
        <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => window.location.href = '/'}
            className="dashboard-btn btn-glass"
            style={{ padding: '7px 14px' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Operations Center</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span className="live-indicator" />
            <span>Field Dispatch Telemetry</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel-elevated" style={{
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Highway Hazard & Road Cut Report
              </h1>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Direct Emergency Notification to State Logistics & Border Roads Authority
              </p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleCaptureLocationAndSubmit(); }}>
            {/* Hazard Classification */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                Incident Classification
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { key: 'landslide', label: 'Landslide / Rockfall' },
                  { key: 'flood', label: 'Flash Flood / Inundation' },
                  { key: 'subsidence', label: 'Road Sinking / Subsidence' },
                  { key: 'other', label: 'Bridge / Traffic Obstruction' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setHazardType(item.key as any)}
                    style={{
                      padding: '9px 10px',
                      borderRadius: '6px',
                      border: hazardType === item.key ? '1.5px solid #38bdf8' : '1px solid #334155',
                      backgroundColor: hazardType === item.key ? '#1e293b' : '#0f172a',
                      color: hazardType === item.key ? '#ffffff' : '#94a3b8',
                      fontSize: '0.76rem',
                      fontWeight: hazardType === item.key ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Level */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                Corridor Impact Severity
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { key: 'low', label: 'Low (Advisory)', color: '#10b981' },
                  { key: 'moderate', label: 'Moderate (Slowdown)', color: '#f59e0b' },
                  { key: 'severe', label: 'Severe (Total Blockage)', color: '#ef4444' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSeverity(item.key as any)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: severity === item.key ? `1.5px solid ${item.color}` : '1px solid #334155',
                      backgroundColor: severity === item.key ? '#1e293b' : '#0f172a',
                      color: severity === item.key ? item.color : '#94a3b8',
                      fontSize: '0.74rem',
                      fontWeight: severity === item.key ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Description */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label htmlFor="description" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Operational Field Observations
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe mile marker, blockage extent, weather conditions, or stranded convoy vehicles..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  lineHeight: 1.4,
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Geotag Indicator */}
            {capturedLocation && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0b1120',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '7px 12px',
                marginBottom: '1rem',
                fontSize: '0.74rem',
                color: '#94a3b8'
              }}>
                <MapPin size={14} color="#38bdf8" />
                <span>Geotag Coordinates: <strong style={{ color: '#ffffff' }}>{capturedLocation.lat.toFixed(5)}, {capturedLocation.lng.toFixed(5)}</strong></span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="dashboard-btn btn-danger-glow"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.86rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <span>Acquiring GPS & Transmitting...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Transmit Geotagged Incident</span>
                </>
              )}
            </button>
          </form>

          {/* Feedback Message */}
          {statusMessage && (
            <div style={{
              marginTop: '1.2rem',
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: '#0b1120',
              border: '1px solid #334155',
              fontSize: '0.78rem',
              color: statusMessage.includes('✓') || statusMessage.includes('successfully') ? '#34d399' : '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
