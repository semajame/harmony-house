'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const router = useRouter()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
    } else {
      setSuccess('Account created! You can now log in.')
      router.push('/') // Redirect to sign-in page
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-80'>
      {error && <p className='text-red-500'>{error}</p>}
      {success && <p className='text-green-500'>{success}</p>}

      <input
        type='text'
        placeholder='Username'
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className='p-2 border rounded'
        required
      />
      <input
        type='password'
        placeholder='Password'
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className='p-2 border rounded'
        required
      />
      <button
        type='submit'
        className='p-2 bg-blue-500 text-white rounded cursor-pointer'
      >
        Register
      </button>
    </form>
  )
}
