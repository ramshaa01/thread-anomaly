import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#333] bg-[#050505] pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-6 h-6 bg-black border border-white flex items-center justify-center relative overflow-hidden group-hover:border-[#00FF41] transition-colors">
              <div className="w-3 h-3 bg-[#00FF41] absolute"></div>
              <div className="w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.2)_50%)] bg-[length:100%_4px]"></div>
            </div>
            <span className="font-bold text-lg tracking-tighter uppercase">THREAD ANOMALY</span>
          </Link>
          <p className="text-[#888] max-w-sm mb-6">
            Threads that break the grid. Made for people who don't fit the pattern.
          </p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="JOIN THE UNDERGROUND" 
              className="bg-[#111] border border-[#333] px-4 py-2 text-sm w-full focus:outline-none focus:border-[#00FF41]"
            />
            <button className="bg-[#00FF41] text-black font-bold px-4 py-2 uppercase text-sm hover:bg-[#FFEA00] transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider mb-4 text-[#00FF41]">Shop</h4>
          <ul className="flex flex-col gap-2 text-sm text-[#888]">
            <li><Link href="/shop" className="hover:text-white">All Products</Link></li>
            <li><Link href="/shop?category=New+Arrivals" className="hover:text-white">New Arrivals</Link></li>
            <li><Link href="/shop?category=Best+Sellers" className="hover:text-white">Best Sellers</Link></li>
            <li><Link href="/shop?category=Limited" className="hover:text-white">Limited Drops</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider mb-4 text-[#00FF41]">Info</h4>
          <ul className="flex flex-col gap-2 text-sm text-[#888]">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="#" className="hover:text-white">Shipping & Returns</Link></li>
            <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-16 flex flex-col md:flex-row justify-between items-center text-xs text-[#555] border-t border-[#222] pt-8">
        <p>&copy; 2026 THREAD ANOMALY. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white">INSTAGRAM</Link>
          <Link href="#" className="hover:text-white">YOUTUBE</Link>
          <Link href="#" className="hover:text-white">TWITTER</Link>
        </div>
      </div>
    </footer>
  );
}
