"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Flexible product type that works with both static data and DB data
export interface ProductCardProps {
  id: string;
  name: string;
  slug?: string;
  category: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: string[];
  images?: string[];
  image?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function ProductCard({ product }: { product: ProductCardProps }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const productLink = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;
  const primaryImage = product.images?.[0] || product.image || null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login or create an account to add products to your cart.");
      window.location.href = "/login";
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: primaryImage || "",
      size: product.sizes[0],
      color: product.colors[0],
      quantity: 1,
    });
  };

  return (
    <Link href={productLink} className="group block relative">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#161617] overflow-hidden mb-4 border border-[#222] group-hover:border-[#5FA83D] transition-colors">
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[#333] text-sm transform group-hover:scale-105 transition-transform duration-500">
          {primaryImage && !primaryImage.includes("placeholder") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="group-hover:text-[#5FA83D] transition-colors">[{product.name}]</span>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-[#2E5E2A] text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">New</span>
          )}
          {product.salePrice && (
            <span className="bg-[#F2C230] text-black text-[10px] font-bold uppercase px-2 py-1 tracking-wider">Sale</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/80 to-transparent z-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-white text-black font-bold uppercase text-xs py-3 hover:bg-[#5FA83D] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} /> Add
          </button>
          <button className="w-10 h-10 bg-[#222] text-white flex items-center justify-center hover:bg-[#F2C230] hover:text-black transition-colors">
            <Heart size={16} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-bold uppercase tracking-tight text-lg mb-1 text-[#F2F2EF] group-hover:text-[#5FA83D] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-[#9A9A96] uppercase mb-2">{product.category}</p>
        <div className="flex items-center gap-3 text-sm">
          {product.salePrice ? (
            <>
              <span className="line-through text-[#9A9A96]">₹{product.price}</span>
              <span className="text-[#F2C230] font-bold">₹{product.salePrice}</span>
            </>
          ) : (
            <span className="font-bold text-[#F2F2EF]">₹{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
