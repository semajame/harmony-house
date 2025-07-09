import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Review } from '@/app/lib/entities/review'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const roomName = searchParams.get('room')

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const reviewRepo = db.getRepository(Review)

    const reviews = await reviewRepo.find({
      where: { room: roomName },
      relations: ['user'],
    })

    return NextResponse.json(reviews)
  } catch (err) {
    console.error('Failed to fetch reviews by room name:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
