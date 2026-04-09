import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const PAYMENT_LINK_PRICE_ID = 'price_1TK7jACf8hgLWfNiS24Y3NiE' // Staff Comms Pro $29/month

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
    
    // Get authenticated user
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

    const orgId = userData.org_id

    // Get organization details
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, owner_email, stripe_customer_id')
      .eq('id', orgId)
      .single()

    if (orgError || !org) {
      console.error('Organization details not found:', { orgId })
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Create Stripe Checkout Session with client_reference_id = org_id
    const session = await stripe.checkout.sessions.create({
      customer: org.stripe_customer_id || undefined, // Use existing customer if available
      client_reference_id: orgId, // CRITICAL: Pass org_id for webhook lookup
      line_items: [
        {
          price: PAYMENT_LINK_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://staff.wireach.tools'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://staff.wireach.tools'}/billing?canceled=true`,
      customer_email: org.owner_email,
      metadata: {
        org_id: orgId,
        org_name: org.name,
      },
    })

    console.log('Checkout session created:', {
      sessionId: session.id,
      orgId: orgId,
      clientReferenceId: session.client_reference_id,
    })

    return NextResponse.json(
      {
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
