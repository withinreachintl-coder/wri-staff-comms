import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#1C1917' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '24px', textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'rgba(239,68,68,0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair), "Playfair Display", serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#F5F0E8',
          marginBottom: '12px',
        }}>
          Authentication Error
        </h1>
        <p style={{
          fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
          fontSize: '14px',
          color: '#A89880',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}>
          Something went wrong during sign in. Please try again or contact support if the problem persists.
        </p>
        <Link
          href="/auth/login"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1C1917',
            background: '#D97706',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            textDecoration: 'none',
          }}
          className="hover:opacity-90 transition-opacity"
        >
          Try Again
        </Link>
      </div>
    </main>
  )
}
