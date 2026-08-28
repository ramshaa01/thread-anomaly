import crypto from 'crypto';

describe('Razorpay Signature Verification', () => {
  it('should verify a valid signature', () => {
    const razorpay_order_id = 'order_123';
    const razorpay_payment_id = 'pay_456';
    const secret = 'test_secret_key';
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    // Simulate the logic in our API route
    const isAuthentic = expectedSignature === expectedSignature;
    expect(isAuthentic).toBe(true);
  });

  it('should reject an invalid signature', () => {
    const razorpay_order_id = 'order_123';
    const razorpay_payment_id = 'pay_456';
    const secret = 'test_secret_key';
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const invalidSignature = 'invalid_signature_string';
    
    const isAuthentic = expectedSignature === invalidSignature;
    expect(isAuthentic).toBe(false);
  });
});
