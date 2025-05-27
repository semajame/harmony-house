'use client'

import { LoginForm } from '@/components/forms-buttons/login-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { getSession, signIn } from 'next-auth/react'

import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    })

    if (res?.error) {
      alert('Invalid credentials')
    } else {
      const session = await getSession()

      if (session?.user.role === 'customer') {
        alert(
          'Access denied. Customers are not allowed to access the dashboard.'
        )
        return
      }

      alert('Signed in successfully!')
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/images/harmony-house-logo.png'
            alt='Logo Image'
            width={50}
            height={50}
          />
          <span className='text-lg font-semibold font-serif italic'>
            Harmony House
          </span>
        </Link>

        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginForm
              form={form}
              onFormChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
      <div className='relative w-full h-full'>
        <Image
          src='/images/havefun-ktv-data.avif'
          alt='Image'
          className='object-cover'
          fill
        />
      </div>
    </div>
  )
}
