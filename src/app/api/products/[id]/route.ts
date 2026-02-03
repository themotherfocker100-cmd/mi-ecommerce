import { NextRequest, NextResponse } from 'next/server';
import { readDatabase } from '@king/lib/utils';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = readDatabase();
    const wines = db.products.wines;
    const general = db.products.general;

    let product = wines.find((p: any) => p.id === params.id);
    if (!product) {
      product = general.find((p: any) => p.id === params.id);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}
