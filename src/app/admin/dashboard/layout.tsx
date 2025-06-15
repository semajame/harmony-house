'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  Home,
  Users,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  CakeSlice,
  NotebookText,
  Calendar,
} from 'lucide-react'

import DashboardLayout from '@/components/admin/dashboard/dashboard-layout'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LogoutButton from '@/components/forms-buttons/logout-button'

import { getServerSession } from 'next-auth'

type SidebarItem = {
  icon: React.ElementType
  label: string
  link: string
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getTitleFromPath = (path: string) => {
    if (path.includes('/admin/dashboard/users')) {
      return 'Users'
    } else if (path.includes('/admin/dashboard/foods')) {
      return 'Foods'
    } else if (path.includes('/admin/dashboard/reviews')) {
      return 'Reviews'
    } else if (path.includes('/admin/dashboard/reservation')) {
      return 'Reservation'
    } else if (path.includes('/dashboard')) {
      return 'Overview'
    }

    return 'Dashboard'
  }

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Dashboard', link: '/admin/dashboard' },
    session?.user.role === 'admin' && {
      icon: Users,
      label: 'Users',
      link: '/admin/dashboard/users',
    },
    {
      icon: Calendar,
      label: 'Reservation',
      link: '/admin/dashboard/reservation',
    },
    { icon: CakeSlice, label: 'Foods', link: '/admin/dashboard/foods' },
    { icon: NotebookText, label: 'Reviews', link: '/admin/dashboard/reviews' },
  ].filter(Boolean) as SidebarItem[]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (
      status === 'authenticated' &&
      session?.user.role === 'customer'
    ) {
      router.push('/') // or redirect to a "not authorized" page
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Session:', session)
    }
  }, [session, status])

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className='flex items-center justify-between h-16 px-6 border-b border-gray-200'>
          <h1 className='text-xl font-bold text-gray-800'>Dashboard</h1>
          <button onClick={() => setSidebarOpen(false)} className='lg:hidden'>
            <X className='h-6 w-6' />
          </button>
        </div>

        <nav className='mt-6'>
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors ${
                pathname === item.link
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : ''
              }`}
            >
              <item.icon className='h-5 w-5 mr-3' />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='flex items-center justify-between h-16 px-6'>
            <div className='flex items-center'>
              <button
                onClick={() => setSidebarOpen(true)}
                className='lg:hidden mr-4'
              >
                <Menu className='h-6 w-6' />
              </button>
              <h2 className='text-xl font-semibold text-gray-800'>
                {getTitleFromPath(pathname)}
              </h2>
            </div>

            <div className='flex items-center space-x-4'>
              <button className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg'>
                <Bell className='h-5 w-5' />
                <span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full'></span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='flex items-center space-x-3 focus:outline-none cursor-pointer'>
                    <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-medium'>
                        {session?.user.username?.charAt(0).toUpperCase() ?? ''}
                      </span>
                    </div>
                    <span className='hidden md:block text-sm font-medium text-gray-700'>
                      {session?.user.username}
                    </span>
                    <ChevronDown className='h-4 w-4 text-gray-500' />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <DashboardLayout>{children}</DashboardLayout>
      </div>
    </div>
  )
}
