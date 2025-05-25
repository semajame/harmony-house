import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Payment } from '../../../lib/entities/payment'
//TODO: just centralize this GETALL to one function later on for more efficieny
export async function GET(req: NextRequest) {
  const db = await getDatabaseConnection()
  const paymentRepo = db.getRepository(Payment)
  const payments = await paymentRepo.find()

  return NextResponse.json(payments)
}

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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, amount, method } = body

    if (!id) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const paymentRepo = db.getRepository(Payment)

    const payment = await paymentRepo.findOne({ where: { id } })
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    payment.amount = amount ?? payment.amount
    payment.method = method ?? payment.method

    await paymentRepo.save(payment)

    return NextResponse.json(payment)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
