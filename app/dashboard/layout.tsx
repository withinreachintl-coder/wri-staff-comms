import { OrgProvider } from '../../lib/OrgContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OrgProvider>{children}</OrgProvider>
}
