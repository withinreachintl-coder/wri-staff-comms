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

      // Upsert org and user records (non-blocking)
      try {
        // Upsert org
        const { data: org } = await supabase
          .from('organizations')
          .upsert(
            { name: 'My Restaurant', owner_email: user.email },
            { onConflict: 'owner_email', ignoreDuplicates: true }
          )
          .select('id')
          .single()

        const orgId = org?.id

        if (orgId) {
          // Upsert user
          await supabase
            .from('users')
            .upsert(
              { id: user.id, org_id: orgId, name: user.email, email: user.email, role: 'admin' },
              { onConflict: 'id', ignoreDuplicates: true }
            )
        }
      } catch (e) {
        // Log but do not block login
        console.error('Org setup error (non-fatal):', e)
      }

      // Always redirect to dashboard regardless
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      console.error('Unexpected auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=unexpected', request.url))
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}
