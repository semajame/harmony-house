import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { User, UserRole } from '../../../lib/entities/users'
import { Customer } from '../../../lib/entities/customer'
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
    const customerRepo = queryRunner.manager.getRepository(Customer)

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

    // Check for existing user
    let existingUser = await userRepo.findOne({
      where: { email: email }
    })

    if (existingUser) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    let existingCustomer = await customerRepo.findOne({
      where: { email: email }
    })

    if (existingCustomer) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Customer with that email already exists' },
        { status: 409 }
      )
    }

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
      email,
      password: hashedPassword,
      phone,
      role: UserRole.COSTUMER, 
    })

    await userRepo.save(newUser)

    const newCustomer = customerRepo.create({
      name,
      email,
      phone,
    })

    await customerRepo.save(newCustomer)

    await queryRunner.commitTransaction()

    const { password: _, isActive: __, ...userWithoutPassword } = newUser
    const { id: customerId, isActive, ...customerWithoutMeta } = newCustomer

    return NextResponse.json({
      message: 'User and customer profile created successfully',
      user: userWithoutPassword,
      customer: customerWithoutMeta
    }, { status: 201 })

  } catch (err) {
    await queryRunner.rollbackTransaction()
    console.error('[USER_REGISTRATION_ERROR]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  } finally {
    await queryRunner.release()
  }
}