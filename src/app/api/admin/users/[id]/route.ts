import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../../lib/data-source'
import { User } from '../../../../lib/entities/users'
import bcrypt from 'bcryptjs'

// GET /api/users/[id]
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDatabaseConnection()
  const userRepo = db.getRepository(User)

  const user = await userRepo.findOne({ where: { id: parseInt(params.id) } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { password, ...userWithoutPassword } = user
  return NextResponse.json(userWithoutPassword)
}

// PUT /api/users/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDatabaseConnection()
  const userRepo = db.getRepository(User)
  const body = await req.json()

  const user = await userRepo.findOne({ where: { id: parseInt(params.id) } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { username, name, email, password, phone, role, isActive } = body

  user.username = username ?? user.username
  user.name = name ?? user.name
  user.email = email ?? user.email
  user.phone = phone ?? user.phone
  user.role = role ?? user.role
  user.isActive = isActive ?? user.isActive

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  await userRepo.save(user)
  const { password: _, ...userWithoutPassword } = user
  return NextResponse.json(userWithoutPassword)
}

// DELETE /api/users/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(params.id)

  if (!userId || isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  try {
    const db = await getDatabaseConnection()
    const userRepo = db.getRepository(User)

    const user = await userRepo.findOne({ where: { id: userId } })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await userRepo.remove(user)

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete User Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
