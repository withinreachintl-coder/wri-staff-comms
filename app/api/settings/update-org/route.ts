import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignored in Server Components
            }
          },
        },
      }
    )

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Not authenticated')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user's organization
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (userDataError || !userData?.org_id) {
      console.error('Organization not found for user:', { userId: user.id })
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { name, billing_email } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      )
    }

    if (billing_email && typeof billing_email !== 'string') {
      return NextResponse.json(
        { error: 'Billing email must be a valid email' },
        { status: 400 }
      )
    }

    // Update organization
    const { data: updatedOrg, error: updateError } = await supabase
      .from('organizations')
      .update({
        name: name.trim(),
        billing_email: billing_email?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userData.org_id)
      .select('id, name, billing_email')
      .single()

    if (updateError) {
      console.error('Failed to update organization:', updateError)
      return NextResponse.json(
        { error: 'Failed to update organization' },
        { status: 500 }
      )
    }

    console.log('Organization updated:', {
      orgId: userData.org_id,
      name: updatedOrg.name,
    })

    return NextResponse.json(
      {
        success: true,
        org: updatedOrg,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
