import './globals.css';
import { Toaster } from 'react-hot-toast';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Bharat Highway Suraksha | NER Resilient Logistics & Highway Operations Center',
  description: 'National Highway Geotechnical Telemetry, Corridor Disaster Mitigation, and Heavy Freight Convoy Operations (MoRTH / PM GatiShakti)',
  manifest: '/manifest.json',
  applicationName: 'Highway Suraksha',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Highway Suraksha',
  },
  icons: {
    icon: '/icon-192.png',
    shortcut: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#090d16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#090d16" />
      </head>
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
