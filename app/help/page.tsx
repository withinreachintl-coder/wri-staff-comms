import Link from 'next/link'

export default function HelpPage() {
  return (
    <main style={{ background: '#FAFAF9', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#1C1917', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>
              How to Use Staff Comms
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link
              href="/dashboard"
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#F5F0E8',
                textDecoration: 'none',
              }}
              className="hover:opacity-80 transition-opacity"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Announcements Section */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '28px' }}>📢</span>
            <h2 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '24px', fontWeight: 600, color: '#1C1917', margin: 0 }}>
              Announcements
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '24px', marginBottom: '24px' }}>
            {/* What you can do */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 600, color: '#1C1917', marginTop: 0, marginBottom: '12px' }}>
                What you can do
              </h3>
              <ul style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 300, color: '#1C1917', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                <li>Post announcements to your entire team</li>
                <li>See who has read each announcement</li>
                <li>Follow up with team members who haven&apos;t read it</li>
                <li>Pin important announcements to the top</li>
              </ul>
            </div>

            {/* How it works */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 600, color: '#1C1917', marginTop: 0, marginBottom: '12px' }}>
                How it works
              </h3>
              <ol style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 300, color: '#1C1917', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                <li>Click "+ New announcement" from the dashboard</li>
                <li>Write your title and message</li>
                <li>Hit Post — your team sees it immediately on their dashboard</li>
                <li>Read receipts update automatically as team members log in</li>
              </ol>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E5E0D8' }} />
        </div>

        {/* Shift Swaps Section */}
        <div style={{ marginBottom: '56px', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '28px' }}>🔄</span>
            <h2 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '24px', fontWeight: 600, color: '#1C1917', margin: 0 }}>
              Shift Swaps
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '24px', marginBottom: '24px' }}>
            {/* What you can do */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 600, color: '#1C1917', marginTop: 0, marginBottom: '12px' }}>
                What you can do
              </h3>
              <ul style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 300, color: '#1C1917', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                <li>Request a shift swap with a reason and date</li>
                <li>Team members can claim open swap requests</li>
                <li>Manager approves or rejects the swap</li>
                <li>Cancel your own pending request at any time</li>
              </ul>
            </div>

            {/* How it works */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 600, color: '#1C1917', marginTop: 0, marginBottom: '12px' }}>
                How it works
              </h3>
              <ul style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 300, color: '#1C1917', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                <li><strong>Staff:</strong> Click "+ Request Shift Swap", enter your shift date and reason, submit</li>
                <li><strong>Team:</strong> Open swap requests appear on the Shift Swaps page — click Claim to volunteer</li>
                <li><strong>Manager:</strong> Review claimed swaps and Approve or Reject from the dashboard</li>
                <li><strong>All parties:</strong> See status updates in real time</li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E5E0D8' }} />
        </div>

        {/* Plan Section */}
        <div style={{ marginBottom: '56px', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '28px' }}>★</span>
            <h2 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '24px', fontWeight: 600, color: '#1C1917', margin: 0 }}>
              Plan — $29/month
            </h2>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '32px' }}>
            <ul style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 300, color: '#1C1917', lineHeight: '1.8', margin: '0 0 32px 0', paddingLeft: '20px' }}>
              <li>Unlimited announcements</li>
              <li>Shift swap management</li>
              <li>Read receipts on every message</li>
              <li>Unlimited team members</li>
              <li>Mobile-first design</li>
              <li style={{ marginTop: '12px', fontWeight: 500 }}>14-day free trial (no credit card required)</li>
            </ul>
            <Link
              href="/billing"
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1C1917',
                background: '#D97706',
                padding: '12px 32px',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              className="hover:opacity-90 transition-opacity"
            >
              Upgrade Now →
            </Link>
          </div>

          <div style={{ borderTop: '1px solid #E5E0D8', marginTop: '48px' }} />
        </div>

        {/* General Tips Section */}
        <div style={{ paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '20px', fontWeight: 600, color: '#1C1917', marginBottom: '24px' }}>
            General Tips
          </h2>

          <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '24px' }}>
            <ul style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 300, color: '#1C1917', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>Managers should post shift reminders as announcements the night before</li>
              <li>Use shift swap requests instead of group texts — everything stays traceable</li>
              <li>Check the dashboard daily to see who hasn&apos;t read your latest announcement</li>
              <li>Only the account owner can manage billing</li>
            </ul>
          </div>

          {/* Support CTA */}
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 300, color: '#1C1917', marginBottom: '12px' }}>
              Need help?
            </p>
            <a
              href="mailto:support@wireach.tools"
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#D97706',
                textDecoration: 'none',
              }}
              className="hover:opacity-80 transition-opacity"
            >
              Email us at support@wireach.tools
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
