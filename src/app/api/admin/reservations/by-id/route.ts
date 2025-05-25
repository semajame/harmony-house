import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../../lib/data-source'
import { Reservation } from '../../../../lib/entities/reservation'
import { requireAdmin } from '@/app/lib/auth-utils'

export async function GET(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck
    
  const db = await getDatabaseConnection()
  const reservationRepo = db.getRepository(Reservation)

  const { searchParams } = new URL(req.url)
  const idString = searchParams.get('id')
  const id = idString ? Number(idString) : NaN

  if (!idString || isNaN(id) || !/^\d+$/.test(idString)) {
    return NextResponse.json({ error: 'Invalid reservation ID' }, { status: 400 })
  }
  if (!id) {
    return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 })
  }

  const reservation = await reservationRepo.findOne({ where: { id: Number(id) } })

  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }

  return NextResponse.json(reservation)
}
