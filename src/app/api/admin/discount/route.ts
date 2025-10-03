import { NextRequest, NextResponse } from "next/server"
import { AppDataSource } from "@/app/lib/data-source"
import { Discount } from "@/app/lib/entities/discount"

export async function GET(req: NextRequest) {
  try {
    const discountRepo = AppDataSource.getRepository(Discount)
    const discounts = await discountRepo.find({
      order: { createdAt: "DESC" },
    })

    return NextResponse.json(discounts)
  } catch (error) {
    console.error("Failed to fetch discounts:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, discount, isActive, usageLimit, expiresAt } = await req.json()

    if (!code || typeof discount !== "number") {
      return NextResponse.json(
        { error: "Missing code or discount" },
        { status: 400 }
      )
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    const discountRepo = AppDataSource.getRepository(Discount)
    const codeUpper = code.trim().toUpperCase()
    const existing = await discountRepo.findOneBy({ code: codeUpper })

    if (existing) {
      return NextResponse.json(
        { error: "Promo code already exists" },
        { status: 409 }
      )
    }

    const newDiscount = discountRepo.create({
      code: codeUpper,
      discount,
      isActive: !!isActive,
      usageLimit: usageLimit ?? 1,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    })

    const saved = await discountRepo.save(newDiscount)
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error("[POST /api/discount] Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
