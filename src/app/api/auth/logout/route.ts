import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  // Clear the session token by setting an expired cookie
  const response = NextResponse.json({ message: 'Logout successful' })

  response.headers.set(
    'Set-Cookie',
    serialize('next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(0), // Expire immediately
    })
  )

  return response
}
