import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { User, UserRole } from '../../../lib/entities/users'
import bcrypt from 'bcryptjs'
import { requireAdmin } from '@/app/lib/auth-utils'
import { Customer } from '@/app/lib/entities/customer'

export async function GET(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck
  const db = await getDatabaseConnection()
  const userRepo = db.getRepository(User)
  const users = await userRepo.find()

  const usersWithoutPassword = users.map(({ password, ...user }) => user)
  return NextResponse.json(usersWithoutPassword)
}

export async function POST(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck
  try {
    const body = await req.json()
    const { username, email, password, phone, role } = body

    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Username, email and password are required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const userRepo = db.getRepository(User)
    const customerRepo = db.getRepository(Customer)

    if (!role || role === UserRole.CUSTOMER) {
      let customerCheck = await customerRepo.findOne({
        where: { email: email },
      })
      if (customerCheck) {
        if (!customerCheck.isActive) {
          return NextResponse.json(
            {
              error: 'Customer with that email is not active, please activate',
            },
            { status: 409 }
          )
        }
      } else if (!customerCheck) {
        return NextResponse.json(
          { error: 'Customer with that email doesnt exist' },
          { status: 404 }
        )
      }
    }
    let existingUser = await userRepo.findOne({
      where: [{ username }, email ? { email } : undefined].filter(
        Boolean
      ) as any[],
    })
    const hashedPassword = await bcrypt.hash(password, 10)
    if (existingUser) {
      if (!existingUser.isActive) {
        existingUser.isActive = true
        existingUser.password = hashedPassword
        existingUser.email = email ?? existingUser.email
        existingUser.phone = phone ?? existingUser.phone
        existingUser.role = role ?? existingUser.role

        await userRepo.save(existingUser)

        const { password: _, ...userWithoutPassword } = existingUser
        return NextResponse.json(userWithoutPassword, { status: 200 })
      } else {
        return NextResponse.json(
          { error: 'User with that username or email already exists' },
          { status: 409 }
        )
      }
    }

    const newUser = userRepo.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role,
    })

    await userRepo.save(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck
  try {
    const body = await req.json()
    const { id, username, email, password, phone, role, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const userRepo = db.getRepository(User)

    const user = await userRepo.findOne({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    user.username = username ?? user.username
    user.email = email ?? user.email
    user.phone = phone ?? user.phone
    user.role = role ?? user.role
    user.isActive = isActive ?? user.isActive
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }

    await userRepo.save(user)

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const userRepo = db.getRepository(User)

    const user = await userRepo.findOne({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    user.isActive = !user.isActive
    await userRepo.save(user)

    return NextResponse.json({
      message: `User is now ${user.isActive ? 'active' : 'inactive'}`,
      isActive: user.isActive,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
