import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Bharat Highway Suraksha | NER Resilient Logistics & Highway Operations Center',
  description: 'National Highway Geotechnical Telemetry, Corridor Disaster Mitigation, and Heavy Freight Convoy Operations (MoRTH / PM GatiShakti)',
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
              background: '#0c1322',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}
