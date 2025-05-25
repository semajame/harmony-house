import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../../lib/data-source'
import { Customer } from '../../../../lib/entities/customer'

export async function GET(req: NextRequest) {
  const db = await getDatabaseConnection()
  const customerRepo = db.getRepository(Customer)

  const { searchParams } = new URL(req.url)
  const idString = searchParams.get('id')
  const id = idString ? Number(idString) : NaN

  if (!idString || isNaN(id) || !/^\d+$/.test(idString)) {
    return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 })
  }
  if (!id) {
    return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
  }

  const customer = await customerRepo.findOne({ where: { id: Number(id) } })

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  return NextResponse.json(customer)
}
