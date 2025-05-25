import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Reservation } from '../../../lib/entities/reservation'
import { Room } from '../../../lib/entities/rooms'
import { Customer } from '../../../lib/entities/customer'
import { Payment } from '../../../lib/entities/payment'
import { Between, LessThan, MoreThan } from 'typeorm'


export async function GET(req: NextRequest) {
  const db = await getDatabaseConnection()
  const reservationRepo = db.getRepository(Reservation)
  const reservations = await reservationRepo.find({
    relations: ['room', 'customer', 'payment'],
  })
  return NextResponse.json(reservations)
}

export async function PUT(req: NextRequest) {
  const db = await getDatabaseConnection()
  const body = await req.json()
  const { id, startTime, endTime, roomId, customerId } = body

  const reservationRepo = db.getRepository(Reservation)
  const roomRepo = db.getRepository(Room)
  const customerRepo = db.getRepository(Customer)
  const reservation = await reservationRepo.findOne({
    where: { id },
    relations: ['room', 'customer'],
  })

  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }

  if (startTime) reservation.startTime = new Date(startTime)
  if (endTime) reservation.endTime = new Date(endTime)

  if (roomId && roomId !== reservation.room.id) {
    const newRoom = await roomRepo.findOne({ where: { id: roomId } })
    if (!newRoom) return NextResponse.json({ error: 'New room not found' }, { status: 404 })
    reservation.room = newRoom
  }

  let newCustomer = reservation.customer
  if (customerId && customerId !== reservation.customer.id) {
    const newCustomer = await customerRepo.findOne({ where: { id: customerId } })
    if (!newCustomer) return NextResponse.json({ error: 'New customer not found' }, { status: 404 })
    reservation.customer = newCustomer
  }

  await reservationRepo.save(reservation)

  return NextResponse.json(reservation)
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startTime, endTime, roomId, customerId, paymentId } = body;

    if (!startTime || !endTime || !roomId || !customerId || !paymentId) {
      return NextResponse.json(
        { error: 'All fields (startTime, endTime, roomId, customerId, paymentId) are required' },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (end <= start) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    const db = await getDatabaseConnection();
    const reservationRepo = db.getRepository(Reservation);
    const roomRepo = db.getRepository(Room);
    const customerRepo = db.getRepository(Customer);
    const paymentRepo = db.getRepository(Payment);

    const room = await roomRepo.findOne({ where: { id: roomId, isAvailable: true } });
    const customer = await customerRepo.findOne({ where: { id: customerId, isActive: true } });
    const payment = await paymentRepo.findOne({ where: { id: paymentId } });

    if (!room || !customer || !payment) {
      return NextResponse.json(
        { error: 'Invalid room, customer, or payment' },
        { status: 404 }
      );
    }

    const existingPayment = await reservationRepo.findOne({
      where: { payment: { id: paymentId } },
      relations: ['payment'],
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment is already associated with a reservation' },
        { status: 409 }
      );
    }

    const overlapping = await reservationRepo.findOne({
      where: {
        room: { id: roomId },
        isActive: true,
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
      relations: ['room'],
    });

    if (overlapping) {
      return NextResponse.json(
        { error: 'Room is already reserved in the selected time range' },
        { status: 409 }
      );
    }

    const duplicateInactive = await reservationRepo.findOne({
      where: {
        startTime: start,
        endTime: end,
        room: { id: roomId },
        customer: { id: customerId },
        payment: { id: paymentId },
        isActive: false,
      },
      relations: ['room', 'customer', 'payment'],
    });

    if (duplicateInactive) {
      duplicateInactive.isActive = true;
      await reservationRepo.save(duplicateInactive);
      return NextResponse.json({ message: 'Reactivated existing reservation', reservation: duplicateInactive }, { status: 200 });
    }

    const reservation = reservationRepo.create({
      startTime: start,
      endTime: end,
      room,
      customer,
      payment,
    });

    await reservationRepo.save(reservation);

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    console.error('[RESERVATION_POST_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Reservation ID required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const reservationRepo = db.getRepository(Reservation)

    const reservation = await reservationRepo.findOne({ where: { id }, relations: ['room', 'customer'] })
    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    reservation.isActive = !reservation.isActive
    await reservationRepo.save(reservation)

    return NextResponse.json({ message: `Reservation ${reservation.isActive ? 'activated' : 'deactivated'}` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
