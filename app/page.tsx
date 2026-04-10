import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ background: '#1C1917', color: '#F5F0E8' }}>
      {/* Nav — Fixed, full-width */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(28,25,23,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(217,119,6,0.15)',
                border: '1px solid rgba(217,119,6,0.3)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              &#10003;
            </div>
            <span
              style={{
                fontFamily: 'var(--font-playfair), "Playfair Display", serif',
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              Staff Comms
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a
              href="/help"
              className="hidden sm:inline hover:opacity-80 transition-opacity"
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#A89880',
                textDecoration: 'none',
              }}
            >
              How It Works
            </a>
          <Link
            href="/login"
            className="hover:opacity-80 transition-opacity"
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#F5F0E8',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              padding: '8px 20px',
              textDecoration: 'none',
            }}
          >
            Log In
          </Link>
          </div>
        </div>
      </nav>

      {/* Page Container */}
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 24px' }}>
        {/* Hero */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '64px' }}>
          <div className="w-full">
          <p
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: '#D97706',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              marginBottom: '20px',
            }}
          >
            For independent restaurants
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            Your team deserves<br />
            better than<br />
            <span style={{ color: '#D97706' }}>a WhatsApp group chat.</span>
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '18px',
              fontWeight: 300,
              lineHeight: 1.7,
              color: '#A89880',
              maxWidth: '520px',
              marginBottom: '40px',
            }}
          >
            Announcements get buried. Shift swaps fall through the cracks. Staff Comms
            gives your restaurant team one clear place to coordinate — with read receipts
            so you know who saw what.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="hover:opacity-90 transition-opacity"
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                background: '#D97706',
                color: '#1C1917',
                fontSize: '15px',
                fontWeight: 500,
                padding: '14px 32px',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Start 14-Day Free Trial
            </Link>
            <span
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#6B5B4E',
              }}
            >
              No credit card required &middot; $29/mo after trial
            </span>
          </div>
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

      {/* Quote */}
      <section className="py-20 md:py-24">
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '40px 36px',
            position: 'relative' as const,
            overflow: 'hidden',
          }}
        >
          {/* Decorative quotation mark */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-8px',
              left: '24px',
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: '120px',
              fontWeight: 700,
              lineHeight: 1,
              color: 'rgba(217,119,6,0.08)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            &ldquo;
          </div>
          <p
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.6,
              marginBottom: '16px',
              position: 'relative',
            }}
          >
            &ldquo;We were losing team members because they didn&apos;t see shift swap
            requests. Now everything is crystal clear and we&apos;re actually scheduling
            people who want to work.&rdquo;
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            <div
              style={{
                width: '24px',
                height: '1px',
                background: 'rgba(217,119,6,0.3)',
              }}
            />
            <p
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#6B5B4E',
              }}
            >
              Restaurant manager, frustrated with team communication gaps
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-24">
        <p
          style={{
            fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            color: '#6B5B4E',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            marginBottom: '12px',
          }}
        >
          Pricing
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
            fontWeight: 500,
            marginBottom: '48px',
          }}
        >
          Simple. Honest. No surprises.
        </h2>

        <div className="grid md:grid-cols-1 gap-6 max-w-2xl">
          {/* Pro Tier */}
          <div
            style={{
              background: 'rgba(217,119,6,0.06)',
              border: '1px solid rgba(217,119,6,0.2)',
              borderRadius: '8px',
              padding: '36px 32px',
              position: 'relative' as const,
            }}
          >
            <div
              style={{
                position: 'absolute' as const,
                top: '-12px',
                left: '32px',
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                color: '#1C1917',
                background: '#D97706',
                padding: '4px 12px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
              }}
            >
              One Plan. Everything Included.
            </div>
            <p
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                color: '#D97706',
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                marginBottom: '8px',
              }}
            >
              Staff Comms
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-playfair), "Playfair Display", serif',
                  fontSize: '40px',
                  fontWeight: 700,
                }}
              >
                $29
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 300,
                  color: '#6B5B4E',
                }}
              >
                /month
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0' }}>
              {['Unlimited announcements', 'Shift swap management', 'Read receipts on every message', 'Unlimited team members', 'Mobile-first design'].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                    fontSize: '14px',
                    fontWeight: 300,
                    color: '#A89880',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ color: '#D97706', marginTop: '2px', flexShrink: 0 }}>&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="hover:opacity-90 transition-opacity"
              style={{
                display: 'block',
                textAlign: 'center',
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1C1917',
                background: '#D97706',
                borderRadius: '4px',
                padding: '12px 24px',
                textDecoration: 'none',
              }}
            >
              Start 14-Day Free Trial
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '12px',
                fontWeight: 300,
                color: '#6B5B4E',
                marginTop: '12px',
                textAlign: 'center',
              }}
            >
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '768px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
          Ready to run a tighter ship?
        </h2>
        <p style={{ color: '#A8A29E', fontSize: '16px', marginBottom: '32px' }}>
          14 days free. No credit card. Cancel anytime.
        </p>
        <Link href="/login" style={{
          background: '#D97706', color: '#fff', padding: '16px 36px',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '16px', display: 'inline-block'
        }}>Start Free Trial</Link>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              color: '#6B5B4E',
            }}
          >
            Part of the <a href="https://wireach.tools" style={{ color: '#A89880', textDecoration: 'underline', textDecorationColor: 'rgba(217,119,6,0.3)' }}>WiReach Tools</a> suite
          </p>
          <p
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              color: '#6B5B4E',
            }}
          >
            staff.wireach.tools
          </p>
        </div>
      </footer>
      </div>
    </main>
  )
}
