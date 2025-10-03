import { NextRequest, NextResponse } from "next/server"
import { getDatabaseConnection } from "@/app/lib/data-source"
import { Room } from "@/app/lib/entities/rooms"

// GET a single room by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabaseConnection()
    const roomRepo = db.getRepository(Room)

    const room = await roomRepo.findOne({
      where: { id: Number(params.id), isActive: true },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// UPDATE a room
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await req.json()
    const { name, capacity, price, description, image, isAvailable, isActive } =
      body

    const db = await getDatabaseConnection()
    const roomRepo = db.getRepository(Room)

    const room = await roomRepo.findOneBy({ id })
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    room.name = name ?? room.name
    room.capacity = capacity ?? room.capacity
    room.price = price ?? room.price
    room.description = description ?? room.description
    room.image = image ?? room.image
    room.isAvailable = isAvailable ?? room.isAvailable
    room.isActive = isActive ?? room.isActive

    await roomRepo.save(room)

    return NextResponse.json(room)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// DELETE a room
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params
  const roomId = parseInt(id, 10)

  if (isNaN(roomId)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 })
  }

  try {
    const db = await getDatabaseConnection()
    const roomRepo = db.getRepository(Room)

    const room = await roomRepo.findOne({ where: { id: roomId } })
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    await roomRepo.remove(room)

    return NextResponse.json({ message: `Room ${roomId} deleted successfully` })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    )
  }
}
