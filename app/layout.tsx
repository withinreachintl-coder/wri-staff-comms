import './globals.css'

export const metadata = {
  title: 'WRI Staff Comms — Team Communication for Restaurants',
  description: 'Replace WhatsApp chaos with structured team communication. Announcements, shift swaps, and read receipts built for restaurant teams.',
}

const footerLinkStyle: React.CSSProperties = {
  color: '#78716C',
  fontSize: '13px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  padding: '0 4px',
}

const suiteCrossLinkStyle: React.CSSProperties = {
  color: '#A89880',
  fontSize: '14px',
  fontFamily: 'var(--font-dmsans), DM Sans, sans-serif',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  padding: '0 4px',
  transition: 'color 120ms ease',
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #292524',
      padding: '24px',
      maxWidth: '768px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{ color: '#78716C', fontSize: '13px' }}>Built for independent restaurants, by an independent restaurant owner.</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', alignItems: 'center' }}>
          <a href="https://wireach.tools/privacy" style={footerLinkStyle}>Privacy</a>
          <a href="https://wireach.tools/terms" style={footerLinkStyle}>Terms</a>
          <a href="mailto:support@wireach.tools" style={footerLinkStyle}>Support</a>
          <a href="https://wireach.tools" className="wri-suite-link" style={suiteCrossLinkStyle}>Part of WRI Suite →</a>
        </div>
      </div>
      <p style={{ marginTop: '16px', color: '#78716C', fontSize: '12px' }}>
        Within Reach International LLC · Memphis, TN
      </p>
    </footer>
  )
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
      <body style={{ minHeight: '100vh', backgroundColor: '#1C1917', color: '#1C1917' }}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
