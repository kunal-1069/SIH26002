export const metadata = {
  title: 'NER Route Intelligence',
  description: 'Landslide & Flood AI Detection and Rerouting across Seven Sister States',
}

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      <body style={{ margin: 0, padding: 0, width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}
