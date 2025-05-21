'use client'

import { useState } from 'react'

import SignUp from '@/app/components/auth/signup'
import SignIn from '@/app/components/auth/signin'

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4'>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h1>

      {isSignUp ? <SignUp /> : <SignIn />}

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className='mt-4 text-blue-500 hover:underline cursor-pointer'
      >
        {isSignUp
          ? 'Already have an account? Sign In'
          : "Don't have an account? Sign Up"}
      </button>
    </div>
  )
}
