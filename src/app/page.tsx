"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: string[];
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?isNew=true").then((r) => r.json()),
      fetch("/api/products?isBestSeller=true").then((r) => r.json()),
    ]).then(([newData, bestData]) => {
      if (newData.success) setNewArrivals(newData.products.slice(0, 4));
      if (bestData.success) setBestSellers(bestData.products.slice(0, 4));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#1e1e1f]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(242,242,239,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(242,242,239,0.04)_1px,transparent_1px)] bg-[size:50px_50px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)_scale(2.5)] opacity-40 pointer-events-none" />

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-[#5FA83D] mb-6"
          >
            New Drop Available
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 relative glitch-hover text-[#F2F2EF]"
            data-text="THREAD ANOMALY"
          >
            THREAD <span className="text-[#5FA83D]">ANOMALY</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base md:text-lg text-[#9A9A96] font-medium tracking-wide mb-10 uppercase"
          >
            Threads That Break The Grid.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/shop" className="bg-[#2E5E2A] text-white font-black uppercase px-8 py-4 tracking-wider hover:bg-[#5FA83D] hover:scale-105 transition-all text-sm">
              Shop Now
            </Link>
            <Link href="/shop?isNew=true" className="bg-transparent border-2 border-[#333] text-[#F2F2EF] font-black uppercase px-8 py-4 tracking-wider hover:border-[#F2C230] hover:text-[#F2C230] transition-colors text-sm">
              New Drops
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Marquee */}
      <div className="bg-[#2E5E2A] text-white overflow-hidden py-3 flex border-y border-[#1a401a]">
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] font-black uppercase text-sm tracking-widest flex items-center gap-10">
          {["Graphic Tees", "///", "Oversized Fits", "///", "Limited Drops", "///", "Music Collab Series", "///",
            "Graphic Tees", "///", "Oversized Fits", "///", "Limited Drops", "///", "Music Collab Series"].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
      <style jsx global>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* Limited Drop Banner */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="bg-[#161617] border border-[#222] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#F2C230] blur-[180px] opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="z-10">
            <span className="inline-block bg-[#F2C230] text-black text-xs font-bold uppercase px-3 py-1 mb-4 tracking-widest">
              Urgent Broadcast
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#F2F2EF]">
              Midnight Signal <br /><span className="text-[#9A9A96]">Drop 04</span>
            </h2>
            <p className="text-[#9A9A96] max-w-md mb-8">
              Reflective 3M prints on heavy 240GSM cotton. Strictly limited to 75 pieces. Zero reprints, ever.
            </p>
            <Link href="/product/midnight-signal" className="inline-flex bg-[#F2F2EF] text-black font-black uppercase px-6 py-3 text-sm tracking-wider hover:bg-[#5FA83D] hover:text-white transition-colors">
              Secure Yours
            </Link>
          </div>
          <div className="z-10 relative">
            <div className="w-56 h-56 bg-[#0B0B0C] border-2 border-dashed border-[#444] flex items-center justify-center rotate-3 group-hover:rotate-0 group-hover:border-[#F2C230] transition-all duration-500">
              <span className="font-mono text-[#444] text-xs">/signal.jpg</span>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-[#161617]">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#F2F2EF]">
            Now Playing
            <span className="text-[#5FA83D] block text-sm font-bold tracking-widest mt-1">NEW ARRIVALS</span>
          </h2>
          <Link href="/shop?isNew=true" className="text-sm font-bold uppercase tracking-wider text-[#9A9A96] hover:text-white border-b border-transparent hover:border-white pb-1 transition-all">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-[#161617] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-[#161617]">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#F2F2EF]">
            Turn It Up
            <span className="text-[#F2C230] block text-sm font-bold tracking-widest mt-1">BEST SELLERS</span>
          </h2>
          <Link href="/shop?isBestSeller=true" className="text-sm font-bold uppercase tracking-wider text-[#9A9A96] hover:text-white border-b border-transparent hover:border-white pb-1 transition-all">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-[#161617] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-[#161617]">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 text-[#F2F2EF]">Transmissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Arjun M.", review: "Midnight Signal is absolutely insane in real life. The 3M print blinded someone at a concert.", rating: 5 },
            { name: "Priya K.", review: "The feedback loop oversized fit is exactly what I needed. Heavyweight cotton, not that flimsy stuff.", rating: 5 },
            { name: "Rohan T.", review: "Finally a brand that doesn't feel like every other streetwear clone. Anomaly 01 is a piece of art.", rating: 5 },
          ].map((review, i) => (
            <div key={i} className="bg-[#161617] border border-[#222] p-6 hover:border-[#2E5E2A] transition-colors">
              <div className="text-[#F2C230] mb-3">{"★".repeat(review.rating)}</div>
              <p className="text-[#9A9A96] mb-4 leading-relaxed italic">"{review.review}"</p>
              <span className="font-bold uppercase text-sm text-[#5FA83D]">— {review.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-[#161617] text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-[#F2F2EF]">Join The Underground</h2>
        <p className="text-[#9A9A96] max-w-md mx-auto mb-8">Early access to limited drops, unreleased audio from our collabs, and studio updates.</p>
        <form className="flex max-w-md mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="YOUR EMAIL" className="flex-1 bg-[#161617] border border-[#333] px-4 py-3 text-sm text-[#F2F2EF] focus:outline-none focus:border-[#5FA83D] transition-colors font-mono" />
          <button type="submit" className="bg-[#2E5E2A] text-white font-black uppercase px-5 py-3 text-sm hover:bg-[#5FA83D] transition-colors">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
