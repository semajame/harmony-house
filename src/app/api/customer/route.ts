import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../lib/data-source'
import { Customer } from '../../lib/entities/customer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const customerRepo = db.getRepository(Customer)

    const newCustomer = customerRepo.create({
      name,
      email,
      phone,
    })

    await customerRepo.save(newCustomer)
    const { id, isActive, ...customerWithoutMeta } = newCustomer
    
    return NextResponse.json(customerWithoutMeta, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}