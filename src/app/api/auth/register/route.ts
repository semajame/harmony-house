import { NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { User } from '../../../lib/entities/users'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    const db = await getDatabaseConnection()
    const userRepo = db.getRepository(User)

    //^ Check if the username already exists
    const existingUser = await userRepo.findOne({ where: { username } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already in use' },
        { status: 400 }
      )
    }

    //^ Hash the password to keep it secure
    const hashedPassword = await bcrypt.hash(password, 10)

    //^ Create a new user
    const newUser = userRepo.create({ username, password: hashedPassword })
    await userRepo.save(newUser)

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
