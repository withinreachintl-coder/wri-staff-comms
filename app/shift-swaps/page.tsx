'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

type User = {
  id: string
  name: string
  role: 'admin' | 'manager' | 'staff'
}

type ShiftSwap = {
  id: string
  requester_id: string
  claimer_id: string | null
  approver_id: string | null
  shift_date: string
  shift_time: string
  notes: string | null
  status: 'open' | 'claimed' | 'approved' | 'rejected' | 'canceled'
  created_at: string
  approved_at: string | null
}

type ShiftSwapWithDetails = ShiftSwap & {
  requester_name?: string
  claimer_name?: string
  approver_name?: string
}

export default function ShiftSwapsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [shifts, setShifts] = useState<ShiftSwapWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  
  // Form states
  const [showNewForm, setShowNewForm] = useState(false)
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadShiftSwaps()
  }, [])

  const loadShiftSwaps = async () => {
    try {
      setLoading(true)
      setError('')

      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push('/login')
        return
      }

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, role')
        .eq('id', authUser.id)
        .single()

      if (userError || !userData) {
        setError('Failed to load user profile')
        return
      }

      setUser(userData)

      // Get org_id
      const { data: userOrgData } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', authUser.id)
        .single()

      if (!userOrgData?.org_id) {
        setError('Failed to load organization')
        return
      }

      // Get team members for display
      const { data: teamData } = await supabase
        .from('users')
        .select('id, name, role')
        .eq('org_id', userOrgData.org_id)
        .order('name', { ascending: true })

      if (teamData) {
        setTeamMembers(teamData)
      }

      // Get shift swaps with user details
      const { data: shiftsData, error: shiftsError } = await supabase
        .from('shift_swaps')
        .select('*')
        .eq('org_id', userOrgData.org_id)
        .order('shift_date', { ascending: true })
        .order('shift_time', { ascending: true })

      if (shiftsError) {
        setError('Failed to load shift swaps')
        return
      }

      if (shiftsData && teamData) {
        // Enrich shifts with user names
        const enrichedShifts = shiftsData.map((shift: ShiftSwap) => ({
          ...shift,
          requester_name: teamData.find((m: User) => m.id === shift.requester_id)?.name || 'Unknown',
          claimer_name: shift.claimer_id ? teamData.find((m: User) => m.id === shift.claimer_id)?.name : null,
          approver_name: shift.approver_id ? teamData.find((m: User) => m.id === shift.approver_id)?.name : null,
        }))

        setShifts(enrichedShifts)
      }
    } catch (err) {
      console.error('Shift swaps error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShiftSwap = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formDate || !formTime) return

    setSubmitting(true)
    try {
      // Get org_id
      const { data: userOrgData } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', user.id)
        .single()

      if (!userOrgData?.org_id) {
        setError('Failed to create shift swap')
        return
      }

      const { error: insertError } = await supabase
        .from('shift_swaps')
        .insert([{
          org_id: userOrgData.org_id,
          requester_id: user.id,
          shift_date: formDate,
          shift_time: formTime,
          notes: formNotes || null,
          status: 'open',
        }])

      if (insertError) {
        setError('Failed to create shift swap: ' + insertError.message)
        return
      }

      // Reset form and reload
      setFormDate('')
      setFormTime('')
      setFormNotes('')
      setShowNewForm(false)
      await loadShiftSwaps()
    } catch (err) {
      console.error('Create shift swap error:', err)
      setError('An error occurred while creating the shift swap')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClaimShift = async (shiftId: string) => {
    if (!user) return

    try {
      const { error: updateError } = await supabase
        .from('shift_swaps')
        .update({
          claimer_id: user.id,
          status: 'claimed',
        })
        .eq('id', shiftId)

      if (updateError) {
        setError('Failed to claim shift: ' + updateError.message)
        return
      }

      await loadShiftSwaps()
    } catch (err) {
      console.error('Claim shift error:', err)
      setError('An error occurred while claiming the shift')
    }
  }

  const handleApproveShift = async (shiftId: string) => {
    if (!user) return

    try {
      const { error: updateError } = await supabase
        .from('shift_swaps')
        .update({
          approver_id: user.id,
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', shiftId)

      if (updateError) {
        setError('Failed to approve shift: ' + updateError.message)
        return
      }

      await loadShiftSwaps()
    } catch (err) {
      console.error('Approve shift error:', err)
      setError('An error occurred while approving the shift')
    }
  }

  const handleRejectShift = async (shiftId: string) => {
    if (!user) return

    try {
      const { error: updateError } = await supabase
        .from('shift_swaps')
        .update({
          status: 'rejected',
        })
        .eq('id', shiftId)

      if (updateError) {
        setError('Failed to reject shift: ' + updateError.message)
        return
      }

      await loadShiftSwaps()
    } catch (err) {
      console.error('Reject shift error:', err)
      setError('An error occurred while rejecting the shift')
    }
  }

  const handleCancelShift = async (shiftId: string) => {
    if (!user) return

    try {
      const { error: updateError } = await supabase
        .from('shift_swaps')
        .update({
          status: 'canceled',
        })
        .eq('id', shiftId)

      if (updateError) {
        setError('Failed to cancel shift: ' + updateError.message)
        return
      }

      await loadShiftSwaps()
    } catch (err) {
      console.error('Cancel shift error:', err)
      setError('An error occurred while canceling the shift')
    }
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

  if (!user) {
    return (
      <main style={{ background: '#1C1917', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#A89880', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif' }}>
          Not authenticated
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
            <h1 style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>
              Shift Swaps
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link
              href="/dashboard"
              style={{
                fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#78716C',
                textDecoration: 'none',
              }}
              className="hover:opacity-80 transition-opacity"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.2)', padding: '16px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '14px', color: '#EF4444', margin: 0 }}>
              {error}
            </p>
            <button
              onClick={() => setError('')}
              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* New shift swap button */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            style={{
              fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1C1917',
              background: '#D97706',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 24px',
              cursor: 'pointer',
            }}
            className="hover:opacity-90 transition-opacity"
          >
            {showNewForm ? '✕ Cancel' : '+ Request Shift Swap'}
          </button>
        </div>

        {/* New shift swap form */}
        {showNewForm && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
            <form onSubmit={handleCreateShiftSwap}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#A89880', marginBottom: '8px' }}>
                    Shift date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                      fontSize: '14px',
                      color: '#F5F0E8',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      padding: '10px 12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#A89880', marginBottom: '8px' }}>
                    Shift time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 10:00 AM - 6:00 PM"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                      fontSize: '14px',
                      color: '#F5F0E8',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      padding: '10px 12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#A89880', marginBottom: '8px' }}>
                  Notes (optional)
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Why you need this shift swapped..."
                  rows={3}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                    fontSize: '14px',
                    color: '#F5F0E8',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1C1917',
                  background: submitting ? '#6B5B4E' : '#D97706',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '12px 24px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
                className="hover:opacity-90 transition-opacity"
              >
                {submitting ? 'Creating...' : 'Create shift swap'}
              </button>
            </form>
          </div>
        )}

        {/* Shift swaps list */}
        {shifts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {shifts.map((shift) => (
              <div
                key={shift.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '15px', fontWeight: 600, color: '#F5F0E8', margin: 0 }}>
                      {new Date(shift.shift_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {shift.shift_time}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', color: '#A89880', margin: '4px 0 0 0' }}>
                      Requested by <strong>{shift.requester_name}</strong>
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: shift.status === 'open' ? '#D97706' : shift.status === 'claimed' ? '#3B82F6' : shift.status === 'approved' ? '#10B981' : '#6B5B4E',
                      background: shift.status === 'open' ? 'rgba(217,119,6,0.15)' : shift.status === 'claimed' ? 'rgba(59,130,246,0.15)' : shift.status === 'approved' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {shift.status}
                  </span>
                </div>

                {shift.notes && (
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', color: '#A89880', margin: '12px 0', lineHeight: 1.6 }}>
                    <strong>Notes:</strong> {shift.notes}
                  </p>
                )}

                {shift.status === 'claimed' && shift.claimer_name && (
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', color: '#A89880', margin: '12px 0 0 0' }}>
                    <strong>Claimed by:</strong> {shift.claimer_name}
                  </p>
                )}

                {shift.status === 'approved' && shift.approver_name && (
                  <p style={{ fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif', fontSize: '13px', color: '#10B981', margin: '12px 0 0 0' }}>
                    <strong>Approved by:</strong> {shift.approver_name}
                  </p>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                  {/* Staff: claim if open */}
                  {shift.status === 'open' && shift.requester_id !== user.id && (
                    <button
                      onClick={() => handleClaimShift(shift.id)}
                      style={{
                        fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#1C1917',
                        background: '#D97706',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                      }}
                      className="hover:opacity-90 transition-opacity"
                    >
                      Claim shift
                    </button>
                  )}

                  {/* Manager: approve if claimed */}
                  {shift.status === 'claimed' && (user.role === 'manager' || user.role === 'admin') && (
                    <>
                      <button
                        onClick={() => handleApproveShift(shift.id)}
                        style={{
                          fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#1C1917',
                          background: '#10B981',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                        }}
                        className="hover:opacity-90 transition-opacity"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectShift(shift.id)}
                        style={{
                          fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#EF4444',
                          background: 'transparent',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '4px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                        }}
                        className="hover:opacity-80 transition-opacity"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* Requester: cancel if open or claimed */}
                  {(shift.status === 'open' || shift.status === 'claimed') && shift.requester_id === user.id && (
                    <button
                      onClick={() => handleCancelShift(shift.id)}
                      style={{
                        fontFamily: 'var(--font-dmsans), "DM Sans", sans-serif',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#6B5B4E',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                      }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      Cancel
                    </button>
                  )}
                </div>
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
              No shift swaps yet. Request one to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
