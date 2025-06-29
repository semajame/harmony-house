'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Users,
  Bell,
  Menu,
  X,
  ChevronDown,
  CakeSlice,
  NotebookText,
  Calendar,
  LogOut,
} from 'lucide-react'

import DashboardLayout from '@/components/admin/dashboard/dashboard-layout'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type SidebarItem = {
  icon: React.ElementType
  label: string
  link: string
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [latestReservationId, setLatestReservationId] = useState<number | null>(
    null
  )

  // Determine current title from URL path
  const getTitleFromPath = (path: string) => {
    if (path.includes('/admin/dashboard/users')) return 'Users'
    if (path.includes('/admin/dashboard/foods')) return 'Foods'
    if (path.includes('/admin/dashboard/reviews')) return 'Reviews'
    if (path.includes('/admin/dashboard/reservation')) return 'Reservation'
    if (path.includes('/dashboard')) return 'Overview'
    return 'Dashboard'
  }

  // Sidebar navigation items
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

  // Redirect based on authentication and role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (
      status === 'authenticated' &&
      session?.user.role === 'customer'
    ) {
      router.push('/')
    }
  }, [status, session, router])

  // Poll for new reservations every 10 seconds
  useEffect(() => {
    if (session?.user.role !== 'admin' && session?.user.role !== 'staff') return

    const fetchLatestReservation = async () => {
      try {
        const res = await fetch('/api/admin/reservations/latest')
        if (!res.ok) throw new Error('Failed to fetch latest reservation')
        const latest = await res.json()

        if (!latest || latest.id === latestReservationId) return

        setLatestReservationId(latest.id)

        setNotifications((prev) => {
          const alreadyExists = prev.some((n) => n.id === latest.id)
          if (alreadyExists) return prev

          return [
            {
              id: latest.id,
              message: `New reservation by ${
                latest.user?.name || 'Unknown User'
              }`,
              createdAt: latest.createdAt,
              isRead: false, // Add this field for new notifications
            },
            ...prev,
          ]
        })
      } catch (err) {
        console.error('Notification polling failed:', err)
      }
    }

    const interval = setInterval(fetchLatestReservation, 10000)
    return () => clearInterval(interval)
  }, [latestReservationId, session?.user.role])

  // Remove the duplicate useEffect (you have it twice in your code)
  // Keep only the one above

  // Optional: Add this function to get unread count for other parts of your app
  const getUnreadNotificationCount = () => {
    return notifications.filter((notif) => !notif.isRead).length
  }

  // Your existing timeAgo function is perfect, keep it as is
  function timeAgo(timestamp: string) {
    const now = new Date()
    const then = new Date(timestamp)
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return then.toLocaleString()
  }

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
          className='fixed inset-0 bg-black opacity-50 z-40 lg:hidden'
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-150'>
                    <Bell className='h-5 w-5' />
                    {notifications.filter((n) => !n.isRead).length > 0 && (
                      <span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full'>
                        {/* Red dot indicator */}
                        <span className='h-3 w-3 bg-red-500 rounded-full'></span>
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className='w-80 max-h-80 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-lg'>
                  <div className='px-4 py-3 border-b border-gray-100 bg-gray-50'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-sm font-semibold text-gray-900'>
                        Notifications
                      </h3>
                      {notifications.filter((n) => !n.isRead).length > 0 && (
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                          {notifications.filter((n) => !n.isRead).length}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='max-h-64 overflow-y-auto'>
                    {notifications.length > 0 ? (
                      <>
                        {notifications.map((notif, index) => (
                          <DropdownMenuItem
                            key={`${notif.id}-${new Date(
                              notif.createdAt
                            ).getTime()}`}
                            className={`p-0 cursor-pointer focus:bg-blue-50 hover:bg-gray-50 transition-colors duration-150 ${
                              notif.isRead ? 'bg-white' : 'bg-blue-50/30'
                            }`}
                            onClick={() => {
                              // Mark notification as read
                              setNotifications((prev) =>
                                prev.map((n) =>
                                  n.id === notif.id ? { ...n, isRead: true } : n
                                )
                              )
                              router.push('/admin/dashboard/reservation')
                            }}
                          >
                            <div className='flex items-start gap-3 p-4 w-full'>
                              {/* Notification Icon */}
                              <div className='flex-shrink-0 mt-0.5'>
                                <div
                                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                    notif.isRead ? 'bg-gray-300' : 'bg-blue-500'
                                  }`}
                                ></div>
                              </div>

                              {/* Notification Content */}
                              <div className='flex-1 min-w-0'>
                                <p
                                  className={`text-sm leading-5 mb-1 transition-colors duration-200 ${
                                    notif.isRead
                                      ? 'text-gray-600'
                                      : 'text-gray-900 font-medium'
                                  }`}
                                >
                                  {notif.message}
                                </p>
                                <div className='flex items-center gap-2'>
                                  <span className='text-xs text-gray-500'>
                                    {timeAgo(notif.createdAt)}
                                  </span>
                                  {/* Optional: Add notification type badge */}
                                  <span className='inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700'>
                                    Reservation
                                  </span>
                                </div>
                              </div>

                              {/* Action Indicator */}
                              <div className='flex-shrink-0'>
                                <svg
                                  className='w-4 h-4 text-gray-400'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M9 5l7 7-7 7'
                                  />
                                </svg>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className='flex flex-col items-center justify-center py-12 px-4'>
                          {/* Empty State Icon */}
                          <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                            <svg
                              className='w-6 h-6 text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1.5}
                                d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                              />
                            </svg>
                          </div>
                          <p className='text-sm font-medium text-gray-900 mb-1'>
                            No notifications
                          </p>
                          <p className='text-xs text-gray-500 text-center'>
                            When you receive notifications, they'll appear here
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

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
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className='flex items-center gap-2 w-full cursor-pointer'
                    >
                      <LogOut className='h-4 w-4 text-gray-500' />
                      Logout
                    </button>
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
