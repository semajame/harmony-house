import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { AppDataSource, getDatabaseConnection } from "@/app/lib/data-source" // your TypeORM datasource
import { User } from "@/app/lib/entities/users" // your User entity

export async function POST(req: Request) {
  const { token, password } = await req.json()

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET!) as {
      email: string
    }

    const db = await getDatabaseConnection()
    const userRepo = db.getRepository(User)

    const user = await userRepo.findOne({ where: { email: decoded.email } })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword

    await userRepo.save(user)

    return NextResponse.json({
      success: true,
      message: "Password updated!",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 400 }
    )
  }
}
