import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Room } from '../../../lib/entities/rooms'
import { requireAdmin } from '@/app/lib/auth-utils'

export async function GET(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  const db = await getDatabaseConnection()
  const roomRepo = db.getRepository(Room)

  const rooms = await roomRepo.find()
  return NextResponse.json(rooms)
}

export async function POST(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  try {
    const body = await req.json()
    const { name, capacity, price, isAvailable } = body

    if (!name || !price || !capacity || name == null || capacity == null || price == null) {
      return NextResponse.json(
        { error: 'Name, capacity, and price are required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const roomRepo = db.getRepository(Room)

    const newRoom = roomRepo.create({
      name,
      capacity,
      price,
      isAvailable: isAvailable ?? true,
    })

    await roomRepo.save(newRoom)

    return NextResponse.json(newRoom, { status: 201 })
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
    const { id, name, capacity, price, isAvailable } = body

    if (!id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const roomRepo = db.getRepository(Room)

    const room = await roomRepo.findOne({ where: { id } })
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    room.name = name ?? room.name
    room.capacity = capacity ?? room.capacity
    room.price = price ?? room.price
    room.isAvailable = isAvailable ?? room.isAvailable

    await roomRepo.save(room)
    return NextResponse.json(room)
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
    const { id, action } = body

    if (!id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const roomRepo = db.getRepository(Room)

    const room = await roomRepo.findOne({ where: { id } })
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (action === 'toggle-availability') {
      room.isAvailable = !room.isAvailable
      await roomRepo.save(room)
      return NextResponse.json({ message: 'Room availability toggled', isAvailable: room.isAvailable })
    }


    room.isActive = !room.isActive
    await roomRepo.save(room)

    return NextResponse.json({ 
      message: `Room is now ${room.isActive ? 'active' : 'inactive'}`, 
      isActive: room.isActive
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
