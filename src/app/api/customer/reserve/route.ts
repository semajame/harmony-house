import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Customer } from '../../../lib/entities/customer'
import { Payment } from '../../../lib/entities/payment'
import { Reservation, Status } from '../../../lib/entities/reservation'
import { Room } from '../../../lib/entities/rooms'
import { LessThan, MoreThan, Not } from 'typeorm'
import { DateTime } from 'luxon'

export async function POST(req: NextRequest) {
  const db = await getDatabaseConnection()
  const queryRunner = db.createQueryRunner()
  
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    const body = await req.json()
    const { 
      // Customer data
      name, 
      email, 
      phone,
      // Payment data
      amount, 
      method,
      // Reservation data
      startTime, 
      endTime, 
      roomId 
    } = body

    // Validate required fields
    if (!name || !email || !amount || !method || !startTime || !endTime || !roomId) {
      return NextResponse.json(
        { error: 'All fields are required: name, email, amount, method, startTime, endTime, roomId' },
        { status: 400 }
      )
    }

    // Date validation
    const manilaZone = 'Asia/Manila'
    const start = DateTime.fromISO(startTime, { zone: manilaZone }).toJSDate()
    const end = DateTime.fromISO(endTime, { zone: manilaZone }).toJSDate()

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    if (end <= start) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
    }

    const customerRepo = queryRunner.manager.getRepository(Customer)
    const paymentRepo = queryRunner.manager.getRepository(Payment)
    const reservationRepo = queryRunner.manager.getRepository(Reservation)
    const roomRepo = queryRunner.manager.getRepository(Room)

    // Check if customer already exists
    let customer = await customerRepo.findOne({
      where: { email: email }
    })

    // Create new customer if doesn't exist
    if (!customer) {
      customer = customerRepo.create({
        name,
        email,
        phone,
      })
      await customerRepo.save(customer)
    }

    // Verify room exists and is available
    const room = await roomRepo.findOne({ 
      where: { id: roomId, isAvailable: true } 
    })

    if (!room) {
      await queryRunner.rollbackTransaction()
      return NextResponse.json(
        { error: 'Room not found or not available' },
        { status: 404 }
      )
    }

    // Check for overlapping reservations
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

    // Create payment
    const payment = paymentRepo.create({ amount, method })
    await paymentRepo.save(payment)

    // Create reservation
    const reservation = reservationRepo.create({
      startTime: start,
      endTime: end,
      room,
      customer,
      payment,
    })
    await reservationRepo.save(reservation)

    // Commit transaction
    await queryRunner.commitTransaction()

    // Return success response with all created data
    return NextResponse.json({
      message: 'Reservation created successfully',
      reservation: {
        id: reservation.id,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: reservation.status,
        room: {
          id: room.id,
          name: room.name,
          // include other room details you want to return
        },
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        payment: {
          id: payment.id,
          amount: payment.amount,
          method: payment.method,
        }
      }
    }, { status: 201 })

  } catch (err) {
    await queryRunner.rollbackTransaction()
    console.error('[COMBINED_RESERVATION_POST_ERROR]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await queryRunner.release()
  }
}