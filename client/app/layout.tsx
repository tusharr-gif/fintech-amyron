import './globals.css'

export const metadata = {
  title: 'CreditPulse',
  description: 'MSME Alternative Credit Scoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
