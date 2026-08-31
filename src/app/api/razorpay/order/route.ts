import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { calculateOrderTotal } from '@/lib/order';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    let userId;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      userId = decoded.id;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { items, shippingAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total from DB prices to prevent tampering
    const products = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 });
      products.push(product);
    }

    const { items: orderItems, total } = calculateOrderTotal(items, products);

    const shippingAmount = total > 0 ? 150 : 0;
    const finalTotal = total + shippingAmount;

    const options = {
      amount: finalTotal * 100, // Razorpay works in paise (smallest currency unit)
      currency: "INR",
      receipt: `receipt_${Date.now()}_${userId}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create a Pending Order in DB
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      total: finalTotal,
      status: 'PENDING',
      razorpayOrderId: razorpayOrder.id,
      shippingAddress
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder._id, // Our DB order ID
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
