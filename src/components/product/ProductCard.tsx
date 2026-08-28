"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { motion, useMotionValue, useSpring, useReducedMotion, useMotionTemplate } from "motion/react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useFinePointer } from "@/hooks/use-fine-pointer";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

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
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const isFinePointer = useFinePointer();
  const prefersReducedMotion = useReducedMotion();
  const tiltEnabled = isFinePointer && !prefersReducedMotion;

  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const liftY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springRotateX = useSpring(rotateXValue, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateYValue, { stiffness: 200, damping: 20 });
  const springLiftY = useSpring(liftY, { stiffness: 250, damping: 22 });
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.10), transparent 55%)`;

  const productLink = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;
  const primaryImage = product.images?.[0] || product.image || null;
  const secondaryImage = product.images?.[1] || null;

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYValue.set(px * 10);
    rotateXValue.set(py * -10);
    liftY.set(-4);
    glareX.set((px + 0.5) * 100);
    glareY.set((py + 0.5) * 100);
  };
  const handleImageMouseLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
    liftY.set(0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => {
        setShowLoginPrompt(false);
        router.push("/login");
      }, 1500);
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
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Link href={productLink} className="group block relative">
      {/* Image Container */}
      <motion.div
        ref={imageRef}
        onMouseMove={tiltEnabled ? handleImageMouseMove : undefined}
        onMouseLeave={tiltEnabled ? handleImageMouseLeave : undefined}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          y: springLiftY,
          transformPerspective: 600,
        }}
        className="relative aspect-[4/5] bg-[#161617] overflow-hidden mb-4 border border-[#222] group-hover:border-[#5FA83D] group-hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow] duration-300"
      >
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[#333] text-sm transform group-hover:scale-105 transition-transform duration-500">
          {primaryImage && !primaryImage.includes("placeholder") ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
              {secondaryImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={secondaryImage}
                  alt={`${product.name} alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              )}
            </>
          ) : (
            <span className="group-hover:text-[#5FA83D] transition-colors">[{product.name}]</span>
          )}
        </div>

        {/* Cursor glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[5]"
          style={{ background: glareBackground }}
        />

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
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-white text-black font-bold uppercase text-xs py-3 hover:bg-[#5FA83D] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <motion.span
              key={justAdded ? "added" : "idle"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center gap-2"
            >
              {justAdded ? <Check size={14} /> : <ShoppingCart size={14} />}
              {justAdded ? "Added" : "Add"}
            </motion.span>
          </motion.button>
          <button className="w-10 h-10 bg-[#222] text-white flex items-center justify-center hover:bg-[#F2C230] hover:text-black transition-colors">
            <Heart size={16} />
          </button>
        </div>
      </motion.div>

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
      <LoginPrompt show={showLoginPrompt} />
    </Link>
  );
}
