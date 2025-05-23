'use client'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/header'
import Footer from '@/components/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: '400',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: '400',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const hideLayoutOnPaths = ['/login', '/signup'] // Add more routes if needed

  const shouldHideLayout = hideLayoutOnPaths.includes(pathname)

  return (
    <html lang='en'>
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased`}
      >
        <SessionProvider>
          {!shouldHideLayout && <Header />}
          {children}
          {!shouldHideLayout && <Footer />}
        </SessionProvider>
      </body>
    </html>
  )
}
