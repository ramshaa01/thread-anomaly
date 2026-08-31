import type { Types } from 'mongoose';

export interface OrderCalcItem {
  productId: string;
  name?: string;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface OrderCalcProduct {
  _id: Types.ObjectId | string;
  name: string;
  price: number;
  salePrice?: number | null;
}

export interface CalculatedOrderItem {
  productId: Types.ObjectId | string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface CalculatedOrder {
  items: CalculatedOrderItem[];
  total: number;
}

// Prices always come from `products` (the DB), never from `items` (the client) —
// this is what stops a tampered frontend price from being charged.
export function calculateOrderTotal(
  items: OrderCalcItem[],
  products: OrderCalcProduct[]
): CalculatedOrder {
  let total = 0;
  const orderItems: CalculatedOrderItem[] = [];

  for (const item of items) {
    const product = products.find((p) => String(p._id) === String(item.productId));
    if (!product) {
      throw new Error(`Product not found: ${item.name ?? item.productId}`);
    }

    const price = product.salePrice || product.price;
    total += price * item.quantity;

    orderItems.push({
      productId: product._id,
      name: product.name,
      price,
      image: item.image,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    });
  }

  return { items: orderItems, total };
}
