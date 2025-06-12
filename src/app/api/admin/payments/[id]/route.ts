import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../../lib/data-source'
import { Payment } from '../../../../lib/entities/payment'
import { requireAdmin } from '@/app/lib/auth-utils'
//TODO: just centralize this GETBYID to one function later on for more efficieny
export async function GET(req: NextRequest) {

  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck
  
  const db = await getDatabaseConnection()
  const paymentRepo = db.getRepository(Payment)

  const { searchParams } = new URL(req.url)
  const idString = searchParams.get('id')
  const id = idString ? Number(idString) : NaN

  if (!idString || isNaN(id) || !/^\d+$/.test(idString)) {
    return NextResponse.json({ error: 'Invalid payment ID' }, { status: 400 })
  }
  if (!id) {
    return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
  }

  const payment = await paymentRepo.findOne({ where: { id: Number(id) } })

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  return NextResponse.json(payment)
}
