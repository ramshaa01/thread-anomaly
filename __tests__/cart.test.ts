import { calculateOrderTotal } from '@/lib/order';

describe('Cart Total Calculation', () => {
  it('should calculate total correctly from product prices (ignoring frontend total)', () => {
    const mockDbProducts = [
      { _id: 'prod_1', name: 'Shirt 1', price: 1000, salePrice: null },
      { _id: 'prod_2', name: 'Shirt 2', price: 2000, salePrice: 1500 },
    ];

    // Cart items sent from frontend include a tampered price — the real
    // calculation must ignore it entirely and use only the DB product price.
    const frontendCartItems = [
      { productId: 'prod_1', quantity: 2, price: 10 }, // fake price!
      { productId: 'prod_2', quantity: 1, price: 1500 },
    ];

    const { total } = calculateOrderTotal(frontendCartItems, mockDbProducts);

    // Expecting: (1000 * 2) + (1500 * 1) = 3500
    expect(total).toBe(3500);
    expect(total).not.toBe((10 * 2) + 1500);
  });

  it('should throw when a cart item references a product that no longer exists', () => {
    const mockDbProducts = [{ _id: 'prod_1', name: 'Shirt 1', price: 1000, salePrice: null }];
    const cartItems = [{ productId: 'prod_missing', name: 'Ghost Shirt', quantity: 1 }];

    expect(() => calculateOrderTotal(cartItems, mockDbProducts)).toThrow(/Product not found/);
  });
});
