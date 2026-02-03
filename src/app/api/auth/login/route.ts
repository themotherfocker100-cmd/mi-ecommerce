import { NextRequest, NextResponse } from 'next/server';
import { readDatabase } from '@king/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const db = readDatabase();
    const admin = db.users.admin;

    if (admin && admin.email === email && admin.password === password) {
      // Crear respuesta con cookie de sesión
      const response = NextResponse.json(
        { success: true, user: { id: admin.id, email: admin.email, name: admin.name } },
        { status: 200 }
      );

      // Establecer cookie de sesión
      response.cookies.set({
        name: 'adminSession',
        value: Buffer.from(JSON.stringify({ id: admin.id, email: admin.email })).toString('base64'),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 horas
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Error during login' }, { status: 500 });
  }
}
