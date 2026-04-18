"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((data) => {
        if (data?.products) setProducts(data.products);
      })
      .catch((err) => console.error("Error fetching featured products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-2"
          >
            Curated for you
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="editorial-heading text-3xl md:text-4xl"
          >
            Featured
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/shop"
            className="font-display font-semibold text-xs text-ink-muted hover:text-ink transition-colors tracking-wide uppercase"
          >
            View All →
          </Link>
        </motion.div>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-ink-faint" size={32} />
          <p className="text-sm font-medium text-ink-muted">Loading curated styles...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-cream-50 rounded-2xl border-2 border-dashed border-cream-200">
          <p className="font-display font-semibold text-ink-muted">Our collection is refreshing. Check back soon!</p>
        </div>
      )}
    </section>
  );
}
