'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import { LoginForm } from '@/components/login-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import Image from 'next/image'

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
      alert('Signed in successfully!')
      router.push('/dashboard')
    }
  }

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
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
