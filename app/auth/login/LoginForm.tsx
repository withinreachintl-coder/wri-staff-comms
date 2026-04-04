'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#1C1917' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: '24px',
            fontWeight: 700,
            color: '#F5F0E8',
            marginBottom: '8px',
          }}>
            Staff Comms
          </h1>
          <p style={{
            fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
            fontSize: '13px',
            color: '#6B5B4E',
          }}>
            Sign in to continue
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#A89880',
                marginBottom: '8px',
              }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@restaurant.com"
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#F5F0E8',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '4px',
                  padding: '12px 16px',
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{
                marginBottom: '16px',
                padding: '12px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '4px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                  fontSize: '13px',
                  color: '#FCA5A5',
                }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%',
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1C1917',
                background: loading ? '#6B5B4E' : '#D97706',
                border: 'none',
                borderRadius: '4px',
                padding: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              className="hover:opacity-90 transition-opacity"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        ) : (
          <div style={{
            padding: '32px 24px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(217,119,6,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <span style={{ fontSize: '24px' }}>✉️</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: '#F5F0E8',
              marginBottom: '8px',
            }}>
              Check your email
            </p>
            <p style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '13px',
              color: '#A89880',
              lineHeight: '1.6',
            }}>
              We sent a magic link to <strong style={{ color: '#F5F0E8' }}>{email}</strong>. Click the link to sign in.
            </p>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '13px',
              color: '#6B5B4E',
              textDecoration: 'none',
            }}
            className="hover:opacity-70 transition-opacity"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
