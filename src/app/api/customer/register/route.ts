import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { User, UserRole } from '../../../lib/entities/users'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck
  
  const db = await getDatabaseConnection()
  const queryRunner = db.createQueryRunner()
  
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    const body = await req.json()
    const { username, email, password, phone, name } = body

    if (!username || !password || !email || !name) {
      return NextResponse.json(
        { error: 'Username, password, email, and name are required' },
        { status: 400 }
      )
    }

    const userRepo = queryRunner.manager.getRepository(User)

    // Check for blocked user
    let blockedUser = await userRepo.findOne({
      where: { email: email, isActive: false }
    })
    
    if (blockedUser) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'User is already existed and is blocked, please contact the respective admins for support' },
        { status: 409 }
      )
    }

    // Check for existing user by email
    let existingUser = await userRepo.findOne({
      where: { email: email }
    })

    if (existingUser) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'User with that email already exists' },
        { status: 409 }
      )
    }

    // Check for existing username
    let existingUsername = await userRepo.findOne({
      where: { username: username }
    })

    if (existingUsername) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = userRepo.create({
      username,
      name,
      email,
      password: hashedPassword,
      phone,
      role: UserRole.CUSTOMER, 
    })

    await userRepo.save(newUser)
    await queryRunner.commitTransaction()

    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    }, { status: 201 })

  } catch (err) {
    await queryRunner.rollbackTransaction()
    console.error('[USER_REGISTRATION_ERROR]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  } finally {
    await queryRunner.release()
  }
}