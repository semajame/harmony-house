import { NextRequest, NextResponse } from "next/server"
import { getDatabaseConnection } from "../../../lib/data-source"
import { Room } from "../../../lib/entities/rooms"

// GET all rooms
export async function GET(req: NextRequest) {
  try {
    const db = await getDatabaseConnection()
    const roomRepo = db.getRepository(Room)

    const rooms = await roomRepo.find()

    return NextResponse.json(rooms, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    )
  }
}

// POST create a new room
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, capacity, price, description, image, isAvailable } = body

    if (!name || !price || !capacity) {
      return NextResponse.json(
        { error: "Name, capacity, and price are required" },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const roomRepo = db.getRepository(Room)

    const newRoom = roomRepo.create({
      name,
      capacity,
      price,
      description: description ?? null,
      image: image ?? null,
      isAvailable: isAvailable ?? true,
    })

    await roomRepo.save(newRoom)

    return NextResponse.json(newRoom, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
