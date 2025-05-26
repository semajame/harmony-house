import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Reservation, Status } from '../../../lib/entities/reservation'
import { Room } from '../../../lib/entities/rooms'
import { Customer } from '../../../lib/entities/customer'
import { Payment } from '../../../lib/entities/payment'
import { Between, LessThan, MoreThan, Not } from 'typeorm'
import { requireAdmin } from '@/app/lib/auth-utils'
import { DateTime } from 'luxon'

function omit<T extends Record<string, any>>(obj: T, keys: string[]): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export async function GET(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  const db = await getDatabaseConnection()
  const reservationRepo = db.getRepository(Reservation)
  const reservations = await reservationRepo.find({
    where: {
      isActive: true
    },
    relations: ['room', 'customer', 'payment'],
  })
  const sanitized = reservations.map((reservation) => {
    const {
      isActive,
      room: { isActive: roomIsActive, ...roomWithoutIsActive } = {},
      customer: { isActive: customerIsActive, ...customerWithoutIsActive } = {},
      payment: paymentData,
      ...rest
    } = reservation;

    // Optionally sanitize payment (if it also has `isActive`)

    return {
      ...rest,
      room: roomWithoutIsActive,
      customer: customerWithoutIsActive,
      payment : paymentData
    };
  });


  return NextResponse.json(sanitized)
}

export async function PUT(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck

  const db = await getDatabaseConnection()
  const body = await req.json()
  const { id, startTime, endTime, roomId, customerId } = body

  const reservationRepo = db.getRepository(Reservation)
  const roomRepo = db.getRepository(Room)
  const customerRepo = db.getRepository(Customer)
  const reservation = await reservationRepo.findOne({
    where: { id },
    relations: ['room', 'customer', 'payment'],
  })

  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }

  const manilaZone = 'Asia/Manila';

  if (startTime) reservation.startTime = DateTime.fromISO(startTime, { zone: manilaZone }).toJSDate();
  if (endTime) reservation.endTime = DateTime.fromISO(endTime, { zone: manilaZone }).toJSDate();

  if (roomId && roomId !== reservation.room.id) {
    const newRoom = await roomRepo.findOne({ where: { id: roomId } })
    if (!newRoom) return NextResponse.json({ error: 'New room not found' }, { status: 404 })
    else if(newRoom && !newRoom.isAvailable){
      return NextResponse.json(
        { error: 'room is currently not available, please try other rooms' },
        { status: 404 }
      );
    }
    
    reservation.room = newRoom
  }




  let newCustomer = reservation.customer
  if (customerId && customerId !== reservation.customer.id) {
    const newCustomer = await customerRepo.findOne({ where: { id: customerId } })
    if (!newCustomer) return NextResponse.json({ error: 'New customer not found' }, { status: 404 })
    reservation.customer = newCustomer
  }

  await reservationRepo.save(reservation)

  const { isActive, room, customer, payment, ...rest } = reservation;
  
  const sanitizedReservation = {
    ...rest,
    room: room ? (() => {
      const { isActive: _, ...roomData } = room;
      return roomData;
    })() : null,
    customer: customer ? (() => {
      const { isActive: _, ...customerData } = customer;
      return customerData;
    })() : null,
    payment
  };

  return NextResponse.json(sanitizedReservation);
}


export async function POST(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  try {
    const body = await req.json();
    const { startTime, endTime, roomId, customerId, paymentId } = body;

    if (!startTime || !endTime || !roomId || !customerId || !paymentId) {
      return NextResponse.json(
        { error: 'All fields (startTime, endTime, roomId, customerId, paymentId) are required' },
        { status: 400 }
      );
    }

    const manilaZone = 'Asia/Manila';

    const start = DateTime.fromISO(startTime, { zone: manilaZone }).toJSDate();
    const end = DateTime.fromISO(endTime, { zone: manilaZone }).toJSDate();

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
        status: Not(Status.CANCELLED),
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

    const reservation = reservationRepo.create({
      startTime: start,
      endTime: end,
      room,
      customer,
      payment,
    });

    await reservationRepo.save(reservation);

  const { isActive, room : _room, customer :_customer, payment :_payment, ...rest } = reservation;

  const sanitizedReservation = {
    ...rest,
    room: room ? omit(room, ['isActive']) : null,
    customer: customer ? omit(customer, ['isActive']) : null,
    payment, 
  };

    return NextResponse.json(sanitizedReservation, { status: 201 });

  } catch (err) {
    console.error('[RESERVATION_POST_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  try {
    const body = await req.json()
    const { id, action, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Reservation ID required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const reservationRepo = db.getRepository(Reservation)

    const reservation = await reservationRepo.findOne({ 
      where: { id }, 
      relations: ['room', 'customer', 'payment'] 
    })
    
    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    if (action === 'set-status') {
      if (!status || !Object.values(Status).includes(status)) {
        return NextResponse.json({ 
          error: 'Invalid status. Must be one of: pending, confirmed, cancelled' 
        }, { status: 400 })
      }

      reservation.status = status
      await reservationRepo.save(reservation)
      
      const { isActive, room, customer, payment, ...rest } = reservation;

      const sanitizedReservation = {
        ...rest,
        room: room ? (() => {
          const { isActive: _, ...roomData } = room;
          return roomData;
        })() : null,
        customer: customer ? (() => {
          const { isActive: _, ...customerData } = customer;
          return customerData;
        })() : null,
        payment
      };

      return NextResponse.json({ 
        message: `Reservation status set to ${reservation.status}`,
        reservation: sanitizedReservation 
      })
    } 
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}