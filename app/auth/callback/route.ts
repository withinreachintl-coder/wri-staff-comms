import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const restaurantName = requestUrl.searchParams.get('restaurant')

  console.log('[Auth Callback] Starting auth callback', { 
    code: code ? '***' : 'MISSING',
    url: request.url,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    supabaseKeyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  if (code) {
    try {
      const cookieStore = await cookies()
      
      console.log('[Auth Callback] Creating Supabase server client')
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
      console.log('[Auth Callback] Calling exchangeCodeForSession with code:', code.substring(0, 20) + '...')
      const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)

      console.log('[Auth Callback] Exchange response:', { 
        error: exchangeError?.message || 'none',
        hasSession: !!data?.session,
        user: data?.user?.email || 'no-email'
      })

      if (exchangeError) {
        console.error('[Auth Callback] Auth exchange FAILED:', {
          message: exchangeError.message,
          status: exchangeError.status,
          toString: exchangeError.toString()
        })
        return NextResponse.redirect(new URL(`/login?error=auth_failed&reason=${encodeURIComponent(exchangeError.message)}`, request.url))
      }

      // Verify session was set
      console.log('[Auth Callback] Verifying session with getUser()')
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      console.log('[Auth Callback] getUser() response:', { 
        error: userError?.message || 'none',
        user: user?.email || 'no-user'
      })

      if (userError || !user) {
        console.error('[Auth Callback] Session verification FAILED:', {
          error: userError?.message,
          user: !!user
        })
        return NextResponse.redirect(new URL(`/login?error=no_session&reason=${encodeURIComponent(userError?.message || 'no-user')}`, request.url))
      }

      // Upsert org and user records (non-blocking)
      try {
        // Upsert org with restaurant name from signup form (fallback to email domain if not provided)
        const orgName = restaurantName || user.email?.split('@')[0] || 'My Restaurant'
        
        // Calculate 14-day trial end date
        const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        
        const { data: org } = await supabase
          .from('organizations')
          .upsert(
            {
              name: orgName,
              owner_email: user.email,
              subscription_status: 'trial',
              plan: 'free',
              trial_ends_at: trialEndsAt,
            },
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
      console.log('[Auth Callback] Auth successful, redirecting to /dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error('[Auth Callback] Unexpected error:', {
        message: errorMsg,
        stack: error instanceof Error ? error.stack : 'no-stack'
      })
      return NextResponse.redirect(new URL(`/login?error=unexpected&reason=${encodeURIComponent(errorMsg)}`, request.url))
    }
  }

  // No code provided - redirect to login
  console.log('[Auth Callback] No code provided')
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}
