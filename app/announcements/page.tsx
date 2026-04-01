'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

  // Check auth and load data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push('/auth/login')
        return
      }

      // Get user profile
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

      // Get organization
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

      // Load announcements
      await loadAnnouncements(userData.org_id, authUser.id)

      setLoading(false)
    }

    checkAuthAndLoadData()
  }, [router])

  const loadAnnouncements = async (orgId: string, userId: string) => {
    // Get all announcements
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

    // Get user's read receipts
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

    // Get authors
    if (announcementData.length > 0) {
      const authorIdSet = new Set<string>()
      announcementData.forEach((a: any) => {
        authorIdSet.add(a.author_id)
      })
      const authorIds = Array.from(authorIdSet)
      const { data: authorData, error: authorError } = await supabase
        .from('users')
        .select('id, name')
        .in('id', authorIds)

      if (authorError) {
        console.error('Error loading authors:', authorError)
      } else {
        const authorMap: Record<string, Author> = {}
        authorData.forEach((a) => {
          authorMap[a.id] = a
        })
        setAuthors(authorMap)
      }
    }
  }

  const handleMarkAsRead = async (announcementId: string) => {
    if (readStatus[announcementId] || !user) {
      return
    }

    const { error } = await supabase.from('announcement_reads').insert([
      {
        announcement_id: announcementId,
        user_id: user.id,
      },
    ])

    if (!error) {
      setReadStatus((prev) => ({
        ...prev,
        [announcementId]: true,
      }))
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
    <main className="min-h-screen" style={{ background: '#141210' }}>
      {/* Navigation */}
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
              ✓
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#F5F0E8',
              }}
            >
              {org.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span
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
              }}
              className="hover:opacity-70 transition-opacity"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              fontWeight: 700,
              color: '#F5F0E8',
              marginBottom: '8px',
            }}
          >
            Team Announcements
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: '#A89880',
            }}
          >
            {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                color: '#FCA5A5',
              }}
            >
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
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                color: '#A89880',
              }}
            >
              No announcements yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => {
              const isRead = readStatus[announcement.id]
              const author = authors[announcement.author_id]

              return (
                <button
                  key={announcement.id}
                  onClick={() => {
                    setSelectedAnnouncementId(announcement.id)
                    if (!isRead) {
                      handleMarkAsRead(announcement.id)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '20px',
                    background:
                      selectedAnnouncementId === announcement.id
                        ? 'rgba(217,119,6,0.1)'
                        : isRead
                          ? 'rgba(255,255,255,0.02)'
                          : 'rgba(255,255,255,0.04)',
                    border:
                      selectedAnnouncementId === announcement.id
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
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    {/* Read indicator */}
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: isRead ? '#D97706' : 'rgba(255,255,255,0.3)',
                        marginTop: '6px',
                        flexShrink: 0,
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '15px',
                          fontWeight: 500,
                          color: '#F5F0E8',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {announcement.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '13px',
                          color: '#A89880',
                          margin: '0 0 8px 0',
                          lineHeight: 1.5,
                        }}
                      >
                        {announcement.body}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '12px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: '#6B5B4E',
                          }}
                        >
                          From {author?.name || 'Unknown'}
                        </span>
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: '#6B5B4E',
                          }}
                        >
                          {new Date(announcement.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isRead && (
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              color: '#D97706',
                            }}
                          >
                            ✓ Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
