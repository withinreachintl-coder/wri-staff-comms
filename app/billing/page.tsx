'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Organization = {
  id: string
  name: string
  plan: 'free' | 'pro'
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled'
  trial_ends_at: string | null
  billing_email: string | null
}

export default function BillingPage() {
  const router = useRouter()
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [upgrading, setUpgrading] = useState(false)
  const [trialDaysLeft, setTrialDaysLeft] = useState(0)

  useEffect(() => {
    loadBillingData()
  }, [])

  const loadBillingData = async () => {
    try {
      setLoading(true)
      setError('')

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push('/login')
        return
      }

      // Get user's org
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', user.id)
        .single()

      if (userDataError || !userData?.org_id) {
        setError('Organization not found')
        return
      }

      // Get org billing details
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, plan, subscription_status, trial_ends_at, billing_email')
        .eq('id', userData.org_id)
        .single()

      if (orgError || !orgData) {
        setError('Failed to load billing information')
        return
      }

      setOrg(orgData as Organization)

      // Calculate trial days left
      if (orgData.trial_ends_at && orgData.plan === 'free') {
        const trialEnd = new Date(orgData.trial_ends_at).getTime()
        const now = Date.now()
        const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
        setTrialDaysLeft(Math.max(0, daysLeft))
      }
    } catch (err) {
      console.error('Failed to load billing data:', err)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeClick = async () => {
    try {
      setUpgrading(true)
      setError('')

      // Call our checkout session API
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to start checkout')
        return
      }

      const { url } = await response.json()

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        setError('Failed to get checkout URL')
      }
    } catch (err) {
      console.error('Upgrade error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <main style={{ background: '#FAFAF9', minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-dmsans)', color: '#6B5B4E' }}>Loading...</p>
        </div>
      </main>
    )
  }

  if (!org) {
    return (
      <main style={{ background: '#FAFAF9', minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#D97706' }}>
            ← Back to Dashboard
          </Link>
          <p style={{ fontFamily: 'var(--font-dmsans)', color: '#DC2626', marginTop: '20px' }}>
            {error || 'Organization not found'}
          </p>
        </div>
      </main>
    )
  }

  const isPro = org.plan === 'pro' && org.subscription_status === 'active'
  const isTrialExpired = org.plan === 'free' && trialDaysLeft === 0
  const isOnTrial = org.plan === 'free' && trialDaysLeft > 0

  return (
    <main style={{ background: '#FAFAF9', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#1C1917', padding: '16px 24px', borderBottom: '1px solid #E5E0D8' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#F5F0E8', fontWeight: 500 }}>
            ← Dashboard
          </Link>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', color: '#F5F0E8', margin: '8px 0 0 0' }}>
            Billing & Plan
          </h1>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>
        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', padding: '16px', marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '14px', color: '#DC2626', margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* Current Plan Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-dmsans)', fontSize: '13px', fontWeight: 600, color: '#6B5B4E', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
            Current Plan
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: 600, color: '#1C1917', margin: '0 0 4px 0' }}>
                {isPro ? 'Staff Comms Pro' : 'Free Trial'}
              </h3>
              <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '14px', color: '#6B5B4E', margin: 0 }}>
                {isPro ? '$29/month' : 'Limited access'}
              </p>
            </div>
            <div style={{
              background: isPro ? '#ECFDF5' : isTrialExpired ? '#FEE2E2' : '#FEF3C7',
              color: isPro ? '#059669' : isTrialExpired ? '#DC2626' : '#D97706',
              padding: '8px 16px',
              borderRadius: '4px',
              fontFamily: 'var(--font-dmsans)',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              {isPro ? 'Active' : isTrialExpired ? 'Expired' : `${trialDaysLeft} days left`}
            </div>
          </div>

          {/* Trial Info */}
          {isOnTrial && org.trial_ends_at && (
            <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '13px', color: '#6B5B4E', margin: '0 0 20px 0' }}>
              Trial ends: {new Date(org.trial_ends_at).toLocaleDateString()}
            </p>
          )}

          {/* Pro Features */}
          {isPro && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E5E0D8' }}>
              <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '12px', fontWeight: 600, color: '#6B5B4E', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                Features Included
              </p>
              <ul style={{ fontFamily: 'var(--font-dmsans)', fontSize: '13px', color: '#1C1917', margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '6px' }}>✓ Unlimited announcements</li>
                <li style={{ marginBottom: '6px' }}>✓ Shift swap management</li>
                <li style={{ marginBottom: '6px' }}>✓ Read receipts</li>
                <li>✓ Unlimited team members</li>
              </ul>
            </div>
          )}

          {/* Billing Email */}
          {org.billing_email && (
            <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '12px', color: '#A89880', margin: '20px 0 0 0' }}>
              Billing email: {org.billing_email}
            </p>
          )}
        </div>

        {/* Action Section */}
        {isTrialExpired && (
          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '20px', marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', fontWeight: 600, color: '#D97706', margin: '0 0 8px 0' }}>
              Your trial has expired
            </h3>
            <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '14px', color: '#6B5B4E', margin: '0 0 16px 0' }}>
              Upgrade to Staff Comms Pro to keep using announcements, shift swaps, and team communication.
            </p>
            <button
              onClick={handleUpgradeClick}
              disabled={upgrading}
              style={{
                width: '100%',
                background: '#D97706',
                color: '#1C1917',
                fontFamily: 'var(--font-dmsans)',
                fontSize: '14px',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '4px',
                border: 'none',
                cursor: upgrading ? 'not-allowed' : 'pointer',
                opacity: upgrading ? 0.7 : 1,
              }}
            >
              {upgrading ? 'Redirecting to checkout...' : 'Upgrade to Pro'}
            </button>
          </div>
        )}

        {!isPro && !isTrialExpired && (
          <button
            onClick={handleUpgradeClick}
            disabled={upgrading}
            style={{
              width: '100%',
              background: '#D97706',
              color: '#1C1917',
              fontFamily: 'var(--font-dmsans)',
              fontSize: '14px',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '4px',
              border: 'none',
              cursor: upgrading ? 'not-allowed' : 'pointer',
              opacity: upgrading ? 0.7 : 1,
            }}
          >
            {upgrading ? 'Redirecting to checkout...' : 'Upgrade to Pro ($29/month)'}
          </button>
        )}

        {isPro && (
          <div style={{ background: '#ECFDF5', border: '1px solid #D1FAE5', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '13px', color: '#059669', margin: 0 }}>
              ✓ Your subscription is active. All Pro features are available.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
