import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (!authError) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('org_id, role')
          .eq('id', user.id)
          .single()

        const needsUserCreation = userError?.code === 'PGRST116' || !userData?.org_id

        if (needsUserCreation) {
          const { data: newOrg, error: orgCreateError } = await supabase
            .from('organizations')
            .insert([{
              name: user.email?.split('@')[0] || 'My Restaurant',
              owner_email: user.email || '',
            }])
            .select('id')
            .single()

          if (!orgCreateError && newOrg) {
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

      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
}
