'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/app/components/BottomNav'

interface User {
  id: string
  email: string
  name: string
  role: string
  org_id: string
}

interface Organization {
  id: string
  name: string
}

interface Announcement {
  id: string
  title: string
  body: string
  created_at: string
  author_id: string
  read_count?: number
  total_staff?: number
}

interface AnnouncementRead {
  user_id: string
  read_at: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [org, setOrg] = useState<Organization | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [orgUsers, setOrgUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null)
  const [readReceipts, setReadReceipts] = useState<Record<string, AnnouncementRead[]>>({})

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push('/auth/login')
        return
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userError || !userData) {
        setError('Failed to load user profile')
        setLoading(false)
        return
      }

      setUser(userData as User)

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', userData.org_id)
        .single()

      if (orgError) {
        setError('Failed to load organization')
        setLoading(false)
        return
      }

      setOrg(orgData as Organization)

      await Promise.all([
        loadAnnouncements(userData.org_id),
        loadOrgUsers(userData.org_id),
      ])

      setLoading(false)
    }

    checkAuthAndLoadData()
  }, [router])

  const loadAnnouncements = async (orgId: string) => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading announcements:', error)
      return
    }

    setAnnouncements(data as Announcement[])
  }

  const loadOrgUsers = async (orgId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('org_id', orgId)

    if (error) {
      console.error('Error loading org users:', error)
      return
    }

    setOrgUsers((data as User[]).filter((u) => u.role !== 'admin' && u.role !== 'manager'))
  }

  const loadReadReceipts = async (announcementId: string) => {
    if (readReceipts[announcementId]) return

    const { data, error } = await supabase
      .from('announcement_reads')
      .select('user_id, read_at')
      .eq('announcement_id', announcementId)

    if (error) {
      console.error('Error loading read receipts:', error)
      return
    }

    setReadReceipts((prev) => ({ ...prev, [announcementId]: data as AnnouncementRead[] }))
  }

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !org) return

    setSubmitting(true)
    setError('')

    const { error: insertError } = await supabase.from('announcements').insert([
      {
        org_id: user.org_id,
        author_id: user.id,
        title: formData.title,
        body: formData.body,
      },
    ])

    if (insertError) {
      setError('Failed to create announcement')
      setSubmitting(false)
      return
    }

    setFormData({ title: '', body: '' })
    setShowForm(false)
    await loadAnnouncements(user.org_id)
    setSubmitting(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1C1917' }}>
        <p style={{ color: '#F5F0E8', fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
      </div>
    )
  }

  if (!user || !org) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1C1917' }}>
        <p style={{ color: '#F5F0E8' }}>Unauthorized access</p>
      </div>
    )
  }

  const isManager = user.role === 'manager' || user.role === 'admin'
  const selectedAnnouncement = announcements.find((a) => a.id === selectedAnnouncementId)
  const selectedReadReceipts = selectedAnnouncementId ? readReceipts[selectedAnnouncementId] || [] : []
  const staffCount = orgUsers.filter((u) => u.role === 'staff').length

  return (
    <main className="min-h-screen pb-16 md:pb-0" style={{ background: '#141210' }}>
      {/* Navigation */}
      <nav
        className="border-b sticky top-0 z-40"
        style={{
          background: '#1C1917',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div
              style={{
                width: '28px',
                height: '28px',
                flexShrink: 0,
                background: 'rgba(217,119,6,0.15)',
                border: '1px solid rgba(217,119,6,0.3)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              ✓
            </div>
            <span
              className="truncate"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '16px',
                fontWeight: 600,
                color: '#F5F0E8',
              }}
            >
              {org.name}
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <span
              className="hidden sm:block"
              style={{
                fontSize: '13px',
                color: '#A89880',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {user.name}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                fontSize: '13px',
                color: '#6B5B4E',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                padding: '8px 0',
                minHeight: '44px',
              }}
              className="hover:opacity-70 transition-opacity"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#F5F0E8',
              marginBottom: '6px',
            }}
            className="md:text-4xl"
          >
            Dashboard
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: '#A89880',
            }}
          >
            {staffCount} team members · {announcements.length} announcements
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '4px',
            }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#FCA5A5' }}>
              {error}
            </p>
          </div>
        )}

        {/* Desktop: 3-col grid. Mobile: single column stacked */}
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {/* Announcements Column */}
          <div className="md:col-span-2">
            {/* Create Announcement Button */}
            {isManager && (
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  width: '100%',
                  marginBottom: '16px',
                  padding: '0 16px',
                  background: '#D97706',
                  color: '#1C1917',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="hover:opacity-90 transition-opacity"
              >
                {showForm ? 'Cancel' : '+ New Announcement'}
              </button>
            )}

            {/* Create Form */}
            {showForm && (
              <form
                onSubmit={handleCreateAnnouncement}
                style={{
                  marginBottom: '16px',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#A89880',
                      marginBottom: '8px',
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Announcement title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '16px',
                      color: '#F5F0E8',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#A89880',
                      marginBottom: '8px',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    placeholder="Write your announcement here..."
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '16px',
                      color: '#F5F0E8',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      minHeight: '100px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !formData.title || !formData.body}
                  style={{
                    padding: '0 24px',
                    minHeight: '48px',
                    background: submitting ? '#6B5B4E' : '#D97706',
                    color: '#1C1917',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  {submitting ? 'Sending...' : 'Send Announcement'}
                </button>
              </form>
            )}

            {/* Announcements List */}
            {announcements.length === 0 ? (
              <div
                style={{
                  padding: '32px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#A89880' }}>
                  No announcements yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {announcements.map((announcement) => {
                  const readCount = readReceipts[announcement.id]?.length || 0
                  const readPercentage = staffCount ? Math.round((readCount / staffCount) * 100) : 0
                  const isSelected = selectedAnnouncementId === announcement.id

                  return (
                    <div key={announcement.id}>
                      <button
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAnnouncementId(null)
                          } else {
                            setSelectedAnnouncementId(announcement.id)
                            loadReadReceipts(announcement.id)
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          minHeight: '56px',
                          background: isSelected ? 'rgba(217,119,6,0.1)' : 'rgba(255,255,255,0.04)',
                          border: isSelected
                            ? '1px solid rgba(217,119,6,0.3)'
                            : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        className="hover:border-amber-600/50 hover:bg-amber-900/5"
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '6px',
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: '15px',
                              fontWeight: 500,
                              color: '#F5F0E8',
                              margin: 0,
                              flex: 1,
                              paddingRight: '12px',
                            }}
                          >
                            {announcement.title}
                          </h3>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#D97706',
                              }}
                            >
                              {readCount}
                            </span>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#6B5B4E' }}>
                              /{staffCount}
                            </span>
                          </div>
                        </div>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '13px',
                            color: '#A89880',
                            margin: '0 0 8px 0',
                            lineHeight: 1.4,
                          }}
                        >
                          {announcement.body.substring(0, 80)}
                          {announcement.body.length > 80 ? '...' : ''}
                        </p>
                        <div
                          style={{
                            width: '100%',
                            height: '3px',
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${readPercentage}%`,
                              background: '#D97706',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                      </button>

                      {/* Mobile: inline read receipts panel below selected announcement */}
                      {isSelected && (
                        <div
                          className="md:hidden mt-2"
                          style={{
                            padding: '16px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px',
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#A89880',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              margin: '0 0 12px 0',
                            }}
                          >
                            Read Receipts
                          </h3>

                          <div style={{ marginBottom: '14px' }}>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#6B5B4E', margin: '0 0 6px 0' }}>
                              Read by {selectedReadReceipts.length} of {staffCount}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div
                                style={{
                                  flex: 1,
                                  height: '5px',
                                  background: 'rgba(255,255,255,0.08)',
                                  borderRadius: '3px',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${staffCount ? Math.round((selectedReadReceipts.length / staffCount) * 100) : 0}%`,
                                    background: '#D97706',
                                  }}
                                />
                              </div>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#F5F0E8', minWidth: '32px' }}>
                                {staffCount ? Math.round((selectedReadReceipts.length / staffCount) * 100) : 0}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {selectedReadReceipts.length === 0 ? (
                              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#6B5B4E' }}>
                                No one has read this yet
                              </p>
                            ) : (
                              selectedReadReceipts.map((receipt) => {
                                const reader = orgUsers.find((u) => u.id === receipt.user_id)
                                if (!reader) return null
                                return (
                                  <div
                                    key={receipt.user_id}
                                    style={{
                                      padding: '8px',
                                      background: 'rgba(217,119,6,0.05)',
                                      border: '1px solid rgba(217,119,6,0.2)',
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                    }}
                                  >
                                    <span style={{ width: '6px', height: '6px', background: '#D97706', borderRadius: '50%', flexShrink: 0 }} />
                                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#F5F0E8', flex: 1 }}>
                                      {reader.name}
                                    </span>
                                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#6B5B4E' }}>
                                      {new Date(receipt.read_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                )
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Desktop-only: Right Column - Read Receipts Detail */}
          <div className="hidden md:block md:col-span-1">
            {selectedAnnouncement ? (
              <div
                style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  position: 'sticky',
                  top: '76px',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#A89880',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 16px 0',
                  }}
                >
                  Read Receipts
                </h3>

                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#6B5B4E', margin: '0 0 6px 0' }}>
                    Read by {selectedReadReceipts.length} of {staffCount}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '6px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${staffCount ? Math.round((selectedReadReceipts.length / staffCount) * 100) : 0}%`,
                          background: '#D97706',
                        }}
                      />
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#F5F0E8', minWidth: '35px' }}>
                      {staffCount ? Math.round((selectedReadReceipts.length / staffCount) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#F5F0E8', margin: '0 0 12px 0' }}>
                    Read by:
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedReadReceipts.length === 0 ? (
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#6B5B4E' }}>
                        No one has read this yet
                      </p>
                    ) : (
                      selectedReadReceipts.map((receipt) => {
                        const reader = orgUsers.find((u) => u.id === receipt.user_id)
                        if (!reader) return null
                        return (
                          <div
                            key={receipt.user_id}
                            style={{
                              padding: '8px',
                              background: 'rgba(217,119,6,0.05)',
                              border: '1px solid rgba(217,119,6,0.2)',
                              borderRadius: '4px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ width: '6px', height: '6px', background: '#D97706', borderRadius: '50%' }} />
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#F5F0E8' }}>
                                {reader.name}
                              </span>
                            </div>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#6B5B4E', margin: 0, paddingLeft: '14px' }}>
                              {new Date(receipt.read_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '32px 20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5B4E' }}>
                  Select an announcement to view read receipts
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
