import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Users } from '@/app/lib/entities/staff'

export async function getUserRepository() {
  const db = await getDatabaseConnection()
  return db.getRepository(Users)
}

// ✅ Fetch session from api/auth/session folder
export async function getSession(req: NextRequest) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    method: 'GET',
    headers: { cookie: req.headers.get('cookie') || '' },
  })

  if (!res.ok) return null
  return res.json()
}
