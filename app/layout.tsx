import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

import { Providers } from './providers'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Bad Vibes Forever — Music for the afters',
  description:
    'Discover underground sounds, new artists, and late-night mixes on Bad Vibes Forever.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0c0d0c',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className="dark bg-[#0c0d0c]"
    >
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>

        {process.env.NODE_ENV === 'production' && (
          <Analytics />
        )}
      </body>
    </html>
  )
}