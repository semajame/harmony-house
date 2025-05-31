import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Reservation, Status } from '../../../lib/entities/reservation'
import { Room } from '../../../lib/entities/rooms'
import { Payment } from '../../../lib/entities/payment'
import { Between, LessThan, MoreThan, Not } from 'typeorm'
import { requireAdmin } from '@/app/lib/auth-utils'
import { DateTime } from 'luxon'
import { User } from '@/app/lib/entities/users'


export async function GET(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  const db = await getDatabaseConnection()
  const reservationRepo = db.getRepository(Reservation)
  const reservations = await reservationRepo.find({
    relations: ['room', 'user', 'payment'],
  })
  return NextResponse.json(reservations)
}

export async function PUT(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck

  const db = await getDatabaseConnection()
  const body = await req.json()
  const { id, startTime, endTime, roomId, userId, paymentId } = body

  const reservationRepo = db.getRepository(Reservation)
  const roomRepo = db.getRepository(Room)
  const userRepo = db.getRepository(User)
  const paymentRepo = db.getRepository(Payment)
  const reservation = await reservationRepo.findOne({
    where: { id },
    relations: ['room', 'user', 'payment'],
  })

  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }
  const manilaZone = 'Asia/Manila';

  if (startTime) reservation.startTime = DateTime.fromISO(startTime, { zone: manilaZone }).toJSDate();
  if (endTime) reservation.endTime = DateTime.fromISO(endTime, { zone: manilaZone }).toJSDate();

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

  if (paymentId && paymentId !== reservation.payment.id) {
    const newPayment = await paymentRepo.findOne({ where: { id: paymentId } })
    if (!newPayment) return NextResponse.json({ error: 'New payment not found' }, { status: 404 })
    reservation.payment = newPayment
  }

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

  if (userId && userId !== reservation.user.id) {
    const newUser = await userRepo.findOne({ where: { id: userId, isActive: true } })
    if (!newUser) return NextResponse.json({ error: 'New user not found' }, { status: 404 })
    reservation.user = newUser
  }

  await reservationRepo.save(reservation)

  return NextResponse.json(reservation)
}


export async function POST(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  
  const db = await getDatabaseConnection()
  const queryRunner = db.createQueryRunner()
  
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    const body = await req.json();
    const { 
      startTime, 
      endTime, 
      roomId, 
      userId, 
      amount,
      paymentMethod = 'cash', 
      paymentId 
    } = body;

    if (!startTime || !endTime || !roomId || !userId) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'startTime, endTime, roomId, and userId are required' },
        { status: 400 }
      );
    }

    if (!paymentId && !amount) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Either paymentId or amount is required' },
        { status: 400 }
      );
    }

    const manilaZone = 'Asia/Manila';

    const start = DateTime.fromISO(startTime, { zone: manilaZone }).toJSDate();
    const end = DateTime.fromISO(endTime, { zone: manilaZone }).toJSDate();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (end <= start) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    const reservationRepo = queryRunner.manager.getRepository(Reservation);
    const roomRepo = queryRunner.manager.getRepository(Room);
    const userRepo = queryRunner.manager.getRepository(User)
    const paymentRepo = queryRunner.manager.getRepository(Payment);

    const room = await roomRepo.findOne({ where: { id: roomId, isAvailable: true } });
    const user = await userRepo.findOne({ where: { id: userId, isActive: true } });

    if (!room) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json({ error: 'Room not found or not available' }, { status: 404 });
    }

    if (!user) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json({ error: 'User not found or not active' }, { status: 404 });
    }

    let payment;
    
    if (paymentId) {
      payment = await paymentRepo.findOne({ where: { id: paymentId } });
      
      if (!payment) {
        await queryRunner.rollbackTransaction()
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      }

      const existingReservation = await reservationRepo.findOne({
        where: { payment: { id: paymentId } },
        relations: ['payment'],
      });

      if (existingReservation) {
        await queryRunner.rollbackTransaction()
        return NextResponse.json(
          { error: 'Payment is already associated with a reservation' },
          { status: 409 }
        );
      }
    } else {
      payment = paymentRepo.create({
        amount,
        method: paymentMethod
      });

      await paymentRepo.save(payment);
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
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Room is already reserved in the selected time range' },
        { status: 409 }
      );
    }

    const reservation = reservationRepo.create({
      startTime: start,
      endTime: end,
      room,
      user,
      payment,
    });

    await reservationRepo.save(reservation);
    await queryRunner.commitTransaction();

    const savedReservation = await reservationRepo.findOne({
      where: { id: reservation.id },
      relations: ['room', 'user', 'payment']
    });

    return NextResponse.json({
      message: 'Reservation created successfully',
      reservation: savedReservation
    }, { status: 201 });

  } catch (err) {
    await queryRunner.rollbackTransaction()
    console.error('[RESERVATION_POST_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await queryRunner.release()
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
      relations: ['room', 'user'] 
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
      
      return NextResponse.json({ 
        message: `Reservation status set to ${reservation.status}`,
        reservation 
      })
    } 
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}