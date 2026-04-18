"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import { Product } from "@/types";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["all", "boys", "girls", "infants", "unisex"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [collection, setCollection] = useState(searchParams.get("collection") || "all");
  const [season, setSeason] = useState(searchParams.get("season") || "all");
  const [sort, setSort] = useState("newest");
  const [collections, setCollections] = useState<{_id: string, name: string}[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data?.products) {
          setProducts(data.products);
          setFiltered(data.products);
        }
      })
      .catch((err) => console.error("Shop fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (category === "all") {
      setCollections([]);
      setCollection("all");
      return;
    }
    fetch(`/api/collections?category=${category}`)
      .then(r => r.json())
      .then(data => {
        if (data.collections) setCollections(data.collections);
      });
  }, [category]);

  useEffect(() => {
    if (loading) return;

    let result = [...products];
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (collection !== "all") result = result.filter((p) => p.collectionName === collection);
    if (season !== "all") result = result.filter((p) => p.season === season || p.season === "all");
    if (searchParams.get("filter") === "newArrival") result = result.filter((p) => p.newArrival);
    
    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sort === "newest") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFiltered(result);
  }, [category, collection, season, sort, searchParams, products, loading]);

  return (
    <div className="min-h-screen pt-20">
      {/* Page header */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto py-8 border-b border-cream-300 transition-all">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-label mb-1"
        >
          {loading ? "..." : `${filtered.length} Products`}
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
        {/* Main Filter bar */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar pb-1">
          {/* Category pills */}
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setCategory(cat); setCollection("all"); }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-display font-semibold text-[11px] tracking-widest uppercase border transition-all ${
                category === cat
                  ? "bg-ink text-cream-50 border-ink shadow-lg shadow-ink/10"
                  : "bg-transparent text-ink-muted border-cream-300 hover:border-ink"
              }`}
            >
              {cat}
            </motion.button>
          ))}

          <div className="w-px h-6 bg-cream-300 flex-shrink-0 mx-2" />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-shrink-0 px-4 py-2.5 rounded-full font-display font-semibold text-[11px] tracking-widest uppercase border border-cream-300 bg-transparent text-ink focus:outline-none focus:border-ink cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Collections sub-filter */}
        {collections.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8 overflow-x-auto no-scrollbar py-2"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-ink/40 flex-shrink-0">Filter by Collection:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCollection("all")}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                  collection === "all" ? "bg-camel text-bark border-camel" : "bg-white text-ink-muted border-cream-200"
                }`}
              >
                All {category}
              </button>
              {collections.map((col) => (
                <button 
                  key={col._id}
                  onClick={() => setCollection(col.name)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                    collection === col.name ? "bg-camel text-bark border-camel" : "bg-white text-ink-muted border-cream-200"
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-ink-faint" size={40} />
            <p className="font-display font-bold text-ink-muted text-sm tracking-widest uppercase">Fetching Collection</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${collection}-${sort}-${filtered.length}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-cream-50 rounded-3xl border border-dashed border-cream-200"
          >
            <p className="font-display font-black text-ink text-xl">Nothing matches your selection</p>
            <p className="text-ink-muted text-sm mt-2 max-w-xs mx-auto font-medium">Try clearing your filters or exploring a different collection.</p>
            <button onClick={() => { setCategory("all"); setCollection("all"); setSeason("all"); }} className="btn-primary mt-8 mx-auto px-8 py-3 text-xs">
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-ink-faint" size={40} />
          <p className="font-display font-bold text-ink-muted uppercase tracking-widest">Entering Kido Shop</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
