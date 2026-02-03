import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, generateId } from '@king/lib/utils';
import { Order } from '@king/lib/types';

export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json(db.orders);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, totalPrice, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod } = body;

    if (!items || !customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const order: Order = {
      id: generateId(),
      items,
      totalPrice,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const db = readDatabase();
    db.orders.push(order);
    writeDatabase(db);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
