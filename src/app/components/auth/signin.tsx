'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  LockIcon,
  LoaderIcon,
} from 'lucide-react'

export default function SignIn() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        username: form.username,
        password: form.password,
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid username or password')
      } else {
        router.push('/dashboard') // Redirect to dashboard
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Or{' '}
            <a
              href='#'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              create a new account
            </a>
          </p>
        </div>

        {error && (
          <div className='p-4 text-sm text-red-700 bg-red-100 rounded-md'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700'
              >
                Username
              </label>
              <div className='relative mt-1'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <UserIcon className='w-5 h-5 text-gray-400' />
                </div>
                <input
                  id='username'
                  type='text'
                  placeholder='Enter your username'
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <div className='relative mt-1'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <LockIcon className='w-5 h-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className='block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  required
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 flex items-center pr-3'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className='w-5 h-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <EyeIcon className='w-5 h-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
              <div className='flex justify-end mt-1'>
                <a
                  href='#'
                  className='text-sm text-blue-600 hover:text-blue-500'
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70'
            >
              {loading ? (
                <span className='flex items-center'>
                  <LoaderIcon className='w-5 h-5 mr-2 animate-spin' />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className='flex items-center justify-center'>
            <div className='text-sm'>
              <a
                href='#'
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                Sign in with Google instead
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
