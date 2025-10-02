// app/api/admin/reservations/history/route.ts
import { NextResponse } from "next/server"
import { getDatabaseConnection } from "@/app/lib/data-source"
import { Reservation } from "@/app/lib/entities/reservation"

export async function GET() {
  const db = await getDatabaseConnection()
  const reservationRepo = db.getRepository(Reservation)

  const reservations = await reservationRepo.find({
    where: { isActive: true },
    order: { createdAt: "DESC" },
    take: 20, // limit to last 20
    relations: ["user", "room", "payment"],
  })

  return NextResponse.json(reservations)
}
