import crypto from 'crypto';
import { verifyRazorpaySignature } from '@/lib/razorpay';

describe('Razorpay Signature Verification', () => {
  const secret = 'test_secret_key';
  const razorpay_order_id = 'order_123';
  const razorpay_payment_id = 'pay_456';

  it('should verify a signature actually computed with the correct secret', () => {
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    expect(
      verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, validSignature, secret)
    ).toBe(true);
  });

  it('should reject a tampered/invalid signature', () => {
    expect(
      verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, 'invalid_signature_string', secret)
    ).toBe(false);
  });

  it('should reject a signature computed with the wrong secret', () => {
    const signatureFromWrongSecret = crypto
      .createHmac('sha256', 'a_different_secret')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    expect(
      verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, signatureFromWrongSecret, secret)
    ).toBe(false);
  });
});
