import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'newest';
    const isNew = searchParams.get('isNew');
    const isBestSeller = searchParams.get('isBestSeller');

    const filter: Record<string, any> = {};
    if (category && category !== 'All') filter.category = category;
    if (isNew === 'true') filter.isNew = true;
    if (isBestSeller === 'true') filter.isBestSeller = true;

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };

    const products = await Product.find(filter).sort(sortObj);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
