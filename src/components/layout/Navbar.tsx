"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Heart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[#E5E5E5] hover:text-[#00FF41]"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black border border-white flex items-center justify-center relative overflow-hidden group-hover:border-[#00FF41] transition-colors">
            {/* Pixel Spider Abstraction */}
            <div className="w-4 h-4 bg-[#00FF41] absolute"></div>
            <div className="w-2 h-2 bg-[#FFEA00] absolute top-1 right-1"></div>
            <div className="w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.2)_50%)] bg-[length:100%_4px]"></div>
          </div>
          <span className="font-bold text-xl tracking-tighter uppercase glitch-hover" data-text="THREAD ANOMALY">
            THREAD ANOMALY
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-wide">
          <Link href="/" className="hover:text-[#5FA83D] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#5FA83D] transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-[#5FA83D] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#5FA83D] transition-colors">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <>
              <Link href="/orders" className="hidden md:block text-xs font-bold uppercase text-[#888] hover:text-[#00FF41]">My Orders</Link>
              <button onClick={logout} className="hidden md:block text-xs font-bold uppercase text-[#888] hover:text-[#00FF41]">Logout</button>
            </>
          ) : (
            <Link href="/login" className="hidden md:block text-xs font-bold uppercase text-[#888] hover:text-[#00FF41]">Login</Link>
          )}
          
          <button className="hidden md:block hover:text-[#5FA83D] transition-colors">
            <Search size={20} />
          </button>
          <button className="hidden md:block hover:text-[#5FA83D] transition-colors">
            <Heart size={20} />
          </button>
          <Link href="/checkout" className="relative hover:text-[#5FA83D] transition-colors">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="badge-bump absolute -top-2 -right-2 bg-[#F2C230] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-[#0B0B0C] z-50 flex flex-col pt-20 px-8"
          >
            <button 
              className="absolute top-6 right-6 text-[#F2F2EF] hover:text-[#5FA83D]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            
            <nav className="flex flex-col gap-8 text-3xl font-bold uppercase tracking-tighter mt-12">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00FF41] glitch-hover" data-text="HOME">HOME</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00FF41] glitch-hover" data-text="SHOP">SHOP</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00FF41] glitch-hover" data-text="ABOUT">ABOUT</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00FF41] glitch-hover" data-text="CONTACT">CONTACT</Link>
              {user ? (
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left hover:text-[#00FF41] glitch-hover" data-text="LOGOUT">LOGOUT</button>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00FF41] glitch-hover" data-text="LOGIN">LOGIN</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
