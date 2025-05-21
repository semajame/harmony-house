import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Users } from '@/app/lib/entities/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  // Get DB connection
  const db = await getDatabaseConnection()
  const userRepo = db.getRepository(Users)

  // Find user by email
  const user = await userRepo.findOne({ where: { email } })

  // Validate password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '1h' }
  )

  // Store token in HTTP-only cookie
  const response = NextResponse.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    session: jwt.decode(token), // Include decoded session info
  })

  response.headers.set(
    'Set-Cookie',
    serialize('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  )

  return response
}
