"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { ShoppingBag, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import SizeSelector from "@/components/store/SizeSelector";
import ProductCard from "@/components/store/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import Link from "next/link";

// Mock product for demo
const MOCK: Product = {
  _id: "1",
  name: "Striped Cotton T-Shirt",
  slug: "striped-cotton-tshirt",
  category: "boys",
  season: "summer",
  price: 849,
  originalPrice: 1199,
  description:
    "An essential piece re-imagined for the cool kid. Crafted in 100% breathable cotton with classic black-and-white stripes. Relaxed fit, easy care. Perfect for outdoor play, school, or weekend adventures.",
  images: [],
  sizes: [
    { size: "XS", stock: 5 },
    { size: "S", stock: 10 },
    { size: "M", stock: 3 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
  ],
  featured: true,
  newArrival: true,
  tags: ["summer", "boys", "essentials"],
  createdAt: "",
  updatedAt: "",
};

const RELATED: Product[] = [
  { _id: "5", name: "Cargo Joggers", slug: "5", category: "boys", season: "all", price: 1099, description: "", images: [], sizes: [{ size: "S", stock: 3 }, { size: "M", stock: 6 }], featured: false, newArrival: true, tags: [], createdAt: "", updatedAt: "" },
  { _id: "6", name: "Denim Jacket", slug: "6", category: "boys", season: "all", price: 1899, description: "", images: [], sizes: [{ size: "S", stock: 2 }, { size: "M", stock: 5 }], featured: false, newArrival: true, tags: [], createdAt: "", updatedAt: "" },
  { _id: "3", name: "Linen Bucket Hat", slug: "3", category: "unisex", season: "summer", price: 499, description: "", images: [], sizes: [{ size: "One Size", stock: 15 }], featured: true, newArrival: true, tags: [], createdAt: "", updatedAt: "" },
];

type AddState = "idle" | "adding" | "done";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product>(MOCK);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [addState, setAddState] = useState<AddState>("idle");
  const [sizeError, setSizeError] = useState(false);
  const { addItem, openCart } = useCartStore();
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data?.product) setProduct(data.product); })
      .catch(() => {});
  }, [id]);

  const images = product.images.length > 0
    ? product.images
    : ["/placeholder-1.jpg", "/placeholder-2.jpg"];

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    setAddState("adding");
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      size: selectedSize,
      quantity: 1,
    });
    setTimeout(() => {
      setAddState("done");
      setTimeout(() => { setAddState("idle"); openCart(); }, 800);
    }, 600);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="pt-16 min-h-screen">
      {/* Breadcrumb */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto py-4 flex items-center gap-2">
        <Link href="/shop" className="text-xs text-ink-muted hover:text-ink transition-colors font-medium flex items-center gap-1">
          <ChevronLeft size={12} /> Shop
        </Link>
        <span className="text-ink-faint text-xs">/</span>
        <span className="text-xs text-ink font-medium truncate">{product.name}</span>
      </div>

      <div className="px-4 md:px-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 pb-20">
        {/* Image carousel */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-cream-200 rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImg}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) setCurrentImg(Math.min(images.length - 1, currentImg + 1));
                  if (info.offset.x > 50) setCurrentImg(Math.max(0, currentImg - 1));
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <div className="w-full h-full bg-cream-300 flex items-center justify-center">
                  <span className="text-ink-faint text-sm font-medium">Product Image {currentImg + 1}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImg(Math.max(0, currentImg - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream-50/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-cream-50 transition-colors z-10"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentImg(Math.min(images.length - 1, currentImg + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream-50/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-cream-50 transition-colors z-10"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImg ? "bg-ink w-4" : "bg-ink/30"}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`relative flex-shrink-0 w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  i === currentImg ? "border-ink" : "border-transparent"
                }`}
              >
                <div className="w-full h-full bg-cream-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-6">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {product.newArrival && (
              <span className="bg-ink text-cream-50 text-[10px] font-display font-black tracking-widest uppercase px-3 py-1 rounded-full">
                New
              </span>
            )}
            <span className="bg-cream-200 text-ink-muted text-[10px] font-display font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
              {product.category}
            </span>
            <span className="bg-cream-200 text-ink-muted text-[10px] font-display font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
              {product.season}
            </span>
          </div>

          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-ink leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="font-display font-black text-2xl text-ink">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-display text-base text-ink-faint line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-display font-bold text-rust">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-ink-muted leading-relaxed font-medium">{product.description}</p>

          {/* Size selector */}
          <div>
            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onSelect={(size) => { setSelectedSize(size); setSizeError(false); }}
            />
            <AnimatePresence>
              {sizeError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-rust font-medium mt-2"
                >
                  Please select a size to continue
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`flex-1 btn-primary justify-center transition-colors ${
                addState === "done" ? "bg-green-800" : ""
              }`}
            >
              <AnimatePresence mode="wait">
                {addState === "idle" && (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <ShoppingBag size={16} /> Add to Bag
                  </motion.span>
                )}
                {addState === "adding" && (
                  <motion.span key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }} className="w-4 h-4 border-2 border-cream-50/40 border-t-cream-50 rounded-full" />
                    Adding...
                  </motion.span>
                )}
                {addState === "done" && (
                  <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    ✓ Added!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              className="w-14 h-14 flex items-center justify-center border border-cream-300 rounded-xl hover:border-ink transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* Details */}
          <div className="border-t border-cream-300 pt-6 space-y-3">
            {[
              { label: "Material", value: "100% Breathable Cotton" },
              { label: "Fit", value: "Relaxed / Oversized" },
              { label: "Care", value: "Machine wash cold, tumble dry low" },
              { label: "Origin", value: "Ethically made in India" },
            ].map((d) => (
              <div key={d.label} className="flex justify-between text-sm">
                <span className="text-ink-muted font-medium">{d.label}</span>
                <span className="text-ink font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto py-12 border-t border-cream-300">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="editorial-heading text-2xl md:text-3xl mb-8"
        >
          You May Also Like
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {RELATED.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </div>
    </div>
  );
}
