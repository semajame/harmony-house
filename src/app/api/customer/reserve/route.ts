import { getDatabaseConnection } from "@/app/lib/data-source";
import { Customer } from "@/app/lib/entities/customer";
import { Payment } from "@/app/lib/entities/payment";
import { Reservation, Status } from "@/app/lib/entities/reservation";
import { Room } from "@/app/lib/entities/rooms";
import { NextRequest, NextResponse } from "next/server";
import { LessThan, MoreThan, Not } from "typeorm";
import { DateTime } from 'luxon';
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

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    console.error('[RESERVATION_POST_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
