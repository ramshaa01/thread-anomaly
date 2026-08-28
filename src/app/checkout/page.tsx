"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Script from "next/script";

export default function Checkout() {
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: "",
    city: "",
    postalCode: "",
  });

  const shipping = items.length > 0 ? 150 : 0;
  const total = cartTotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingAddress: formData }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      const resLoad = await initializeRazorpay();
      if (!resLoad) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_fallback",
        amount: data.amount,
        currency: data.currency,
        name: "Thread Anomaly",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                orderId: data.orderId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              setStep(3); // Success step
            } else {
              setError(verifyData.error || "Payment verification failed");
            }
          } catch (err) {
            setError("Payment verification error");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: user?.email || "",
        },
        theme: {
          color: "#00FF41",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        setError("Payment failed. Please try again.");
      });
      paymentObject.open();

    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#161617] border border-[#5FA83D] p-12"
        >
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#5FA83D]">
            Transmission Complete
          </h1>
          <p className="text-[#888] mb-8 font-medium">
            Order confirmed. Your package is entering the grid.
          </p>
          <div className="font-mono text-xs text-[#9A9A96] mb-8 bg-[#0B0B0C] p-4 inline-block text-left">
            &gt; STATUS: PAID<br/>
            &gt; DESTINATION: CONFIRMED
          </div>
          <div>
            <Link href="/shop" className="bg-[#F2F2EF] text-black font-black uppercase px-8 py-4 text-sm hover:bg-[#5FA83D] transition-colors inline-block">
              Return to Catalog
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 border-b border-[#333] pb-4 text-[#F2F2EF]">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="text-center py-20 bg-[#161617] border border-[#333]">
              <p className="text-[#9A9A96] font-bold uppercase mb-6">Your bag is empty.</p>
              <Link href="/shop" className="bg-[#F2F2EF] text-black font-black uppercase px-6 py-3 text-sm hover:bg-[#5FA83D] transition-colors">
                Explore The Grid
              </Link>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-[#5FA83D]">1. Bag</h2>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-[#161617] p-4 border border-[#222]">
                        <div className="w-24 h-24 bg-[#0B0B0C] border border-[#333] flex items-center justify-center font-mono text-xs text-[#444]">
                          [img]
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold uppercase tracking-tight text-[#F2F2EF]">{item.name}</h3>
                              <p className="text-[#9A9A96] text-sm uppercase">Size: {item.size} | Color: {item.color}</p>
                            </div>
                            <span className="font-bold text-[#F2C230]">₹{item.price}</span>
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div className="flex items-center gap-4 bg-[#0B0B0C] border border-[#333] px-2 py-1 w-fit">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#9A9A96] hover:text-white px-2">-</button>
                              <span className="font-bold w-4 text-center text-[#F2F2EF]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#9A9A96] hover:text-white px-2">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[#9A9A96] hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      if (!user) {
                        alert("Please login to proceed to checkout");
                        window.location.href = "/login";
                      } else {
                        setStep(2);
                      }
                    }}
                    className="w-full bg-[#F2F2EF] text-black font-black uppercase py-4 mt-6 hover:bg-[#5FA83D] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Shipping <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#333] pb-4 mb-8">
                    <button onClick={() => setStep(1)} className="text-[#9A9A96] hover:text-white text-sm uppercase font-bold">← Back to Bag</button>
                  </div>
                  
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-[#5FA83D]">2. Shipping & Payment</h2>
                  
                  {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 mb-6 text-sm font-bold uppercase">{error}</div>}

                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="FIRST NAME" required className="bg-[#161617] border border-[#333] px-4 py-3 uppercase text-sm font-bold text-[#F2F2EF] focus:outline-none focus:border-[#5FA83D] w-full" />
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="LAST NAME" required className="bg-[#161617] border border-[#333] px-4 py-3 uppercase text-sm font-bold text-[#F2F2EF] focus:outline-none focus:border-[#5FA83D] w-full" />
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="ADDRESS" required className="bg-[#161617] border border-[#333] px-4 py-3 uppercase text-sm font-bold text-[#F2F2EF] focus:outline-none focus:border-[#5FA83D] w-full md:col-span-2" />
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="CITY" required className="bg-[#161617] border border-[#333] px-4 py-3 uppercase text-sm font-bold text-[#F2F2EF] focus:outline-none focus:border-[#5FA83D] w-full" />
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="POSTAL CODE" required className="bg-[#161617] border border-[#333] px-4 py-3 uppercase text-sm font-bold text-[#F2F2EF] focus:outline-none focus:border-[#5FA83D] w-full" />
                    </div>

                    <div className="bg-[#161617] p-6 border border-[#333] mt-8">
                      <h3 className="font-bold uppercase tracking-tight mb-4 text-[#F2F2EF]">Payment Info</h3>
                      <p className="text-[#9A9A96] text-sm mb-4">You will be redirected to Razorpay to complete your secure payment.</p>
                      
                      <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[#2E5E2A] text-white font-black uppercase py-4 hover:bg-[#5FA83D] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                      >
                        {isProcessing ? "Processing..." : `Pay ₹${total}`}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {items.length > 0 && (
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-[#161617] border border-[#333] p-6 sticky top-28">
              <h3 className="font-bold uppercase tracking-wider mb-6 border-b border-[#333] pb-2 text-[#F2F2EF]">Order Summary</h3>
              
              <div className="space-y-3 text-sm text-[#F2F2EF] font-medium mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-[#333] pt-4 font-bold text-lg text-[#F2F2EF]">
                <span>Total</span>
                <span className="text-[#F2C230]">₹{total}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
