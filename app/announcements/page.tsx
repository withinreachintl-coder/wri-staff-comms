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
}

interface Author {
  id: string
  name: string
}

interface ReadStatus {
  [announcementId: string]: boolean
}

export default function AnnouncementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [org, setOrg] = useState<Organization | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [authors, setAuthors] = useState<Record<string, Author>>({})
  const [readStatus, setReadStatus] = useState<ReadStatus>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null)
  // Mobile: show expanded view inline
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
      await loadAnnouncements(userData.org_id, authUser.id)
      setLoading(false)
    }

    checkAuthAndLoadData()
  }, [router])

  const loadAnnouncements = async (orgId: string, userId: string) => {
    const { data: announcementData, error: announcementError } = await supabase
      .from('announcements')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (announcementError) {
      console.error('Error loading announcements:', announcementError)
      return
    }

    setAnnouncements(announcementData as Announcement[])

    const { data: readData, error: readError } = await supabase
      .from('announcement_reads')
      .select('announcement_id')
      .eq('user_id', userId)

    if (readError) {
      console.error('Error loading read receipts:', readError)
    } else {
      const readMap: ReadStatus = {}
      readData.forEach((r: any) => {
        readMap[r.announcement_id] = true
      })
      setReadStatus(readMap)
    }

    if (announcementData.length > 0) {
      const authorIds = Array.from(new Set(announcementData.map((a: any) => a.author_id)))
      const { data: authorData, error: authorError } = await supabase
        .from('users')
        .select('id, name')
        .in('id', authorIds)

      if (authorError) {
        console.error('Error loading authors:', authorError)
      } else {
        const authorMap: Record<string, Author> = {}
        authorData.forEach((a: Author) => {
          authorMap[a.id] = a
        })
        setAuthors(authorMap)
      }
    }
  }

  const handleMarkAsRead = async (announcementId: string) => {
    if (readStatus[announcementId] || !user) return

    const { error } = await supabase.from('announcement_reads').insert([
      { announcement_id: announcementId, user_id: user.id },
    ])

    if (!error) {
      setReadStatus((prev) => ({ ...prev, [announcementId]: true }))
    }
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
              style={{ fontSize: '13px', color: '#A89880', fontFamily: "'DM Sans', sans-serif" }}
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

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            className="md:text-4xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#F5F0E8',
              marginBottom: '6px',
            }}
          >
            Team Announcements
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#A89880' }}>
            {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
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

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
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
              const isRead = readStatus[announcement.id]
              const author = authors[announcement.author_id]
              const isExpanded = expandedId === announcement.id

              return (
                <div key={announcement.id}>
                  <button
                    onClick={() => {
                      setSelectedAnnouncementId(announcement.id)
                      setExpandedId(isExpanded ? null : announcement.id)
                      if (!isRead) {
                        handleMarkAsRead(announcement.id)
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      minHeight: '64px',
                      background: isExpanded
                        ? 'rgba(217,119,6,0.1)'
                        : isRead
                          ? 'rgba(255,255,255,0.02)'
                          : 'rgba(255,255,255,0.04)',
                      border: isExpanded
                        ? '1px solid rgba(217,119,6,0.3)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: isExpanded ? '8px 8px 0 0' : '8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:border-amber-600/50"
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      {/* Read indicator dot */}
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: isRead ? '#D97706' : 'rgba(255,255,255,0.25)',
                          marginTop: '4px',
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                          <h3
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: '15px',
                              fontWeight: 500,
                              color: '#F5F0E8',
                              margin: 0,
                              flex: 1,
                            }}
                          >
                            {announcement.title}
                          </h3>
                          {isRead && (
                            <span
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '11px',
                                color: '#D97706',
                                flexShrink: 0,
                              }}
                            >
                              ✓ Read
                            </span>
                          )}
                        </div>

                        {!isExpanded && (
                          <p
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: '13px',
                              color: '#A89880',
                              margin: '0 0 6px 0',
                              lineHeight: 1.4,
                            }}
                          >
                            {announcement.body.substring(0, 100)}
                            {announcement.body.length > 100 ? '...' : ''}
                          </p>
                        )}

                        <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B5B4E' }}>
                            {author?.name || 'Unknown'}
                          </span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B5B4E' }}>
                            {new Date(announcement.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Expand/collapse chevron */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          color: '#6B5B4E',
                          flexShrink: 0,
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s',
                          marginTop: '2px',
                        }}
                      >
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '16px',
                        background: 'rgba(217,119,6,0.05)',
                        border: '1px solid rgba(217,119,6,0.2)',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '15px',
                          color: '#F5F0E8',
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {announcement.body}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
