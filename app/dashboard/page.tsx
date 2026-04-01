'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
        router.push('/auth/login')
        return
      }

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', authUser.id)
        .single()

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

  if (loading) {
    return (
      <main style={{ background: '#1C1917', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#A89880', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif' }}>
          Loading...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main style={{ background: '#1C1917', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1 style={{ color: '#F5F0E8', fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '24px', marginBottom: '16px' }}>
            Error loading dashboard
          </h1>
          <p style={{ color: '#A89880', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', marginBottom: '24px' }}>
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
        <div style={{ color: '#A89880', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif' }}>
          No organization found. Please contact support.
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: '#141210', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#1C1917', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>
              {org.name}
            </h1>
            <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '12px', color: '#6B5B4E', margin: '4px 0 0 0' }}>
              Staff Communications
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', color: '#F5F0E8', margin: 0 }}>
                {user.name}
              </p>
              <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#6B5B4E', margin: '4px 0 0 0' }}>
                {user.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#78716C',
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
              <h2 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>
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
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '20px',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '15px', fontWeight: 600, color: '#F5F0E8', margin: '0 0 8px 0' }}>
                      {announcement.title}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', fontWeight: 300, color: '#A89880', margin: 0, lineHeight: 1.6 }}>
                      {announcement.body}
                    </p>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#6B5B4E', margin: '12px 0 0 0' }}>
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '40px 24px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', color: '#6B5B4E', margin: 0 }}>
                  No announcements yet
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Team members */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 700, color: '#F5F0E8', margin: '0 0 16px 0' }}>
                Team ({teamMembers.length})
              </h3>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
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
                          <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#F5F0E8', margin: 0 }}>
                            {member.name}
                          </p>
                          <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#6B5B4E', margin: '2px 0 0 0' }}>
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '12px', color: '#6B5B4E', margin: 0 }}>
                      No team members yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Account info */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '16px', fontWeight: 700, color: '#F5F0E8', margin: '0 0 16px 0' }}>
                Account
              </h3>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#6B5B4E', margin: '0 0 4px 0' }}>
                    Plan
                  </p>
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 500, color: '#F5F0E8', margin: 0 }}>
                    {org.subscription_status === 'trial' ? 'Free Trial' : 'Pro'}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '11px', color: '#6B5B4E', margin: '0 0 4px 0' }}>
                    Status
                  </p>
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', fontWeight: 500, color: org.subscription_status === 'trial' ? '#D97706' : '#10B981', margin: 0 }}>
                    {org.subscription_status === 'trial' ? 'Trial' : 'Active'}
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
