import { NextRequest, NextResponse } from "next/server"
import { getDatabaseConnection } from "@/app/lib/data-source"
import { Discount } from "@/app/lib/entities/discount"

// GET /api/discounts/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid discount ID" }, { status: 400 })
  }

  const db = await getDatabaseConnection()
  const discountRepo = db.getRepository(Discount)

  const discount = await discountRepo.findOne({ where: { id } })

  if (!discount) {
    return NextResponse.json({ error: "Discount not found" }, { status: 404 })
  }

  return NextResponse.json(discount)
}

// PUT /api/discounts/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid discount ID" }, { status: 400 })
  }

  const db = await getDatabaseConnection()
  const discountRepo = db.getRepository(Discount)
  const existing = await discountRepo.findOne({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Discount not found" }, { status: 404 })
  }

  const { code, discount, isActive, usageLimit, expiresAt } = await req.json()

  if (code) existing.code = code.trim().toUpperCase()
  if (typeof discount === "number") existing.discount = discount
  if (typeof isActive === "boolean") existing.isActive = isActive
  if (typeof usageLimit === "number") existing.usageLimit = usageLimit
  existing.expiresAt = expiresAt ? new Date(expiresAt) : null

  const updated = await discountRepo.save(existing)
  return NextResponse.json(updated)
}

// DELETE /api/discounts/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid discount ID" }, { status: 400 })
  }

  const db = await getDatabaseConnection()
  const discountRepo = db.getRepository(Discount)

  const existing = await discountRepo.findOne({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Discount not found" }, { status: 404 })
  }

  await discountRepo.remove(existing)
  return NextResponse.json({ message: "Discount deleted successfully" })
}
