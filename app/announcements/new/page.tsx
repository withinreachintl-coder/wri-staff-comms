'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function NewAnnouncementPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Get current user and org
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Not authenticated')
        router.push('/login')
        return
      }

      // Get user's org
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', user.id)
        .single()

      if (userError || !userData) {
        setError('Could not find your organization')
        return
      }

      // Validate inputs
      if (!title.trim()) {
        setError('Title is required')
        setLoading(false)
        return
      }
      if (!body.trim()) {
        setError('Announcement body is required')
        setLoading(false)
        return
      }

      // Insert announcement
      const { error: insertError } = await supabase
        .from('announcements')
        .insert({
          title: title.trim(),
          body: body.trim(),
          author_id: user.id,
          org_id: userData.org_id,
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        setError('Failed to create announcement: ' + insertError.message)
        return
      }

      // Success - redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/dashboard">
          <span style={{ fontSize: '14px', color: '#D97706', textDecoration: 'none', cursor: 'pointer' }}>
            ← Back to Dashboard
          </span>
        </Link>
        <h1 style={{
          fontFamily: 'var(--font-playfair), "Playfair Display", serif',
          fontSize: '32px',
          fontWeight: 600,
          color: '#1C1917',
          margin: '24px 0 0 0',
        }}>
          Create Announcement
        </h1>
      </div>

      {/* Form Card */}
      <div style={{
        maxWidth: '800px',
        margin: '32px auto',
        background: '#FFFFFF',
        border: '1px solid #E5E0D8',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: '32px',
      }}>
        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#DC2626',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1C1917',
              marginBottom: '8px',
            }}>
              Announcement Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New shift schedule posted"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                border: '1px solid #E5E0D8',
                borderRadius: '6px',
                background: '#FAFAF9',
                color: '#1C1917',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#D97706'
                e.currentTarget.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E0D8'
              }}
            />
          </div>

          {/* Body Textarea */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1C1917',
              marginBottom: '8px',
            }}>
              Announcement Body *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your announcement details here..."
              disabled={loading}
              rows={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                border: '1px solid #E5E0D8',
                borderRadius: '6px',
                background: '#FAFAF9',
                color: '#1C1917',
                boxSizing: 'border-box',
                resize: 'vertical',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#D97706'
                e.currentTarget.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E0D8'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#6B5B4E',
                  background: '#F5F0E8',
                  border: '1px solid #E5E0D8',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = '#EEE8DE'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F5F0E8'
                }}
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#FFFFFF',
                background: '#D97706',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#B45309'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#D97706'
              }}
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
