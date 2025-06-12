'use client'

import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Main Content */}
      <main className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
        {children}
      </main>
    </>
  )
}
