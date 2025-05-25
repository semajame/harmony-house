import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function requireAdmin(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 })
  }
  
  if (token.role !== 'admin') {
    return NextResponse.json({ 
      error: 'Forbidden - Admin access required' 
    }, { status: 403 })
  }
  
  return null
}