import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Payment } from '../../../lib/entities/payment'
import { Reservation, Status } from '../../../lib/entities/reservation'
import { Room } from '../../../lib/entities/rooms'
import { LessThan, MoreThan, Not } from 'typeorm'
import { DateTime } from 'luxon'
import { User } from '@/app/lib/entities/users'

export async function POST(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck

  const db = await getDatabaseConnection()
  const queryRunner = db.createQueryRunner()

  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    const body = await req.json()
    const {
      startTime,
      endTime,
      roomId,
      userId,
      amount,
      paymentMethod = 'Gcash',
      paymentId,
    } = body

    if (!startTime || !endTime || !roomId || !userId) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'startTime, endTime, roomId, and userId are required' },
        { status: 400 }
      )
    }

    if (!paymentId && !amount) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Either paymentId or amount is required' },
        { status: 400 }
      )
    }

    const manilaZone = 'Asia/Manila'

    const start = DateTime.fromISO(startTime, { zone: manilaZone }).toJSDate()
    const end = DateTime.fromISO(endTime, { zone: manilaZone }).toJSDate()

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    if (end <= start) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    const reservationRepo = queryRunner.manager.getRepository(Reservation)
    const roomRepo = queryRunner.manager.getRepository(Room)
    const userRepo = queryRunner.manager.getRepository(User)
    const paymentRepo = queryRunner.manager.getRepository(Payment)

    const room = await roomRepo.findOne({
      where: { id: roomId, isAvailable: true },
    })
    const user = await userRepo.findOne({
      where: { id: userId, isActive: true },
    })

    if (!room) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Room not found or not available' },
        { status: 404 }
      )
    }

    if (!user) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'User not found or not active' },
        { status: 404 }
      )
    }

    let payment

    if (paymentId) {
      payment = await paymentRepo.findOne({ where: { id: paymentId } })

      if (!payment) {
        await queryRunner.rollbackTransaction()
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        )
      }

      const existingReservation = await reservationRepo.findOne({
        where: { payment: { id: paymentId } },
        relations: ['payment'],
      })

      if (existingReservation) {
        await queryRunner.rollbackTransaction()
        return NextResponse.json(
          { error: 'Payment is already associated with a reservation' },
          { status: 409 }
        )
      }
    } else {
      payment = paymentRepo.create({
        amount,
        method: paymentMethod,
      })

      await paymentRepo.save(payment)
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
    })

    if (overlapping) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Room is already reserved in the selected time range' },
        { status: 409 }
      )
    }

    const reservation = reservationRepo.create({
      startTime: start,
      endTime: end,
      room,
      user,
      payment,
    })

    await reservationRepo.save(reservation)
    await queryRunner.commitTransaction()

    const savedReservation = await reservationRepo.findOne({
      where: { id: reservation.id },
      relations: ['room', 'user', 'payment'],
    })
    if (savedReservation && savedReservation.user !== null) {
      const { password, isActive, ...safeUser } = savedReservation.user
      savedReservation.user = safeUser as any
    }

    return NextResponse.json(
      {
        message: 'Reservation created successfully',
        reservation: savedReservation,
      },
      { status: 201 }
    )
  } catch (err) {
    await queryRunner.rollbackTransaction()
    console.error('[RESERVATION_POST_ERROR]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await queryRunner.release()
  }
}
