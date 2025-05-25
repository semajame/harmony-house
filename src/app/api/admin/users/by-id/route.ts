import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../../lib/data-source'
import { Staff } from '../../../../lib/entities/staff'
import { requireAdmin } from '@/app/lib/auth-utils'

export async function GET(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck    
  const db = await getDatabaseConnection()
  const staffRepo = db.getRepository(Staff)

  const { searchParams } = new URL(req.url)
  const idString = searchParams.get('id')
  const id = idString ? Number(idString) : NaN

  if (!idString || isNaN(id) || !/^\d+$/.test(idString)) {
  return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  const user = await staffRepo.findOne({ where: { id: Number(id) } })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { password, ...userWithoutPassword } = user

  return NextResponse.json(userWithoutPassword)
}
