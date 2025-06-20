'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'

export default function AuthSection() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null

  const userRole = session?.user?.role
  const showDashboard = userRole === 'staff' || userRole === 'admin'

  return (
    <div className='hidden md:flex gap-2 items-center'>
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center space-x-2.5 focus:outline-none cursor-pointer'>
              <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                <span className='text-white text-sm font-medium'>
                  {session.user.username?.charAt(0).toUpperCase() ?? ''}
                </span>
              </div>
              <span className='hidden md:block text-sm font-medium text-white'>
                {session.user.username}
              </span>
              <ChevronDown className='h-4 w-4 text-white' />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='p-2'>
            {showDashboard && (
              <DropdownMenuItem asChild>
                <Link
                  href='/admin/dashboard'
                  className='flex items-center gap-2 w-full cursor-pointer'
                >
                  <LayoutDashboard className='h-4 w-4' />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}
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
      ) : (
        <>
          <Link href='/login'>
            <Button className='bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 cursor-pointer'>
              Login
            </Button>
          </Link>
          <Link href='/signup'>
            <Button className='bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 cursor-pointer'>
              Register
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}
