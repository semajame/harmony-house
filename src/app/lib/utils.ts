import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from './data-source'
import { Staff } from '../lib/entities/staff'
import { getToken } from 'next-auth/jwt'

export async function getUserRepository() {
  const db = await getDatabaseConnection()
  return db.getRepository(Staff)
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

