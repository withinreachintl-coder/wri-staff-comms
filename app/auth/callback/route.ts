import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
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
    
    await supabase.auth.exchangeCodeForSession(code)

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('org_id, role')
        .eq('id', user.id)
        .single()

      const needsUserCreation = userError?.code === 'PGRST116' || !userData?.org_id

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

        if (!orgCreateError && newOrg) {
          // Create user with org_id
          await supabase
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
        }
      }
    }
  }

  // Always redirect to dashboard after auth
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
