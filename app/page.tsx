import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ background: '#1C1917', color: '#F5F0E8', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(28,25,23,0.95)', backdropFilter: 'blur(10px)',
        height: '64px', display: 'flex', alignItems: 'center',
        padding: '0 24px', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#D97706',
            borderRadius: '6px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px', color: '#fff', fontWeight: 700
          }}>✓</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 700 }}>Staff Comms</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#features" style={{ color: '#F5F0E8', textDecoration: 'none', fontSize: '15px' }}>How It Works</a>
          <a href="/login" style={{
            border: '1px solid #F5F0E8', padding: '8px 20px',
            borderRadius: '6px', color: '#F5F0E8', textDecoration: 'none', fontSize: '15px'
          }}>Log In</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '160px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '768px', margin: '0 auto' }}>
        <p style={{ color: '#D97706', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '24px' }}>
          For Independent Restaurants
        </p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '52px', lineHeight: 1.1, fontWeight: 700, marginBottom: '24px' }}>
          Your team deserves better than{' '}
          <span style={{ color: '#D97706' }}>a WhatsApp group chat.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#A8A29E', lineHeight: 1.6, marginBottom: '40px', maxWidth: '560px' }}>
          Announcements get buried. Shift swaps fall through the cracks. Staff Comms gives your restaurant team one clear place to coordinate — with read receipts so you know who saw what.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            background: '#D97706', color: '#fff', padding: '14px 28px',
            borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '16px', display: 'inline-block'
          }}>Start 14-Day Free Trial</Link>
          <span style={{ color: '#78716C', fontSize: '14px' }}>No credit card required · $29/mo after trial</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: '768px', margin: '0 auto' }}>
        <p style={{ color: '#D97706', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
          What You Get
        </p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, marginBottom: '48px' }}>
          Everything your team needs. Nothing it doesn't.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          {[
            { icon: '👁', title: 'Announcements', desc: 'Broadcast updates to your entire team or specific roles. No more "did you see my message?" — you\'ll know exactly who read it.' },
            { icon: '🕐', title: 'Shift Swaps', desc: 'Staff request a swap, teammates claim it, manager approves. Clean, traceable, no more screenshot negotiations.' },
            { icon: '✓', title: 'Read Receipts', desc: 'See who opened your announcement and when. Follow up with the three people who missed it — not the whole team.' },
          ].map((f) => (
            <div key={f.title} style={{ background: '#292524', borderRadius: '12px', padding: '28px' }}>
              <div style={{
                width: '40px', height: '40px', background: '#1C1917', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', color: '#D97706', marginBottom: '20px'
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: '#A8A29E', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: '80px 24px', maxWidth: '768px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', borderRadius: '12px', padding: '48px 40px' }}>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px' }}>
            "We were losing team members because they didn't see shift swap requests. Now everything is crystal clear and we're actually scheduling people who want to work."
          </p>
          <p style={{ fontSize: '14px', color: '#6B5B4E' }}>
            Restaurant manager, frustrated with team communication gaps
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 24px', maxWidth: '768px', margin: '0 auto' }}>
        <p style={{ color: '#D97706', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Pricing
        </p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, marginBottom: '48px' }}>
          Simple. Honest. No surprises.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Free Tier */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '40px 32px' }}>
            <p style={{ color: '#A8A29E', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Free
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '32px' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '40px', fontWeight: 700 }}>$0</span>
              <span style={{ color: '#6B5B4E', fontSize: '14px' }}>/month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
              {['Up to 3 team members', 'Basic announcements', 'Limited read receipts'].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '14px', color: '#A8A29E' }}>
                  <span style={{ color: '#D97706' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{
              display: 'block', width: '100%', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)', color: '#F5F0E8', padding: '12px',
              borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px'
            }}>
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div style={{ background: 'rgba(217,119,6,0.08)', border: '2px solid rgba(217,119,6,0.2)', borderRadius: '12px', padding: '40px 32px', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '-14px', left: '32px',
              background: '#D97706', color: '#1C1917', padding: '4px 16px',
              borderRadius: '6px', fontSize: '11px', fontWeight: 600
            }}>
              RECOMMENDED
            </div>
            <p style={{ color: '#D97706', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Pro
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '32px' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '40px', fontWeight: 700 }}>$29</span>
              <span style={{ color: '#6B5B4E', fontSize: '14px' }}>/month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
              {['Unlimited team members', 'Unlimited announcements', 'Shift swap management', 'Full read receipts', 'Mobile app access'].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '14px', color: '#A8A29E' }}>
                  <span style={{ color: '#D97706' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: '#D97706', color: '#1C1917', padding: '12px',
              borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px'
            }}>
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '768px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
          Ready to replace WhatsApp chaos?
        </h2>
        <p style={{ color: '#A8A29E', fontSize: '16px', marginBottom: '32px' }}>
          Start your free trial. No credit card. Cancel anytime.
        </p>
        <Link href="/login" style={{
          background: '#D97706', color: '#fff', padding: '14px 28px',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '16px', display: 'inline-block'
        }}>Start 14-Day Free Trial</Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', maxWidth: '768px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: '13px', color: '#6B5B4E' }}>
          Part of the <a href="https://wireach.tools" style={{ color: '#A8A29E', textDecoration: 'underline' }}>WiReach Tools</a> suite for independent restaurants.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '13px' }}>Privacy</a>
          <a href="#" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '13px' }}>Terms</a>
        </div>
      </footer>
    </main>
  )
}
