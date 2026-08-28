"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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

const CATEGORIES = ["All", "Graphic Tees", "Oversized Fits", "Limited Drops", "Music Collab Series"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "All") params.set("category", activeCategory);
    params.set("sort", activeSort);

    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, activeSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 text-[#F2F2EF]">
            Archive
          </h1>
          <p className="text-[#9A9A96] font-medium">
            {loading ? "Loading frequencies..." : `Showing ${products.length} frequencies.`}
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button
            className="md:hidden flex-1 bg-[#161617] border border-[#333] px-4 py-3 flex justify-between items-center text-[#F2F2EF]"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span className="font-bold uppercase text-sm">Filter</span>
            <Filter size={16} />
          </button>

          <div className="relative flex-1 md:w-52">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="w-full bg-[#161617] border border-[#333] px-4 py-3 appearance-none font-bold uppercase text-sm text-[#F2F2EF] focus:outline-none focus:border-[#5FA83D] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9A9A96]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className={`md:w-56 flex-shrink-0 ${isFilterOpen ? "block" : "hidden md:block"}`}>
          <div className="sticky top-28">
            <h3 className="font-bold uppercase tracking-wider mb-4 border-b border-[#333] pb-2 text-[#5FA83D]">
              Categories
            </h3>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`uppercase text-sm font-bold tracking-wide transition-colors ${
                      activeCategory === cat ? "text-[#F2F2EF]" : "text-[#9A9A96] hover:text-[#F2F2EF]"
                    }`}
                  >
                    {activeCategory === cat && <span className="text-[#5FA83D] mr-2">›</span>}
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] border border-[#222] skeleton-shimmer" />
                ))}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="py-20 text-center text-[#9A9A96] font-bold uppercase"
              >
                No signal found for this category.
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-${activeSort}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <ProductCard product={{ ...product, id: product._id }} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
