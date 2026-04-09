import { createServerClient } from '@supabase/ssr'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Verify webhook signature
    let event: any
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any

      // Get org_id from client_reference_id
      const orgId = session.client_reference_id

      console.log('Checkout session completed:', {
        sessionId: session.id,
        orgId: orgId,
        customerId: session.customer,
        subscriptionId: session.subscription,
        customerEmail: session.customer_email,
      })

      if (!orgId) {
        console.error('No client_reference_id (org_id) in session', { sessionId: session.id })
        return NextResponse.json({ error: 'Missing org_id in session' }, { status: 400 })
      }

      // Initialize Supabase server client
      const cookieStore = await (await import('next/headers')).cookies()
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

      // Find organization by ID (bulletproof - ignores checkout email variations)
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', orgId)
        .single()

      if (orgError || !org) {
        console.error('Organization not found for ID:', {
          orgId: orgId,
          error: orgError,
        })
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
      }

      // Update organization with Stripe info and Pro plan
      const stripeCustomerId = String(session.customer) || ''
      const stripeSubscriptionId = String(session.subscription) || ''
      const billingEmail = session.customer_email || session.customer_details?.email || ''

      console.log('Updating organization:', {
        orgId: org.id,
        stripeCustomerId,
        stripeSubscriptionId,
        billingEmail,
      })

      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          plan: 'pro',
          subscription_status: 'active',
          billing_email: billingEmail,
          updated_at: new Date().toISOString(),
        })
        .eq('id', org.id)

      if (updateError) {
        console.error('Failed to update organization:', updateError)
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        )
      }

      console.log('Organization updated successfully:', {
        orgId: org.id,
        plan: 'pro',
        subscriptionStatus: 'active',
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Subscription activated',
          orgId: org.id,
        },
        { status: 200 }
      )
    }

    // Handle subscription update events (future: handle plan changes, cancellations, etc.)
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as any
      console.log('Subscription updated:', {
        subscriptionId: subscription.id,
        status: subscription.status,
      })
      // TODO: Update org subscription_status based on subscription.status
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any
      console.log('Subscription deleted:', {
        subscriptionId: subscription.id,
      })
      // TODO: Update org plan to 'free' and subscription_status to 'canceled'
    }

    // Acknowledge receipt of event (even if we don't handle it)
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
