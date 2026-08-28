describe('Cart Total Calculation', () => {
  it('should calculate total correctly from product prices (ignoring frontend total)', () => {
    // Mock products from DB
    const mockDbProducts = [
      { _id: 'prod_1', name: 'Shirt 1', price: 1000, salePrice: null },
      { _id: 'prod_2', name: 'Shirt 2', price: 2000, salePrice: 1500 },
    ];

    // Mock cart items sent from frontend (frontend might send wrong prices!)
    const frontendCartItems = [
      { productId: 'prod_1', quantity: 2, price: 10 }, // fake price!
      { productId: 'prod_2', quantity: 1, price: 1500 },
    ];

    // Server-side calculation logic
    let serverTotal = 0;
    for (const item of frontendCartItems) {
      const product = mockDbProducts.find(p => p._id === item.productId);
      if (product) {
        const price = product.salePrice || product.price;
        serverTotal += price * item.quantity;
      }
    }

    // Expecting: (1000 * 2) + (1500 * 1) = 3500
    expect(serverTotal).toBe(3500);
    // Ensure the frontend fake price was ignored
    expect(serverTotal).not.toBe((10 * 2) + 1500);
  });
});
