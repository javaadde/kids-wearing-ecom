"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import { Product } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";

const MOCK_PRODUCTS: Product[] = [
  { _id: "1", name: "Striped Cotton T-Shirt", slug: "1", category: "boys", season: "summer", price: 849, originalPrice: 1199, description: "", images: [], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 10 }, { size: "M", stock: 0 }, { size: "L", stock: 0 }], featured: true, newArrival: true, tags: [], createdAt: "", updatedAt: "" },
  { _id: "2", name: "Wide-Leg Denim Pants", slug: "2", category: "girls", season: "all", price: 1299, description: "", images: [], sizes: [{ size: "XS", stock: 2 }, { size: "S", stock: 8 }, { size: "M", stock: 6 }, { size: "L", stock: 4 }], featured: true, newArrival: false, tags: [], createdAt: "", updatedAt: "" },
  { _id: "3", name: "Linen Bucket Hat", slug: "3", category: "unisex", season: "summer", price: 499, description: "", images: [], sizes: [{ size: "One Size", stock: 15 }], featured: true, newArrival: true, tags: [], createdAt: "", updatedAt: "" },
  { _id: "4", name: "Puff Sleeve Blouse", slug: "4", category: "girls", season: "all", price: 999, originalPrice: 1399, description: "", images: [], sizes: [{ size: "XS", stock: 0 }, { size: "S", stock: 4 }, { size: "M", stock: 7 }, { size: "L", stock: 2 }], featured: true, newArrival: false, tags: [], createdAt: "", updatedAt: "" },
  { _id: "5", name: "Cargo Joggers", slug: "5", category: "boys", season: "all", price: 1099, description: "", images: [], sizes: [{ size: "S", stock: 3 }, { size: "M", stock: 6 }, { size: "L", stock: 4 }], featured: false, newArrival: true, tags: [], createdAt: "", updatedAt: "" },
  { _id: "6", name: "Denim Jacket", slug: "6", category: "boys", season: "all", price: 1899, description: "", images: [], sizes: [{ size: "XS", stock: 0 }, { size: "S", stock: 2 }, { size: "M", stock: 5 }], featured: false, newArrival: true, tags: [], createdAt: "", updatedAt: "" },
  { _id: "7", name: "Floral Midi Dress", slug: "7", category: "girls", season: "summer", price: 1199, description: "", images: [], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 1 }, { size: "M", stock: 0 }], featured: false, newArrival: false, tags: [], createdAt: "", updatedAt: "" },
  { _id: "8", name: "Infant Romper Set", slug: "8", category: "infants", season: "summer", price: 749, description: "", images: [], sizes: [{ size: "3M", stock: 5 }, { size: "6M", stock: 8 }, { size: "12M", stock: 3 }], featured: false, newArrival: true, tags: [], createdAt: "", updatedAt: "" },
];

const CATEGORIES = ["all", "boys", "girls", "infants", "unisex"];
const SEASONS = ["all", "summer", "winter"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filtered, setFiltered] = useState<Product[]>(MOCK_PRODUCTS);
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [season, setSeason] = useState(searchParams.get("season") || "all");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let result = [...products];
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (season !== "all") result = result.filter((p) => p.season === season || p.season === "all");
    if (searchParams.get("filter") === "newArrival") result = result.filter((p) => p.newArrival);
    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    setFiltered(result);
  }, [category, season, sort, searchParams, products]);

  return (
    <div className="min-h-screen pt-20">
      {/* Page header */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto py-8 border-b border-cream-300">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-label mb-1"
        >
          {filtered.length} Products
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="editorial-heading text-3xl md:text-5xl"
        >
          {category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>
      </div>

      <div className="px-4 md:px-12 max-w-7xl mx-auto py-6">
        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar pb-1">
          {/* Category pills */}
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-display font-semibold text-xs tracking-wide border transition-all ${
                category === cat
                  ? "bg-ink text-cream-50 border-ink"
                  : "bg-transparent text-ink-muted border-cream-300 hover:border-ink"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}

          <div className="w-px h-6 bg-cream-300 flex-shrink-0" />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-shrink-0 px-3 py-2 rounded-full font-display font-semibold text-xs border border-cream-300 bg-transparent text-ink focus:outline-none focus:border-ink cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${category}-${season}-${sort}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-display font-semibold text-ink-muted text-lg">No products found</p>
            <button onClick={() => { setCategory("all"); setSeason("all"); }} className="btn-outline mt-6 mx-auto">
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
