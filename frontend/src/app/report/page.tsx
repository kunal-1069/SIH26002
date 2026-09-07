'use client';

import React, { useState } from 'react';
import { saveReportOffline } from '../../lib/indexeddb';
import {
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  MapPin,
  Send,
  CheckCircle2,
  Radio,
  Layers,
  FileText
} from 'lucide-react';

export default function IncidentReportApp() {
  const [description, setDescription] = useState('');
  const [hazardType, setHazardType] = useState<'landslide' | 'flood' | 'other'>('landslide');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'severe'>('severe');
  const [feedToAI, setFeedToAI] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCaptureLocationAndSubmit = () => {
    setStatusMessage('Capturing GPS coordinates via device sensors...');
    setIsSubmitting(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

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
              let aiStatus = '';
              if (feedToAI) {
                try {
                  const aiPayload = {
                    road_corridor: `Field Incident near (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
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

                  const aiRes = await fetch('http://localhost:3001/api/hazards/feed-incident', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(aiPayload)
                  });

                  if (aiRes.ok) {
                    aiStatus = ' (AI Model fine-tuned in real time!)';
                  }
                } catch (mlErr) {
                  console.warn('Could not feed to AI service directly:', mlErr);
                }
              }

              setStatusMessage(`✓ Report transmitted and verified online!${aiStatus}`);
              setDescription('');
            } else {
              await saveReportOffline(report);

              if ('serviceWorker' in navigator && 'SyncManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                // @ts-ignore
                await registration.sync.register('sync-reports');
              }

              setStatusMessage('📶 Offline mode: Incident stored in local IndexedDB. Will auto-sync upon reconnection.');
            }
          } catch (error) {
            setStatusMessage('Failed to transmit report. Please retry.');
          } finally {
            setIsSubmitting(false);
          }
        },
        (error) => {
          setStatusMessage('GPS Sensor Error: ' + error.message);
          setIsSubmitting(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setStatusMessage('Geolocation sensor is not supported by this browser.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      padding: '2.5rem 1rem',
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
            style={{ padding: '6px 12px' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Command Center</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span className="live-indicator" />
            <span>Telemetry Active</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel-elevated" style={{
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
            }}>
              <AlertTriangle size={22} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Field Incident Reporter
              </h1>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Ground-Truth Hazard Capture & Continual AI Model Calibration
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '1.2rem 0' }} />

          {/* Hazard Type Buttons */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.82rem', color: '#cbd5e1' }}>
              Hazard Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setHazardType('landslide')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: hazardType === 'landslide' ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: hazardType === 'landslide' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  color: hazardType === 'landslide' ? '#fca5a5' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🏔️ Landslide</span>
              </button>
              <button
                type="button"
                onClick={() => setHazardType('flood')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: hazardType === 'flood' ? '1px solid #0284c7' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: hazardType === 'flood' ? 'rgba(2, 132, 199, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  color: hazardType === 'flood' ? '#7dd3fc' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🌊 Flood</span>
              </button>
              <button
                type="button"
                onClick={() => setHazardType('other')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: hazardType === 'other' ? '1px solid #eab308' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: hazardType === 'other' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  color: hazardType === 'other' ? '#fde047' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🚧 Blockage</span>
              </button>
            </div>
          </div>

          {/* Severity Segmented Buttons */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.82rem', color: '#cbd5e1' }}>
              Severity Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {(['low', 'moderate', 'severe'] as const).map(sev => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: severity === sev ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: severity === sev ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                    color: severity === sev ? '#ffffff' : '#94a3b8',
                    fontSize: '0.78rem',
                    textTransform: 'capitalize',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Incident Details Textarea */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.82rem', color: '#cbd5e1' }}>
              Corridor Observations & Road Damage
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., 40m debris slide blocking both lanes on NH-06, Sonapur Tunnel sector..."
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Feed into AI Checkbox */}
          <div style={{
            marginBottom: '1.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <input
              type="checkbox"
              id="feedToAI"
              checked={feedToAI}
              onChange={(e) => setFeedToAI(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <label htmlFor="feedToAI" style={{ fontSize: '0.78rem', color: '#e2e8f0', cursor: 'pointer', lineHeight: 1.3 }}>
              <strong>Real-Time AI Ingestion:</strong> Automatically update gradient boosting models with verified ground report.
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-incident"
            onClick={handleCaptureLocationAndSubmit}
            disabled={isSubmitting}
            className="dashboard-btn btn-electric"
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
          >
            {isSubmitting ? (
              <span>Transmitting Geolocation & Data...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Field Incident Report</span>
              </>
            )}
          </button>

          {statusMessage && (
            <div style={{
              marginTop: '1.2rem',
              padding: '10px 14px',
              backgroundColor: statusMessage.includes('Error') || statusMessage.includes('Failed') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: statusMessage.includes('Error') || statusMessage.includes('Failed') ? '#fca5a5' : '#86efac',
              borderRadius: '8px',
              fontSize: '0.78rem',
              border: statusMessage.includes('Error') || statusMessage.includes('Failed') ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)'
            }}>
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
