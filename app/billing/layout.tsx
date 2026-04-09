import { OrgProvider } from '../../lib/OrgContext'

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OrgProvider>{children}</OrgProvider>
}
