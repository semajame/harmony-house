import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Staff } from '@/app/lib/entities/staff'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
//login for postman(because this will set cookies on postman, normal login wont)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password } = body

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const db = await getDatabaseConnection()
  const userRepo = db.getRepository(Staff)
  const user = await userRepo.findOne({ where: { username } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '1h' }
  )

  const response = NextResponse.json({ success: true })

  // Match NextAuth's default cookie name for JWT strategy
  const cookieName = process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'

  response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60, // 1 hour
    sameSite: 'lax',
  })

  return response
}