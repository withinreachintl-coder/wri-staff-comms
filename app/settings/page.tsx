'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useOrg } from '../../lib/OrgContext'

type Organization = {
  id: string
  name: string
  billing_email: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const { org: contextOrg, setOrg: setContextOrg, updateOrgName, updateAccentColor } = useOrg()
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    billing_email: '',
  })

  useEffect(() => {
    loadOrgData()
  }, [])

  const loadOrgData = async () => {
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

      // Get org details
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, billing_email')
        .eq('id', userData.org_id)
        .single()

      if (orgError || !orgData) {
        setError('Failed to load organization')
        return
      }

      setOrg(orgData as Organization)
      setFormData({
        name: orgData.name || '',
        billing_email: orgData.billing_email || '',
      })
    } catch (err) {
      console.error('Error loading org data:', err)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Organization name is required')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setError('Not authenticated')
        return
      }

      if (!org?.id) {
        setError('Organization not found')
        return
      }

      // Update organization
      const { data: updatedOrg, error: updateError } = await supabase
        .from('organizations')
        .update({
          name: formData.name.trim(),
          billing_email: formData.billing_email.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', org.id)
        .select()
        .single()

      if (updateError) {
        setError('Failed to save settings')
        return
      }

      // Update local state
      setOrg(updatedOrg as Organization)
      
      // Update context for instant dashboard sync
      updateOrgName(updatedOrg.name)
      updateAccentColor(updatedOrg.accent_color)
      
      setSuccess('Settings saved successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
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

  return (
    <main style={{ background: '#FAFAF9', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#1C1917', padding: '16px 24px', borderBottom: '1px solid #E5E0D8' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#F5F0E8', fontWeight: 500 }}>
            ← Dashboard
          </Link>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', color: '#F5F0E8', margin: '8px 0 0 0' }}>
            Settings
          </h1>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Error Message */}
        {error && (
          <div
            style={{
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '14px', color: '#DC2626', margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            style={{
              background: '#ECFDF5',
              border: '1px solid #D1FAE5',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <p style={{ fontFamily: 'var(--font-dmsans)', fontSize: '14px', color: '#059669', margin: 0 }}>
              ✓ {success}
            </p>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSave}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '24px' }}>
            {/* Organization Name Field */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-dmsans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1C1917',
                  marginBottom: '8px',
                }}
              >
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter organization name"
                required
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dmsans)',
                  fontSize: '14px',
                  padding: '10px 12px',
                  border: '1px solid #E5E0D8',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  color: '#1C1917',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-dmsans)',
                  fontSize: '12px',
                  color: '#A89880',
                  margin: '6px 0 0 0',
                }}
              >
                This is how your restaurant appears in the app
              </p>
            </div>

            {/* Billing Email Field */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-dmsans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1C1917',
                  marginBottom: '8px',
                }}
              >
                Billing Email (Optional)
              </label>
              <input
                type="email"
                value={formData.billing_email}
                onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                placeholder="Enter billing email"
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dmsans)',
                  fontSize: '14px',
                  padding: '10px 12px',
                  border: '1px solid #E5E0D8',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  color: '#1C1917',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-dmsans)',
                  fontSize: '12px',
                  color: '#A89880',
                  margin: '6px 0 0 0',
                }}
              >
                Used for Stripe receipts and subscription updates
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
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
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
