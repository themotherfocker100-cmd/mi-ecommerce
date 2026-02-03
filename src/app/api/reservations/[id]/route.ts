import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@king/lib/utils';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = readDatabase();
    const reservation = db.reservations.find((r: any) => r.id === params.id);

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching reservation' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const db = readDatabase();
    const index = db.reservations.findIndex((r: any) => r.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    db.reservations[index] = { ...db.reservations[index], ...body };
    writeDatabase(db);

    return NextResponse.json(db.reservations[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating reservation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = readDatabase();
    const index = db.reservations.findIndex((r: any) => r.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const deleted = db.reservations.splice(index, 1);
    writeDatabase(db);

    return NextResponse.json(deleted[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting reservation' }, { status: 500 });
  }
}
