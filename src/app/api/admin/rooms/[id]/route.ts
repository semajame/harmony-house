import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Room } from '@/app/lib/entities/rooms'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 })
  }

  const db = await getDatabaseConnection()
  const roomRepo = db.getRepository(Room)

  const room = await roomRepo.findOne({ where: { id } })

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }

  return NextResponse.json(room)
}
