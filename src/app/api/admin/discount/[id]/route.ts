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
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (isNaN(id))
      return NextResponse.json(
        { error: "Invalid discount ID" },
        { status: 400 }
      )

    const body = await req.json()
    const { code, discount, isActive, expiresAt, usageLimit } = body

    const db = await getDatabaseConnection()
    const discountRepo = db.getRepository(Discount)
    const existing = await discountRepo.findOneBy({ id })
    if (!existing)
      return NextResponse.json({ error: "Discount not found" }, { status: 404 })

    Object.assign(existing, {
      code: code?.trim().toUpperCase() ?? existing.code,
      discount: discount ?? existing.discount,
      isActive: isActive ?? existing.isActive,
      expiresAt: expiresAt ? new Date(expiresAt) : existing.expiresAt,
      usageLimit: usageLimit ?? existing.usageLimit,
    })

    const updated = await discountRepo.save(existing)
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
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
