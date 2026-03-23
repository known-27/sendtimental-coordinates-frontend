import '../styles/stitch-tokens.css'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Sentimental Coordinates',
  description: 'A geo-locked gift reveal platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-primary bg-bg-primary text-text-primary`}>
        {children}
      </body>
    </html>
  )
}
