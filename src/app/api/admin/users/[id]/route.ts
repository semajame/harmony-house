import { NextRequest, NextResponse } from "next/server"
import { getDatabaseConnection } from "../../../../lib/data-source"
import { User } from "../../../../lib/entities/users"
import bcrypt from "bcryptjs"

// GET /api/users/[id]
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDatabaseConnection()
  const userRepo = db.getRepository(User)

  const user = await userRepo.findOne({ where: { id: parseInt(params.id) } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
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
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const {
    username,
    name,
    email,
    phone,
    role,
    isActive,
    currentPassword,
    newPassword,
  } = body

  // update profile fields
  user.username = username ?? user.username
  user.name = name ?? user.name
  user.email = email ?? user.email
  user.phone = phone ?? user.phone

  // ⚠️ only allow admin to change role or isActive
  // if (session?.role === "admin") {
  user.role = role ?? user.role
  user.isActive = isActive ?? user.isActive
  // }

  // password update logic
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password required" },
        { status: 400 }
      )
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid current password" },
        { status: 400 }
      )
    }

    user.password = await bcrypt.hash(newPassword, 10)
  }

  await userRepo.save(user)

  // remove password from response
  const { password, ...userWithoutPassword } = user
  return NextResponse.json(userWithoutPassword)
}

// DELETE /api/users/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(params.id)

  if (!userId || isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
  }

  try {
    const db = await getDatabaseConnection()
    const userRepo = db.getRepository(User)

    const user = await userRepo.findOne({ where: { id: userId } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await userRepo.remove(user)

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete User Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
