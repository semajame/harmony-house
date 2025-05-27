import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { User, UserRole } from '../../../lib/entities/users'
import bcrypt from 'bcryptjs'


export async function POST(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck
  try {
    const body = await req.json()
    const { username, email, password, phone } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const userRepo = db.getRepository(User)


    let blockedUser = await userRepo.findOne({
    where: {email: email, isActive: false}
    })
    if (blockedUser) {
        return NextResponse.json(
          { error: 'User is already existed and is blocked, plase contact the respective admins for support' },
          { status: 409 }
        )
    }
    let existingUser = await userRepo.findOne({
    where: {email: email}
    })
    const hashedPassword = await bcrypt.hash(password, 10)
    if (existingUser) {
        return NextResponse.json(
          { error: 'User already existed' },
          { status: 409 }
        )
    }

    const newUser = userRepo.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role : UserRole.COSTUMER,
    })

    await userRepo.save(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
