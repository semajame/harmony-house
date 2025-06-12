import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Product } from '@/app/lib/entities/product'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const productRepo = db.getRepository(Product)

    const existingProduct = await productRepo.findOne({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await productRepo.remove(existingProduct)

    return NextResponse.json(
      { success: true, message: `Product ${productId} deleted.` },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error deleting product:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const body = await req.json()
    const { name, description, price, is_active } = body

    if (!name || price === null || price === undefined || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const productRepo = db.getRepository(Product)

    const existingProduct = await productRepo.findOne({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    existingProduct.name = name.trim()
    existingProduct.description = description?.trim() || null
    existingProduct.price = parsedPrice
    existingProduct.is_active = is_active !== undefined ? is_active : true

    await productRepo.save(existingProduct)

    return NextResponse.json(existingProduct, { status: 200 })
  } catch (err) {
    console.error('Error updating product:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
