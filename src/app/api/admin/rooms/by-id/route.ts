import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../../lib/data-source'
import { Room } from '../../../../lib/entities/rooms'

export async function GET(req: NextRequest) {
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

  return NextResponse.json(room)
}
