self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  console.log('Syncing offline reports...');
  // 1. Open IndexedDB
  // 2. Fetch all reports where synced === false
  // 3. For each report, attempt to POST to backend (/api/reports)
  // 4. If successful, mark as synced === true
  
  // NOTE: For the hackathon context, this demonstrates the background sync
  // capability required for the Field Incident App.
}
