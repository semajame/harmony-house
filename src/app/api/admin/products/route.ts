import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Product } from '../../../lib/entities/product'
import { requireAdmin } from '@/app/lib/auth-utils'
import { Like } from 'typeorm'

export async function GET(req: NextRequest) {
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  
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
            { ...baseWhere, sku: Like(searchPattern) },
            { ...baseWhere, description: Like(searchPattern) }
          ].map(condition => {
            return condition
          }),
          order: { created_at: 'DESC' }
        })
        
        return NextResponse.json(products)
      } else {
        const products = await productRepo.find({
          where: [
            { name: Like(searchPattern) },
            { sku: Like(searchPattern) },
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
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  
  try {
    const body = await req.json()
    const { name, sku, description, price, quantity, is_active } = body

    if (!name || !sku || price === null || price === undefined || 
        name.trim() === '' || sku.trim() === '') {
      return NextResponse.json(
        { error: 'Name, SKU, and price are required' },
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

    const parsedQuantity = quantity !== undefined ? parseInt(quantity) : 0
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a valid non-negative number' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const productRepo = db.getRepository(Product)

    const existingProduct = await productRepo.findOne({
      where: { sku: sku.trim() }
    })

    if (existingProduct) {
      if (!existingProduct.is_active) {
        existingProduct.name = name.trim()
        existingProduct.description = description?.trim() || null
        existingProduct.price = parsedPrice
        existingProduct.quantity = parsedQuantity
        existingProduct.is_active = is_active !== undefined ? is_active : true

        await productRepo.save(existingProduct)
        
        return NextResponse.json({
          ...existingProduct,
          message: 'Product reactivated with updated information'
        }, { status: 200 })
      } else {
        return NextResponse.json(
          { error: 'Product with this SKU already exists and is active' },
          { status: 409 }
        )
      }
    }

    const newProduct = productRepo.create({
      name: name.trim(),
      sku: sku.trim(),
      description: description?.trim() || null,
      price: parsedPrice,
      quantity: parsedQuantity,
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
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck  
  
  try {
    const body = await req.json()
    const { id, name, sku, description, price, quantity, is_active } = body

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

    if (quantity !== undefined) {
      const parsedQuantity = parseInt(quantity)
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        return NextResponse.json(
          { error: 'Quantity must be a valid non-negative number' },
          { status: 400 }
        )
      }
      product.quantity = parsedQuantity
    }

    if (sku && sku.trim() !== product.sku) {
      const existingProduct = await productRepo.findOne({
        where: { sku: sku.trim() }
      })
      
      if (existingProduct && existingProduct.id !== parsedId) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 409 }
        )
      }
      product.sku = sku.trim()
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
  // const adminCheck = await requireAdmin(req)
  // if (adminCheck) return adminCheck

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