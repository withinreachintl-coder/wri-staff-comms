import { NextResponse } from 'next/server'

export async function GET() {
  // Redirect to Stripe payment link for Staff Comms upgrade
  return NextResponse.redirect('https://buy.stripe.com/28E5kC8lr0gJaYLcqZ9k403')
}
