import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Borrar cookie de sesión
    response.cookies.delete('adminSession');

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Error during logout' }, { status: 500 });
  }
}
