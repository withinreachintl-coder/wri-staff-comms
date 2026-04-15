import './globals.css'

export const metadata = {
  title: 'WRI Staff Comms — Team Communication for Restaurants',
  description: 'Replace WhatsApp chaos with structured team communication. Announcements, shift swaps, and read receipts built for restaurant teams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ minHeight: '100vh', backgroundColor: '#1C1917' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Playfair+Display:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: '100vh', backgroundColor: '#1C1917', color: '#1C1917' }}>{children}</body>
    </html>
  )
}
