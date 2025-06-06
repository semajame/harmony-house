import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Order, OrderStatus } from '../../../lib/entities/order'
import { User } from '../../../lib/entities/users'
import { Product } from '../../../lib/entities/product'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    const db = await getDatabaseConnection()
    const orderRepo = db.getRepository(Order)

    let orders

    if (userId) {
      orders = await orderRepo.find({
        where: { user_id: parseInt(userId) },
        relations: ['user', 'product'],
        order: { created_at: 'DESC' }
      })
    } else {
      orders = await orderRepo.find({
        relations: ['user', 'product'],
        order: { created_at: 'DESC' }
      })
    }

    const sanitizedOrders = orders.map(order => {
      const { password, ...safeUser } = order.user
      return {
        ...order,
        user: safeUser
      }
    })

    return NextResponse.json(sanitizedOrders)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, product_id, quantity = 1, notes } = body

    if (!user_id || !product_id) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const orderRepo = db.getRepository(Order)
    const userRepo = db.getRepository(User)
    const productRepo = db.getRepository(Product)

    const user = await userRepo.findOne({ where: { id: user_id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const product = await productRepo.findOne({ where: { id: product_id } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (!product.is_active) {
      return NextResponse.json({ error: 'Product is not available' }, { status: 400 })
    }

    if (quantity <= 0) {
      return NextResponse.json({ error: 'Quantity must be greater than 0' }, { status: 400 })
    }

    const unit_price = product.price
    const total_price = unit_price * quantity

    const newOrder = orderRepo.create({
      user_id,
      product_id,
      quantity,
      unit_price,
      total_price,
      notes,
      status: OrderStatus.PENDING,
    })

    await orderRepo.save(newOrder)

    const completeOrder = await orderRepo.findOne({
      where: { id: newOrder.id },
      relations: ['user', 'product']
    })

    if (completeOrder && completeOrder.user) {
      const { password, ...safeUser } = completeOrder.user
      completeOrder.user = safeUser as any
    }

    return NextResponse.json(completeOrder, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, quantity, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    if (quantity !== undefined && quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      )
    }

    const db = await getDatabaseConnection()
    const orderRepo = db.getRepository(Order)

    const order = await orderRepo.findOne({ 
      where: { id },
      relations: ['product']
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === OrderStatus.CANCELLED) {
      return NextResponse.json({ 
        error: 'Cannot modify cancelled orders' 
      }, { status: 400 })
    }

    if (status === OrderStatus.CANCELLED && order.status !== status) {
      order.status = OrderStatus.CANCELLED
      await orderRepo.save(order)

      const updatedOrder = await orderRepo.findOne({
        where: { id },
        relations: ['user', 'product']
      })
      if (updatedOrder && updatedOrder.user) {
        const { password, ...safeUser } = updatedOrder.user
        updatedOrder.user = safeUser as any
      }

      return NextResponse.json({
        ...updatedOrder,
        message: 'Order cancelled successfully.'
      })
    }

    if (quantity && quantity !== order.quantity) {
      order.quantity = quantity
      order.total_price = order.unit_price * quantity
    }

    if (status) {
      switch (status) {
        case 'pending':
          order.status = OrderStatus.PENDING
          break
        case 'completed':
          order.status = OrderStatus.COMPLETED
          break
        case 'cancelled':
          order.status = OrderStatus.CANCELLED
          break
        default:
          return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
    }
    
    order.notes = notes ?? order.notes

    await orderRepo.save(order)

    const updatedOrder = await orderRepo.findOne({
      where: { id },
      relations: ['user', 'product']
    })
    if (updatedOrder && updatedOrder.user) {
      const { password, ...safeUser } = updatedOrder.user
      updatedOrder.user = safeUser as any
    }
    return NextResponse.json(updatedOrder)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, action } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const db = await getDatabaseConnection()
    const orderRepo = db.getRepository(Order)

    const order = await orderRepo.findOne({ 
      where: { id },
      relations: ['product']
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === OrderStatus.CANCELLED) {
      return NextResponse.json({ 
        error: 'Cannot modify cancelled orders' 
      }, { status: 400 })
    }

    if (action === 'pending') {
      order.status = OrderStatus.PENDING
    } else if (action === 'complete') {
      order.status = OrderStatus.COMPLETED
    } else if (action === 'cancel') {
      order.status = OrderStatus.CANCELLED
      await orderRepo.save(order)

      return NextResponse.json({ 
        message: 'Order cancelled successfully.',
        status: order.status
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await orderRepo.save(order)

    return NextResponse.json({ 
      message: `Order status updated to ${order.status}`, 
      status: order.status
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}