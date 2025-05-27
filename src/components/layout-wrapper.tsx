// components/LayoutWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import Header from './home/header'
import Footer from './home/footer'
import { useSession } from 'next-auth/react'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isDashboard =
    pathname.startsWith('/admin/dashboard') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')

  return (
    <>
      {!isDashboard && <Header />}
      {children}
      {!isDashboard && <Footer />}
    </>
  )
}
