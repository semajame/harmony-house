import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Payment } from '../../../lib/entities/payment'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, method } = body

    if (!amount || !method) {
      return NextResponse.json(
        { error: 'Amount and method are required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const paymentRepo = db.getRepository(Payment)

    const newPayment = paymentRepo.create({ amount, method })
    await paymentRepo.save(newPayment)

    return NextResponse.json(newPayment, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
