'use client'

import { ReactNode } from 'react'

import {
  Activity,
  BarChart3,
  Home,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react'

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
