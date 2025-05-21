import { NextRequest, NextResponse } from 'next/server'
import { getUserRepository, getSession } from '@/app/lib/utils' // Import from utils.ts

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userRepository = await getUserRepository()
    const users = await userRepository.find()
    return NextResponse.json(users, { status: 200 })
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
        { message: 'Username is required' },
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

export async function PUT(req: NextRequest) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, username, email } = await req.json()
    if (!id || !username || !email) {
      return NextResponse.json(
        { message: 'ID, username, and email are required' },
        { status: 400 }
      )
    }

    const userRepository = await getUserRepository()
    let user = await userRepository.findOne({ where: { id } })

    if (!user) {
      user = userRepository.create({ id, username })
    } else {
      user.username = username
    }

    await userRepository.save(user)

    return NextResponse.json(
      { message: 'User created/updated', user },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, username } = await req.json()
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const userRepository = await getUserRepository()
    const user = await userRepository.findOne({ where: { id } })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    user.username = username || user.username
    await userRepository.save(user)

    return NextResponse.json({ message: 'User updated', user }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const userRepository = await getUserRepository()
    const user = await userRepository.findOne({ where: { id } })
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
