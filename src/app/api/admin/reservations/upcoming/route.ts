import { NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../../lib/data-source'
import { Reservation } from '../../../../lib/entities/reservation'
import { MoreThan } from 'typeorm'

export async function GET() {
  const db = await getDatabaseConnection()
  const reservationRepo = db.getRepository(Reservation)

  const now = new Date()
  const upcoming = await reservationRepo.find({
    where: { endTime: MoreThan(now), isActive: true },
    relations: ['room', 'customer', 'payment'],
  })

  return NextResponse.json(upcoming)
}
