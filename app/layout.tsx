import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'iOS Experience Generator',
  description: 'Generate creative iOS app experiences by connecting inputs and outputs',
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




