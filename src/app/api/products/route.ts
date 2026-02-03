import { NextRequest, NextResponse } from 'next/server';
import { readDatabase } from '@king/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const db = readDatabase();
    let products = [];

    if (category === 'wines') {
      products = db.products.wines;
    } else if (category === 'general') {
      products = db.products.general;
    } else {
      products = [...db.products.wines, ...db.products.general];
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
