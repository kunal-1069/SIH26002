import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'NER Sentry // Seven Sisters Route Intelligence & Dual-Hazard AI',
  description: 'Real-Time Landslide & Flood AI Detection, Dijkstra Graph Rerouting, and Fleet Telemetry across Northeast India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              fontSize: '0.82rem',
              fontWeight: 600,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}

