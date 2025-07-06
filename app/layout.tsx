import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Unpaid Internship Login Page',
  description: 'A simple login page for ZephyraTech Solutions',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
