import { NextRequest, NextResponse } from 'next/server'
import { getUserRepository, getSession } from '@/app/lib/utils' // Import from utils.ts

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userRepository = await getUserRepository()
    const user = await userRepository.findOne({ where: { id: params.id } })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { username } = await req.json()
    if (!username) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      )
    }

    const userRepository = await getUserRepository()
    const newUser = userRepository.create({ username })
    await userRepository.save(newUser)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updatedFields = await req.json()
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      return NextResponse.json(
        { message: 'At least one field is required for update' },
        { status: 400 }
      )
    }

    const userRepository = await getUserRepository()
    let user = await userRepository.findOne({ where: { id: params.id } })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Prevent updating the ID
    delete updatedFields.id

    // Apply updates dynamically
    Object.assign(user, updatedFields)

    await userRepository.save(user)

    return NextResponse.json({ message: 'User updated', user }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userRepository = await getUserRepository()
    const user = await userRepository.findOne({ where: { id: params.id } })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    await userRepository.remove(user)
    return NextResponse.json({ message: 'User deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
