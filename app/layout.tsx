import './globals.css'

export const metadata = {
  title: 'WRI Staff Comms',
  description: 'Staff communication tool for restaurant teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
