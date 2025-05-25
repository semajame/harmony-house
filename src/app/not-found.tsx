// app/not-found.tsx
'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    document.title = '404 | Page Not Found'
  }, [])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center px-6 bg-white'>
      <h1 className='text-6xl font-bold text-purple-600 mb-4'>404</h1>
      <h2 className='text-2xl font-semibold mb-2'>Page Not Found</h2>
      <p className='text-gray-600 mb-6'>
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href='/'
        className='px-5 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition'
      >
        Go back home
      </Link>
    </div>
  )
}
