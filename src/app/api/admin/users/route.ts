import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Staff, StaffRole } from '../../../lib/entities/staff'

export async function GET(req: NextRequest) {
  const db = await getDatabaseConnection()
  const staffRepo = db.getRepository(Staff)
  const users = await staffRepo.find({ where: { isActive: true } })

  const usersWithoutPassword = users.map(({ password, ...user }) => user)
  return NextResponse.json(usersWithoutPassword)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const db = await getDatabaseConnection()
    const staffRepo = db.getRepository(Staff)

    const { username, email, password, phone, role } = body
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const newUser = staffRepo.create({
      username,
      email,
      password,
      phone,
      role,
    })

    await staffRepo.save(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, username, email, password, phone, role, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const staffRepo = db.getRepository(Staff)

    const user = await staffRepo.findOne({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    user.username = username ?? user.username
    user.email = email ?? user.email
    user.phone = phone ?? user.phone
    user.role = role ?? user.role
    user.isActive = isActive ?? user.isActive
    if (password) user.password = password

    await staffRepo.save(user)

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const staffRepo = db.getRepository(Staff)

    const user = await staffRepo.findOne({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    user.isActive = false
    await staffRepo.save(user)

    return NextResponse.json({ message: 'User deactivated' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
