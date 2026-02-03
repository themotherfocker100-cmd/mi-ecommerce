import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@king/lib/utils';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = readDatabase();
    const order = db.orders.find((o: any) => o.id === params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const db = readDatabase();
    const index = db.orders.findIndex((o: any) => o.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    db.orders[index] = { ...db.orders[index], ...body };
    writeDatabase(db);

    return NextResponse.json(db.orders[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}
