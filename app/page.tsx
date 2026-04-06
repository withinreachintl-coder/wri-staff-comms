export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#141210' }}>
      {/* Nav */}
      <nav
        className="border-b"
        style={{
          background: '#1C1917',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: '#F5F0E8',
              }}
            >
              Staff Comms
            </span>
          </div>
          <a
            href="/login"
            className="text-sm font-medium px-5 py-2"
            style={{
              background: '#D97706',
              color: '#1C1917',
              borderRadius: '4px',
            }}
          >
            Start Free Trial
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#F5F0E8',
            }}
          >
            Your team deserves better
            <br />
            than a WhatsApp group chat
          </h1>
          <p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              color: '#A89880',
              lineHeight: 1.7,
            }}
          >
            Announcements get buried. Shift swaps fall through the cracks.
            Staff Comms gives your restaurant team one clear place to coordinate
            — with read receipts so you know who saw what.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="text-base font-medium px-8 py-3 block text-center sm:inline-block"
              style={{
                background: '#D97706',
                color: '#1C1917',
                borderRadius: '4px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Start 14-Day Free Trial
            </a>
            <a
              href="#features"
              className="text-base px-8 py-3 block text-center sm:inline-block"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#F5F0E8',
                borderRadius: '4px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
              }}
            >
              See How It Works
            </a>
          </div>
          <p
            className="mt-5 text-sm"
            style={{ color: '#6B5B4E', fontFamily: "'DM Sans', sans-serif" }}
          >
            No credit card required
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl text-center mb-16"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              color: '#F5F0E8',
            }}
          >
            Everything your team needs, nothing it doesn&apos;t
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Announcements */}
            <div
              className="p-6"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E0D8',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#FEF3C7',
                  border: '1px solid #D97706',
                  borderRadius: '4px',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                📢
              </div>
              <h3
                className="text-base mb-2"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  color: '#1C1917',
                }}
              >
                Announcements
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  color: '#6B5B4E',
                }}
              >
                Broadcast updates to your entire team or specific roles.
                No more "did you see my message?" — you'll know exactly who read it.
              </p>
            </div>

            {/* Shift Swaps */}
            <div
              className="p-6"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E0D8',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#FEF3C7',
                  border: '1px solid #D97706',
                  borderRadius: '4px',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                🔄
              </div>
              <h3
                className="text-base mb-2"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  color: '#1C1917',
                }}
              >
                Shift Swaps
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  color: '#6B5B4E',
                }}
              >
                Staff request a swap, teammates claim it, manager approves.
                Clean, traceable, no more screenshot negotiations.
              </p>
            </div>

            {/* Read Receipts */}
            <div
              className="p-6"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E0D8',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#FEF3C7',
                  border: '1px solid #D97706',
                  borderRadius: '4px',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                ✓
              </div>
              <h3
                className="text-base mb-2"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  color: '#1C1917',
                }}
              >
                Read Receipts
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  color: '#6B5B4E',
                }}
              >
                See who opened your announcement and when.
                Follow up with the three people who missed it — not the whole team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-20 px-6" style={{ background: '#1C1917' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              color: '#F5F0E8',
            }}
          >
            Built for restaurants, not office workers
          </h2>
          <p
            className="text-base mb-12"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              color: '#A89880',
              lineHeight: 1.7,
            }}
          >
            Your team checks their phone between rushes, not between meetings.
            Staff Comms is designed for the pace of a kitchen — fast to read,
            impossible to miss.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div
              className="p-5"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
              }}
            >
              <p
                className="text-sm mb-1"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  color: '#D97706',
                }}
              >
                Before
              </p>
              <p
                className="text-sm"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  color: '#A89880',
                }}
              >
                "Did anyone see my message about Saturday's schedule change?
                Can someone scroll up and find it?"
              </p>
            </div>
            <div
              className="p-5"
              style={{
                border: '1px solid rgba(217,119,6,0.3)',
                borderRadius: '8px',
                background: 'rgba(217,119,6,0.05)',
              }}
            >
              <p
                className="text-sm mb-1"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  color: '#D97706',
                }}
              >
                After
              </p>
              <p
                className="text-sm"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  color: '#F5F0E8',
                }}
              >
                "11 of 12 staff read the schedule update. Maria hasn't — I'll
                text her directly."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" style={{ background: '#141210' }}>
        <div className="max-w-md mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              color: '#F5F0E8',
            }}
          >
            Simple pricing
          </h2>
          <p
            className="text-sm mb-10"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              color: '#6B5B4E',
            }}
          >
            One plan. Everything included.
          </p>

          <div
            className="p-8"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E0D8',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span
                className="text-4xl"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#1C1917',
                }}
              >
                $29
              </span>
              <span
                className="text-sm"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  color: '#6B5B4E',
                }}
              >
                /month
              </span>
            </div>
            <p
              className="text-sm mb-8"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: '#6B5B4E',
              }}
            >
              14-day free trial — no credit card required
            </p>

            <ul className="text-left space-y-3 mb-8">
              {[
                'Unlimited announcements',
                'Shift swap management',
                'Read receipts on every message',
                'Unlimited team members',
                'Mobile-first design',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L6.5 11.5L13 5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      color: '#1C1917',
                    }}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="/login"
              className="block w-full text-center text-base font-medium py-3"
              style={{
                background: '#D97706',
                color: '#1C1917',
                borderRadius: '4px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Start 14-Day Free Trial
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 px-6 border-t"
        style={{
          background: '#1C1917',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              color: '#6B5B4E',
            }}
          >
            Part of the{' '}
            <a
              href="https://wireach.tools"
              style={{ color: '#A89880', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              WiReach Tools
            </a>{' '}
            suite
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              color: '#6B5B4E',
            }}
          >
            staff.wireach.tools
          </p>
        </div>
      </footer>
    </div>
  )
}
