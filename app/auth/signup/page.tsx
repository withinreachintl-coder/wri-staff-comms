import { redirect } from 'next/navigation'

export default function SignupPage() {
  // Signup uses the same magic link flow as login
  redirect('/auth/login')
}
