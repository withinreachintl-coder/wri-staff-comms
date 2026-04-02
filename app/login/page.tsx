'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
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
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#1C1917' }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#F5F0E8',
            marginBottom: '8px',
            margin: '0 0 8px 0',
          }}>
            Staff Comms
          </h1>
          <p style={{
            fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 300,
            color: '#A89880',
          }}>
            Sign in to your restaurant team's communication hub
          </p>
        </div>

        {!sent ? (
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '32px',
            }}
          >
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#A89880',
                    marginBottom: '8px',
                  }}
                >
                  Email address
                </label>
                <input
                  id="email"
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
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                  }}
                />
              </div>

              {error && (
                <div
                  style={{
                    fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#EF4444',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1C1917',
                  background: loading ? '#6B5B4E' : '#D97706',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '14px 24px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                className="hover:opacity-90 transition-opacity"
              >
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </form>

            <p
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 300,
                color: '#6B5B4E',
                textAlign: 'center',
                marginTop: '20px',
                margin: '20px 0 0 0',
              }}
            >
              We&apos;ll email you a magic link for a password-free sign in.
            </p>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '40px 32px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#9993;</div>
            <h1
              style={{
                fontFamily: 'var(--font-playfair), "Playfair Display", serif',
                fontSize: '24px',
                fontWeight: 700,
                color: '#F5F0E8',
                marginBottom: '8px',
              }}
            >
              Check your email
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                color: '#A89880',
                marginBottom: '24px',
                lineHeight: 1.6,
              }}
            >
              We sent a magic link to <strong style={{ color: '#F5F0E8', fontWeight: 500 }}>{email}</strong>
            </p>
            <p
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 300,
                color: '#6B5B4E',
                marginBottom: '24px',
              }}
            >
              Click the link in the email to sign in. You can close this window.
            </p>
            <button
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#D97706',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              className="hover:opacity-80 transition-opacity"
            >
              &larr; Use a different email
            </button>
          </div>
        )}

        <p
          style={{
            fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 400,
            color: '#6B5B4E',
            textAlign: 'center',
            marginTop: '24px',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="https://buy.stripe.com/7sYdR859f5B37Mz2Qp9k404"
            style={{ color: '#D97706', textDecoration: 'none', fontWeight: 500 }}
            className="hover:opacity-80 transition-opacity"
          >
            Start free trial
          </Link>
        </p>
      </div>
    </main>
  )
}
