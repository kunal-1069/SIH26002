'use client';

import React, { useState } from 'react';
import { saveReportOffline } from '../../lib/indexeddb';

export default function IncidentReportApp() {
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleCaptureLocationAndSubmit = () => {
    setStatusMessage('Getting location...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          const report = {
            id: crypto.randomUUID(),
            latitude,
            longitude,
            description,
            timestamp: Date.now(),
          };

          try {
            // Check network status (simulated check)
            if (navigator.onLine) {
              // Try to post directly to API
              // await fetch('/api/reports', { method: 'POST', body: JSON.stringify(report) });
              setStatusMessage('Report submitted online successfully!');
            } else {
              // Save to IndexedDB for background sync
              await saveReportOffline(report);
              
              // Register background sync if available
              if ('serviceWorker' in navigator && 'SyncManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                // @ts-ignore
                await registration.sync.register('sync-reports');
              }
              
              setStatusMessage('Offline: Report saved locally. Will sync when network is restored.');
            }
          } catch (error) {
            setStatusMessage('Failed to save report.');
          }
        },
        (error) => {
          setStatusMessage('Error getting location: ' + error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setStatusMessage('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Field Incident Reporter</h1>
      <p style={{ color: 'gray', fontSize: '0.9rem' }}>
        Progressive Web App - Works offline
      </p>

      <div style={{ marginTop: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Incident Description
        </label>
        <textarea 
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g., Landslide blocking both lanes..."
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        {/* Placeholder for Photo Upload */}
        <div style={{ marginBottom: '1.5rem', padding: '2rem', border: '2px dashed #ccc', textAlign: 'center', color: '#666', borderRadius: '4px' }}>
          📷 Tap to Take Photo
        </div>

        <button 
          onClick={handleCaptureLocationAndSubmit}
          style={{ 
            width: '100%', padding: '1rem', backgroundColor: '#2563eb', 
            color: 'white', border: 'none', borderRadius: '4px', 
            fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' 
          }}
        >
          Submit Report
        </button>

        {statusMessage && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '4px', fontSize: '0.9rem' }}>
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
