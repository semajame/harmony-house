import { NextRequest, NextResponse } from 'next/server'
import { AppDataSource, getDatabaseConnection } from '@/app/lib/data-source'
import { User } from '@/app/lib/entities/users'
import { Reservation } from '@/app/lib/entities/reservation'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const reservationRepo = db.getRepository(Reservation)
    
    const reservations = await reservationRepo.find({
      where: { 
        user: { id: parseInt(userId) },
        isActive: true 
      },
      relations: ['user', 'room', 'payment'],
      order: { createdAt: 'DESC' }
    })

    // Remove password from user data
    const sanitizedReservations = reservations.map(reservation => {
      const { password, ...safeUser } = reservation.user
      return {
        ...reservation,
        user: safeUser
      }
    })

    return NextResponse.json(sanitizedReservations)
    
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}