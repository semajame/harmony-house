import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Review } from '@/app/lib/entities/review'
import { User } from '@/app/lib/entities/users'

export async function GET(req: NextRequest) {
  const db = await getDatabaseConnection()
  const reviewRepo = db.getRepository(Review)
  const reviews = await reviewRepo.find({ relations: ['user'] })

  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, room, name, email, rating, message } = body

    if (!userId || !room || !name || !email || !rating || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const reviewRepo = db.getRepository(Review)
    const userRepo = db.getRepository(User)

    const user = await userRepo.findOne({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const newReview = reviewRepo.create({
      room,
      name,
      email,
      rating,
      message,
      user,
    })

    await reviewRepo.save(newReview)
    return NextResponse.json(newReview, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, room, name, email, rating, message } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const reviewRepo = db.getRepository(Review)

    const review = await reviewRepo.findOne({ where: { id } })
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    review.room = room ?? review.room
    review.name = name ?? review.name
    review.email = email ?? review.email
    review.rating = rating ?? review.rating
    review.message = message ?? review.message

    await reviewRepo.save(review)
    return NextResponse.json(review)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const reviewRepo = db.getRepository(Review)

    const result = await reviewRepo.delete(id)
    if (result.affected === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  // Optional: for future status toggle, currently unused
  return NextResponse.json(
    { message: 'PATCH not implemented' },
    { status: 501 }
  )
}
