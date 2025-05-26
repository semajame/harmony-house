import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../../lib/data-source'
import { Room } from '../../../../lib/entities/rooms'
import { requireAdmin } from '@/app/lib/auth-utils'

export async function GET(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  const db = await getDatabaseConnection()
  const roomRepo = db.getRepository(Room)

  const { searchParams } = new URL(req.url)
  const idString = searchParams.get('id')
  const id = idString ? Number(idString) : NaN

  if (!idString || isNaN(id) || !/^\d+$/.test(idString)) {
    return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 })
  }
  if (!id) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
  }

  const room = await roomRepo.findOne({ where: { id: Number(id) } })

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }

  const { isActive, ...roomWithoutIsActive } = room

  return NextResponse.json(roomWithoutIsActive)
}
