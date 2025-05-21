import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('next-auth.session-token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!)
    return NextResponse.json({ session: decoded })
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
