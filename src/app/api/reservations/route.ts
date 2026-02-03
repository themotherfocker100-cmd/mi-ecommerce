import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, generateId, calculateRentalPrice } from '@king/lib/utils';
import { Reservation } from '@king/lib/types';

export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json(db.reservations);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching reservations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkInDate, checkOutDate, checkInTime, numberOfGuests, guestName, guestEmail, guestPhone, specialRequests } = body;

    // Validar datos
    if (!checkInDate || !checkOutDate || !guestName || !guestEmail || !guestPhone || !numberOfGuests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calcular precio
    const totalPrice = calculateRentalPrice(checkInDate, checkOutDate);

    // Crear reserva
    const reservation: Reservation = {
      id: generateId(),
      checkInDate,
      checkOutDate,
      checkInTime: checkInTime || '15:00',
      numberOfGuests,
      guestName,
      guestEmail,
      guestPhone,
      totalPrice,
      status: 'pending',
      specialRequests,
      createdAt: new Date().toISOString(),
    };

    // Guardar en base de datos
    const db = readDatabase();
    db.reservations.push(reservation);
    writeDatabase(db);

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Error creating reservation' }, { status: 500 });
  }
}
