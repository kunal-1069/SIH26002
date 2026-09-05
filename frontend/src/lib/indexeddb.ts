import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface IncidentReport {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl?: string;
  timestamp: number;
  synced: number; // 0 for false, 1 for true (IndexedDB doesn't support boolean index keys)
}

interface SIHDB extends DBSchema {
  incidentReports: {
    key: string;
    value: IncidentReport;
    indexes: { 'by-synced': number };
  };
}

const DB_NAME = 'sih-offline-db';
const STORE_NAME = 'incidentReports';

export async function initDB(): Promise<IDBPDatabase<SIHDB>> {
  return openDB<SIHDB>(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
      });
      store.createIndex('by-synced', 'synced');
    },
  });
}

export async function saveReportOffline(report: Omit<IncidentReport, 'synced'>) {
  const db = await initDB();
  await db.add(STORE_NAME, {
    ...report,
    synced: 0,
  });
}

export async function getUnsyncedReports() {
  const db = await initDB();
  return db.getAllFromIndex(STORE_NAME, 'by-synced', 0);
}

export async function markReportSynced(id: string) {
  const db = await initDB();
  const report = await db.get(STORE_NAME, id);
  if (report) {
    report.synced = 1;
    await db.put(STORE_NAME, report);
  }
}
