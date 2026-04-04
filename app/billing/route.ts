import { NextResponse } from 'next/server'

export async function GET() {
  // Redirect to Stripe payment link for Staff Communications upgrade ($29/month)
  return NextResponse.redirect('https://buy.stripe.com/8x2bJ0gRX6F7gj54Yx9k406')
}
