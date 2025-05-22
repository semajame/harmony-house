'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/logout'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  console.log('Session:', session)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold'>Welcome to Dashboard</h1>
      <p className='mt-2'>
        Hello, {session?.user?.username}
        {session?.user?.name}!
      </p>
      <div className='flex gap-2'>
        {/* <button
          onClick={() => router.push('/crud')}
          className='bg-white text-black cursor-pointer p-2 rounded mt-5 text-sm'
        >
          Go to Users
        </button> */}
        <LogoutButton />
      </div>
    </div>
  )
}
