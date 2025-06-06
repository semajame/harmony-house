import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Product } from '../../../lib/entities/product'
import { requireAdmin } from '@/app/lib/auth-utils'
import { Like } from 'typeorm'

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabaseConnection()
    const productRepo = db.getRepository(Product)

    const { searchParams } = new URL(req.url)
    const isActive = searchParams.get('is_active')
    const search = searchParams.get('search')
    const includeInactive = searchParams.get('include_inactive')

    let whereConditions: any = {}

    if (includeInactive !== 'true') {
      whereConditions.is_active = true
    } else if (isActive !== null) {
      whereConditions.is_active = isActive === 'true'
    }

    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`

      if (Object.keys(whereConditions).length > 0) {
        const baseWhere = { ...whereConditions }

        const products = await productRepo.find({
          where: [
            { ...baseWhere, name: Like(searchPattern) },
            { ...baseWhere, description: Like(searchPattern) }
          ],
          order: { created_at: 'DESC' }
        })

        return NextResponse.json(products)
      } else {
        const products = await productRepo.find({
          where: [
            { name: Like(searchPattern) },
            { description: Like(searchPattern) }
          ],
          order: { created_at: 'DESC' }
        })

        return NextResponse.json(products)
      }
    }

    const products = await productRepo.find({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : {},
      order: { created_at: 'DESC' }
    })

    return NextResponse.json(products)
  } catch (err) {
    console.error('Error fetching products:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const newProduct = productRepo.create({
      name: name.trim(),
      description: description?.trim() || null,
      price: parsedPrice,
      is_active: is_active !== undefined ? is_active : true,
    })

    await productRepo.save(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (err) {
    console.error('Error creating product:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, description, price, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const productRepo = db.getRepository(Product)

    const product = await productRepo.findOne({ where: { id: parsedId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (price !== undefined) {
      const parsedPrice = parseFloat(price)
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { error: 'Price must be a valid positive number' },
          { status: 400 }
        )
      }
      product.price = parsedPrice
    }

    product.name = name?.trim() ?? product.name
    product.description = description !== undefined ? (description?.trim() || null) : product.description
    product.is_active = is_active ?? product.is_active

    await productRepo.save(product)
    return NextResponse.json(product)
  } catch (err) {
    console.error('Error updating product:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, action } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const productRepo = db.getRepository(Product)

    const product = await productRepo.findOne({ where: { id: parsedId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    switch (action) {
      case 'toggle-active':
        product.is_active = !product.is_active
        await productRepo.save(product)
        return NextResponse.json({ 
          message: `Product is now ${product.is_active ? 'active' : 'inactive'}`, 
          is_active: product.is_active,
          id: product.id
        })

      case 'activate':
        if (product.is_active) {
          return NextResponse.json({ 
            message: 'Product is already active', 
            is_active: product.is_active 
          })
        }
        product.is_active = true
        await productRepo.save(product)
        return NextResponse.json({ 
          message: 'Product activated successfully', 
          is_active: product.is_active,
          id: product.id
        })

      case 'deactivate':
        if (!product.is_active) {
          return NextResponse.json({ 
            message: 'Product is already inactive', 
            is_active: product.is_active 
          })
        }
        product.is_active = false
        await productRepo.save(product)
        return NextResponse.json({ 
          message: 'Product deactivated successfully (soft deleted)', 
          is_active: product.is_active,
          id: product.id
        })

      default:
        return NextResponse.json({ error: 'Invalid action. Use: toggle-active, activate, or deactivate' }, { status: 400 })
    }
  } catch (err) {
    console.error('Error updating product status:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
