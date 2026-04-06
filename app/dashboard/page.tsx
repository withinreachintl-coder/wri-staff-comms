'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff'
}

type Organization = {
  id: string
  name: string
  owner_email: string
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled'
  trial_ends_at: string | null
  plan: 'free' | 'pro'
  created_at: string
}

type Announcement = {
  id: string
  title: string
  body: string
  author_id: string
  created_at: string
}

type ShiftSwap = {
  id: string
  status: 'open' | 'claimed' | 'approved' | 'rejected' | 'canceled'
}

type TeamMember = {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [org, setOrg] = useState<Organization | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [shiftSwaps, setShiftSwaps] = useState<ShiftSwap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [redirecting, setRedirecting] = useState(false)
  const [trialDaysLeft, setTrialDaysLeft] = useState(0)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        setRedirecting(true)
        router.push('/login')
        return
      }

      // Get user profile with retry
      let userData = null
      let userError = null
      for (let i = 0; i < 2; i++) {
        const result = await supabase
          .from('users')
          .select('id, email, name, role, org_id')
          .eq('id', authUser.id)
          .single()
        
        userData = result.data
        userError = result.error
        
        // If successful, break out of retry loop
        if (userData) break
        
        // If this is the last retry, don't wait
        if (i < 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }

      if (userError || !userData) {
        setError('Failed to load user profile')
        return
      }

      setUser(userData)

      // Get organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', userData.org_id)
        .single()

      if (orgError || !orgData) {
        setError('Failed to load organization')
        return
      }

      setOrg(orgData)

      // Calculate trial days left
      if (orgData.subscription_status === 'trial' && orgData.trial_ends_at) {
        const trialEnd = new Date(orgData.trial_ends_at)
        const now = new Date()
        const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        setTrialDaysLeft(Math.max(0, daysLeft))
      }

      // Get team members
      const { data: teamData, error: teamError } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('org_id', userData.org_id)
        .order('created_at', { ascending: false })

      if (!teamError && teamData) {
        setTeamMembers(teamData)
      }

      // Get announcements
      const { data: announcementData, error: announcementError } = await supabase
        .from('announcements')
        .select('id, title, body, author_id, created_at')
        .eq('org_id', userData.org_id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (!announcementError && announcementData) {
        setAnnouncements(announcementData)
      }

      // Get shift swaps summary
      const { data: shiftSwapData } = await supabase
        .from('shift_swaps')
        .select('id, status')
        .eq('org_id', userData.org_id)

      if (shiftSwapData) {
        setShiftSwaps(shiftSwapData)
      }
    } catch (err) {
      console.error('Dashboard error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading || redirecting) {
    return (
      <main style={{ background: '#1C1917', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#1C1917', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 300 }}>
          {redirecting ? 'Redirecting to login...' : 'Loading dashboard...'}
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main style={{ background: '#1C1917', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1 style={{ color: '#1C1917', fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '24px', marginBottom: '16px' }}>
            Error loading dashboard
          </h1>
          <p style={{ color: '#1C1917', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', marginBottom: '24px' }}>
            {error}
          </p>
          <button
            onClick={() => loadDashboard()}
            style={{
              background: '#D97706',
              color: '#1C1917',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 24px',
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </main>
    )
  }

  if (!user || !org) {
    return (
      <main style={{ background: '#1C1917', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#1C1917', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif' }}>
          No organization found. Please contact support.
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: '#FAFAF9', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#1C1917', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: '#1C1917', margin: 0 }}>
              {org.name}
            </h1>
            <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '12px', color: '#1C1917', margin: '4px 0 0 0' }}>
              Staff Communications
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', color: '#1C1917', margin: 0 }}>
                {user.name}
              </p>
              <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#1C1917', margin: '4px 0 0 0' }}>
                {user.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#1C1917',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
              }}
              className="hover:opacity-80 transition-opacity"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div style={{ background: '#1C1917', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '32px' }}>
          <Link
            href="/dashboard"
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: '#1C1917',
              borderBottom: '2px solid #D97706',
              padding: '16px 0',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            Announcements
          </Link>
          <Link
            href="/shift-swaps"
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: '#1C1917',
              borderBottom: '2px solid transparent',
              padding: '16px 0',
              textDecoration: 'none',
              display: 'block',
            }}
            className="hover:opacity-80 transition-opacity"
          >
            Shift Swaps
          </Link>
        </div>
      </div>

      {/* Trial banner */}
      {org.subscription_status === 'trial' && (
        <div style={{ background: 'rgba(217,119,6,0.12)', borderBottom: '1px solid rgba(217,119,6,0.2)', padding: '16px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 500, color: '#D97706', margin: 0 }}>
                  {trialDaysLeft > 0
                    ? `${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} left in your free trial`
                    : 'Your trial has ended'}
                </p>
              </div>
              <Link
                href="/billing"
                style={{
                  fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#1C1917',
                  background: '#D97706',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
                className="hover:opacity-90 transition-opacity"
              >
                Upgrade now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Announcements section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: '#1C1917', margin: 0 }}>
                Announcements
              </h2>
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link
                  href="/announcements/new"
                  style={{
                    fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#1C1917',
                    background: '#D97706',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  + New announcement
                </Link>
              )}
            </div>

            {announcements.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E0D8',
                      borderRadius: '8px',
                      padding: '20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '15px', fontWeight: 600, color: '#1C1917', margin: '0 0 8px 0' }}>
                      {announcement.title}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', fontWeight: 300, color: '#1C1917', margin: 0, lineHeight: 1.6 }}>
                      {announcement.body}
                    </p>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#1C1917', margin: '12px 0 0 0' }}>
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px dashed #E5E0D8',
                  borderRadius: '8px',
                  padding: '40px 24px',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', color: '#1C1917', margin: 0 }}>
                  No announcements yet
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Team members */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 700, color: '#1C1917', margin: '0 0 16px 0' }}>
                Team ({teamMembers.length})
              </h3>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                {teamMembers.length > 0 ? (
                  <div>
                    {teamMembers.map((member, index) => (
                      <div
                        key={member.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: index < teamMembers.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#1C1917', margin: 0 }}>
                            {member.name}
                          </p>
                          <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#1C1917', margin: '2px 0 0 0' }}>
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '12px', color: '#1C1917', margin: 0 }}>
                      No team members yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Shift swaps quick stats */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 700, color: '#1C1917', margin: '0 0 16px 0' }}>
                Shift Swaps
              </h3>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#1C1917', margin: '0 0 4px 0' }}>
                      Open
                    </p>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '18px', fontWeight: 600, color: '#D97706', margin: 0 }}>
                      {shiftSwaps.filter((s) => s.status === 'open').length}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#1C1917', margin: '0 0 4px 0' }}>
                      Pending
                    </p>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '18px', fontWeight: 600, color: '#3B82F6', margin: 0 }}>
                      {shiftSwaps.filter((s) => s.status === 'claimed').length}
                    </p>
                  </div>
                </div>
                <Link
                  href="/shift-swaps"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#D97706',
                    textAlign: 'center',
                    textDecoration: 'none',
                    padding: '8px 0',
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  View all shifts →
                </Link>
              </div>
            </div>

            {/* Account info */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 700, color: '#1C1917', margin: '0 0 16px 0' }}>
                Account
              </h3>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#1C1917', margin: '0 0 4px 0' }}>
                    Plan
                  </p>
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 500, color: '#1C1917', margin: 0 }}>
                    {org.subscription_status === 'trial' || !org.subscription_status ? 'Free Trial' : 'Pro'}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#1C1917', margin: '0 0 4px 0' }}>
                    Status
                  </p>
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 500, color: org.subscription_status === 'trial' || !org.subscription_status ? '#D97706' : '#10B981', margin: 0 }}>
                    {org.subscription_status === 'trial' || !org.subscription_status ? 'Trial' : 'Active'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
