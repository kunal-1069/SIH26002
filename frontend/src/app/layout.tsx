import './globals.css';
import { Toaster } from 'react-hot-toast';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Logistics Services and Supply-Chain Solution - Renuka Logistics',
  description: 'Get all types of transportation solutions you need to support your business growth. We at Renuka Logistics offers cost-effective logistics services and supply-chain management solution for domestic and international customers.',
  manifest: '/manifest.json',
  applicationName: 'Renuka Logistics',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Renuka Logistics',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#1d4ed8" />
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
