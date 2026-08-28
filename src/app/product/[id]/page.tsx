"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useFinePointer } from "@/hooks/use-fine-pointer";
import ProductCard from "@/components/product/ProductCard";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  description: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  numReviews: number;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const imageRef = useRef<HTMLDivElement>(null);
  const isFinePointer = useFinePointer();
  const prefersReducedMotion = useReducedMotion();
  const tiltEnabled = isFinePointer && !prefersReducedMotion;

  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const springRotateX = useSpring(rotateXValue, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateYValue, { stiffness: 200, damping: 20 });

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYValue.set(px * 8);
    rotateXValue.set(py * -8);
  };
  const handleImageMouseLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product);
          setSelectedSize(data.product.sizes[0] || "");
          setSelectedColor(data.product.colors[0] || "");
          // Fetch related products
          return fetch(`/api/products?category=${encodeURIComponent(data.product.category)}`);
        }
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data?.success) {
          setRelated(data.products.filter((p: Product) => p._id !== product?._id).slice(0, 4));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginPrompt(true);
      router.push("/login");
      return;
    }
    if (!product) return;
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0] || "",
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 aspect-[4/5] border border-[#333] skeleton-shimmer" />
          <div className="lg:w-1/2 space-y-6 pt-8">
            <div className="h-8 w-1/2 rounded skeleton-shimmer" />
            <div className="h-12 w-3/4 rounded skeleton-shimmer" />
            <div className="h-6 w-1/4 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-[#F2F2EF]">404: Signal Lost</h1>
        <p className="text-[#9A9A96] mb-8">This anomaly does not exist in the database.</p>
        <button onClick={() => router.push("/shop")} className="bg-[#5FA83D] text-black font-bold uppercase px-8 py-4 hover:bg-[#F2C230] transition-colors">
          Return to Grid
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-24">
        {/* Image Gallery */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <motion.div
            ref={imageRef}
            onMouseMove={tiltEnabled ? handleImageMouseMove : undefined}
            onMouseLeave={tiltEnabled ? handleImageMouseLeave : undefined}
            style={{
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 800,
            }}
            className="aspect-[4/5] bg-[#161617] border border-[#333] flex items-center justify-center relative overflow-hidden group hover:border-[#5FA83D] transition-colors"
          >
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(95,168,61,0.03)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
            <span className="font-mono text-[#9A9A96] group-hover:text-[#5FA83D] transition-colors text-sm">
              [{product.name}]
            </span>
            {product.salePrice && (
              <span className="absolute top-4 left-4 z-20 bg-[#F2C230] text-black text-xs font-bold uppercase px-3 py-1 tracking-wider">Sale</span>
            )}
            {product.isNew && (
              <span className="absolute top-4 right-4 z-20 bg-[#2E5E2A] text-white text-xs font-bold uppercase px-3 py-1 tracking-wider">New</span>
            )}
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-[#161617] border border-[#333] flex items-center justify-center font-mono text-[#333] text-xs hover:border-[#5FA83D] transition-colors">/alt_1</div>
            <div className="aspect-square bg-[#161617] border border-[#333] flex items-center justify-center font-mono text-[#333] text-xs hover:border-[#5FA83D] transition-colors">/alt_2</div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:w-1/2 flex flex-col pt-4 lg:pt-8">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#5FA83D]">
            {product.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-[#F2F2EF]">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-2 text-[#9A9A96] text-sm">
            <span>★ {product.rating}</span>
            <span>({product.numReviews} reviews)</span>
            <span className="ml-auto font-mono text-xs">{product.stock} units remaining</span>
          </div>

          <div className="flex items-center gap-4 text-2xl mb-8">
            {product.salePrice ? (
              <>
                <span className="line-through text-[#9A9A96] font-medium">₹{product.price}</span>
                <span className="text-[#F2C230] font-black">₹{product.salePrice}</span>
              </>
            ) : (
              <span className="font-black text-[#F2F2EF]">₹{product.price}</span>
            )}
          </div>

          <p className="text-[#9A9A96] mb-10 leading-relaxed">{product.description}</p>

          {/* Color */}
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="font-bold uppercase text-sm text-[#F2F2EF]">Color</span>
              <span className="text-[#9A9A96] text-sm uppercase">{selectedColor}</span>
            </div>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  className={`w-10 h-10 border-2 transition-colors relative overflow-hidden ${
                    selectedColor === color ? "border-[#5FA83D]" : "border-[#333] hover:border-[#666]"
                  }`}
                >
                  <span className="absolute inset-1" style={{
                    backgroundColor:
                      color.toLowerCase().includes("black") ? "#111" :
                      color.toLowerCase().includes("white") ? "#eee" :
                      color.toLowerCase().includes("green") ? "#5FA83D" :
                      color.toLowerCase().includes("yellow") ? "#F2C230" : color,
                  }} />
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-10">
            <div className="flex justify-between mb-3">
              <span className="font-bold uppercase text-sm text-[#F2F2EF]">Size</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-12 flex items-center justify-center font-bold uppercase border-2 transition-colors text-sm ${
                    selectedSize === size
                      ? "border-[#5FA83D] text-[#5FA83D]"
                      : "border-[#333] text-[#F2F2EF] hover:border-[#666]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + CTA */}
          <div className="flex gap-4 mb-12">
            <div className="flex items-center border-2 border-[#333] px-2 w-32">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#9A9A96] hover:text-white flex-1 py-4 text-center font-bold">-</button>
              <span className="font-bold w-8 text-center text-[#F2F2EF]">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-[#9A9A96] hover:text-white flex-1 py-4 text-center font-bold">+</button>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-transparent border-2 border-[#F2F2EF] text-[#F2F2EF] font-black uppercase py-4 hover:bg-[#F2F2EF] hover:text-[#0B0B0C] transition-colors flex items-center justify-center gap-2"
              >
                <motion.span
                  key={justAdded ? "added" : "idle"}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="flex items-center gap-2"
                >
                  {justAdded && <Check size={18} />}
                  {justAdded ? "Added To Bag" : "Add To Bag"}
                </motion.span>
              </motion.button>
              <button onClick={handleBuyNow} className="w-full bg-[#2E5E2A] text-white font-black uppercase py-4 hover:bg-[#5FA83D] transition-colors">
                Buy It Now
              </button>
            </div>
          </div>

          <div className="border-t border-[#222] pt-6 font-mono text-xs text-[#9A9A96] space-y-2 uppercase">
            <p>&gt; Free shipping on orders over ₹3000.</p>
            <p>&gt; Dispatch within 24–48 hours.</p>
            <p>&gt; Returns accepted within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[#222] pt-20">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 text-[#F2F2EF]">Similar Anomalies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {related.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <ProductCard product={{ ...p, id: p._id }} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
      <LoginPrompt show={showLoginPrompt} />
    </div>
  );
}
