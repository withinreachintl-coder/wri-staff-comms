import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
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
      
      // Exchange code for session - this sets the auth cookie
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Auth exchange error:', exchangeError)
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
      }

      // Verify session was set
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Failed to get user after exchange:', userError)
        return NextResponse.redirect(new URL('/login?error=no_session', request.url))
      }

      // Check if user exists in database
      const { data: userData, error: selectError } = await supabase
        .from('users')
        .select('org_id, role')
        .eq('id', user.id)
        .single()

      const needsUserCreation = selectError?.code === 'PGRST116' || !userData?.org_id

      if (needsUserCreation) {
        // Create organization
        const { data: newOrg, error: orgCreateError } = await supabase
          .from('organizations')
          .insert([{
            name: user.email?.split('@')[0] || 'My Restaurant',
            owner_email: user.email || '',
          }])
          .select('id')
          .single()

        if (orgCreateError || !newOrg) {
          console.error('Failed to create organization:', orgCreateError)
          return NextResponse.redirect(new URL('/login?error=org_creation_failed', request.url))
        }

        // Create user with org_id
        const { error: userCreateError } = await supabase
          .from('users')
          .upsert([{
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'Manager',
            org_id: newOrg.id,
            role: 'manager',
          }], {
            onConflict: 'id'
          })

        if (userCreateError) {
          console.error('Failed to create user:', userCreateError)
          return NextResponse.redirect(new URL('/login?error=user_creation_failed', request.url))
        }
      }

      // All auth succeeded - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      console.error('Unexpected auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=unexpected', request.url))
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}
