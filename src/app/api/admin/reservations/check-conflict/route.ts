import { NextRequest, NextResponse } from "next/server"
import { getDatabaseConnection } from "@/app/lib/data-source" // Adjust path
import { DateTime } from "luxon"
import { Reservation, Status } from "@/app/lib/entities/reservation"

export async function POST(req: NextRequest) {
  const db = await getDatabaseConnection()
  const queryRunner = db.createQueryRunner()
  await queryRunner.connect()

  try {
    const { roomId, startTime, endTime } = await req.json()

    console.log("Request Data:", { roomId, startTime, endTime })

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: "startTime and endTime are required" },
        { status: 400 }
      )
    }

    const manilaZone = "Asia/Manila"
    const startDateTime = DateTime.fromISO(startTime, { zone: manilaZone })
    const endDateTime = DateTime.fromISO(endTime, { zone: manilaZone })

    if (!startDateTime.isValid || !endDateTime.isValid) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      )
    }

    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      )
    }

    const start = startDateTime.toJSDate()
    const end = endDateTime.toJSDate()

    const reservationRepo = queryRunner.manager.getRepository(Reservation)

    const conflict = await reservationRepo
      .createQueryBuilder("reservation")
      .leftJoin("reservation.room", "room")
      .where("room.id = :roomId", { roomId })
      .andWhere("reservation.isActive = true")
      .andWhere("reservation.status != :cancelled", {
        cancelled: Status.CANCELLED,
      })
      .andWhere(
        "(reservation.startTime < :endTime AND reservation.endTime > :startTime)",
        { startTime: start, endTime: end }
      )
      .getOne()

    if (conflict) {
      console.log("Conflict Found:", conflict)
      return NextResponse.json(
        {
          conflict: true,
          message:
            "Time conflict: The room is already reserved during the selected time.",
        },
        { status: 409 }
      )
    }

    return NextResponse.json({ conflict: false }, { status: 200 })
  } catch (err) {
    console.error("[CONFLICT_CHECK_ERROR]", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  } finally {
    await queryRunner.release()
  }
}
