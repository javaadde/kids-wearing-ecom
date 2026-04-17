"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { useEffect, useState } from "react";

// Mock data for rendering without DB
const MOCK_PRODUCTS: Product[] = [
  {
    _id: "1",
    name: "Striped Cotton T-Shirt",
    slug: "striped-cotton-tshirt",
    category: "boys",
    season: "summer",
    price: 849,
    originalPrice: 1199,
    description: "Classic black-white striped tee. Breathable 100% cotton.",
    images: ["/images/450f855752707484a911f523cd8d3123.jpg"],
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 10 },
      { size: "M", stock: 3 },
      { size: "L", stock: 0 },
    ],
    featured: true,
    newArrival: true,
    tags: ["summer", "boys"],
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "2",
    name: "Wide-Leg Denim Pants",
    slug: "wide-leg-denim-pants",
    category: "girls",
    season: "all",
    price: 1299,
    description: "Relaxed wide-leg denim in washed blue. Editorial cool.",
    images: ["/images/51858d7e5b98b29701c266bd1e9dbc58.jpg"],
    sizes: [
      { size: "XS", stock: 2 },
      { size: "S", stock: 8 },
      { size: "M", stock: 6 },
      { size: "L", stock: 4 },
    ],
    featured: true,
    newArrival: false,
    tags: ["girls", "denim"],
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "3",
    name: "Linen Bucket Hat",
    slug: "linen-bucket-hat",
    category: "unisex",
    season: "summer",
    price: 499,
    description: "Sand-colored linen bucket hat. Blocks the sun in style.",
    images: ["/images/000f2dca87b9d47c69fe17cce1c4fbde.jpg"],
    sizes: [
      { size: "One Size", stock: 15 },
    ],
    featured: true,
    newArrival: true,
    tags: ["accessories", "summer"],
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "4",
    name: "Puff Sleeve Blouse",
    slug: "puff-sleeve-blouse",
    category: "girls",
    season: "all",
    price: 999,
    originalPrice: 1399,
    description: "Ivory puff-sleeve blouse with peter pan collar.",
    images: ["/images/a6d165aaa86f28d3f65d9aa0c5c2b3d1.jpg"],
    sizes: [
      { size: "XS", stock: 0 },
      { size: "S", stock: 4 },
      { size: "M", stock: 7 },
      { size: "L", stock: 2 },
    ],
    featured: true,
    newArrival: false,
    tags: ["girls", "blouse"],
    createdAt: "",
    updatedAt: "",
  },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // In production, fetch from API
  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((data) => { if (data?.products?.length) setProducts(data.products); })
      .catch(() => {}); // fallback to mock
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product._id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
