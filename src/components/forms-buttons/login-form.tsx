'use client'

import { signIn } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface LoginFormProps extends React.ComponentProps<'form'> {
  form: {
    username: string
    password: string
  }
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function LoginForm({
  className,
  form,
  onFormChange,
  ...props
}: LoginFormProps) {
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Login to your account</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          Enter your username below to login to your account
        </p>
      </div>
      <div className='grid gap-6'>
        <div className='grid gap-3'>
          <Label htmlFor='username'>Username</Label>
          <Input
            id='username'
            name='username'
            type='text'
            placeholder='m@example.com'
            required
            value={form.username}
            onChange={onFormChange}
          />
        </div>
        <div className='grid gap-3'>
          <div className='flex items-center'>
            <Label htmlFor='password'>Password</Label>
          </div>
          <Input
            id='password'
            name='password'
            type='password'
            required
            value={form.password}
            onChange={onFormChange}
          />
        </div>
        <Button type='submit' className='w-full cursor-pointer'>
          Login
        </Button>
      </div>

      <div className='text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/signup' className='underline underline-offset-4'>
          Sign up
        </Link>
      </div>
    </form>
  )
}
