// app/api/admin/reservations/latest/route.ts
import { NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Reservation } from '@/app/lib/entities/reservation'

export async function GET() {
  const db = await getDatabaseConnection()
  const reservationRepo = db.getRepository(Reservation)

  const latest = await reservationRepo.findOne({
    where: { isActive: true },
    order: { createdAt: 'DESC' },
    relations: ['user', 'room', 'payment'],
  })

  if (!latest) {
    return NextResponse.json(null)
  }

  return NextResponse.json(latest)
}
