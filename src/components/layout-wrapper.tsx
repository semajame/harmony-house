// components/LayoutWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import Header from './header'
import Footer from './footer'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isDashboard =
    pathname.startsWith('/admin/dashboard') ||
    pathname.startsWith('/admin/login')

  return (
    <>
      {!isDashboard && <Header />}
      {children}
      {!isDashboard && <Footer />}
    </>
  )
}
