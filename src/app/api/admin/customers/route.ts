import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Customer } from '../../../lib/entities/customer'

export async function GET(req: NextRequest) {
  const db = await getDatabaseConnection()
  const customerRepo = db.getRepository(Customer)
  const customers = await customerRepo.find()

  return NextResponse.json(customers)
}

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

    const newCustomer = customerRepo.create({ name, email, phone })
    await customerRepo.save(newCustomer)

    return NextResponse.json(newCustomer, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, email, phone, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const customerRepo = db.getRepository(Customer)

    const customer = await customerRepo.findOne({ where: { id } })
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    customer.name = name ?? customer.name
    customer.email = email ?? customer.email
    customer.phone = phone ?? customer.phone
    customer.isActive = isActive ?? customer.isActive

    await customerRepo.save(customer)
    return NextResponse.json(customer)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const customerRepo = db.getRepository(Customer)

    const customer = await customerRepo.findOne({ where: { id } })
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    customer.isActive = !customer.isActive
    await customerRepo.save(customer)

    return NextResponse.json({
      message: `Customer is now ${customer.isActive ? 'active' : 'inactive'}`,
      isActive: customer.isActive,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

