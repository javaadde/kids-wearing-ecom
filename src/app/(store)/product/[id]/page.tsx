"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBag, ChevronLeft, ChevronRight, Heart, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import SizeSelector from "@/components/store/SizeSelector";
import ProductCard from "@/components/store/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import Link from "next/link";

type AddState = "idle" | "adding" | "done";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [addState, setAddState] = useState<AddState>("idle");
  const [sizeError, setSizeError] = useState(false);
  
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (data?.product) {
          setProduct(data.product);
          // Fetch related products (same category)
          const relRes = await fetch(`/api/products?category=${data.product.category}`);
          const relData = await relRes.json();
          setRelated(relData.products?.filter((p: Product) => p._id !== id).slice(0, 4) || []);
        } else {
          router.push("/shop");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  if (loading || !product) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-ink-faint" size={40} />
        <p className="font-display font-bold text-ink-muted uppercase tracking-widest text-xs">Curating Details</p>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];

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
    <div className="pt-16 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto py-6 flex items-center gap-2">
        <Link href="/shop" className="text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors font-bold flex items-center gap-1.5">
          <ChevronLeft size={10} strokeWidth={3} /> Back to Shop
        </Link>
        <span className="text-ink-faint text-xs">/</span>
        <span className="text-[10px] uppercase tracking-widest text-ink font-bold truncate">{product.name}</span>
      </div>

      <div className="px-4 md:px-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16">
        {/* Image carousel */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-cream-200 rounded-3xl overflow-hidden border border-cream-300 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {images[currentImg] ? (
                  <Image 
                    src={images[currentImg]} 
                    alt={product.name} 
                    fill 
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-cream-100 text-ink-faint">
                    <ImageIcon size={48} strokeWidth={1} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image Available</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImg((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all text-ink shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImg((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all text-ink shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImg ? "bg-white w-5" : "bg-white/40"}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`relative flex-shrink-0 w-24 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all ${
                    i === currentImg ? "border-ink shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col h-full pt-4">
          <div className="flex-1 space-y-8">
            {/* Tags */}
            <div className="flex gap-2.5 flex-wrap">
              {product.newArrival && (
                <span className="bg-ink text-cream-50 text-[10px] font-display font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg shadow-ink/20">
                  New Collection
                </span>
              )}
              <span className="bg-cream-200 text-ink-muted text-[10px] font-display font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
                {product.category}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="editorial-heading text-3xl md:text-5xl text-ink leading-[1.1]">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="font-display font-black text-3xl text-ink">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg text-ink-faint line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-display font-black text-rust bg-rust/10 px-2 py-0.5 rounded uppercase tracking-wider">
                      {discount}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="section-label">Journal</p>
              <p className="text-base text-ink-muted leading-relaxed font-medium">
                {product.description || "Curated for the modern wardrobe. This piece blends editorial style with everyday comfort, using premium materials and a children-first design philosophy."}
              </p>
            </div>

            {/* Size selector */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <p className="section-label">Select Size</p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-ink-muted underline">Size Guide</button>
              </div>
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onSelect={(size) => { setSelectedSize(size); setSizeError(false); }}
              />
              <AnimatePresence>
                {sizeError && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] uppercase font-black tracking-widest text-rust"
                  >
                    Please select a size to continue
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Add to cart */}
            <div className="flex gap-4 pt-6">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={addState !== "idle"}
                className={`flex-1 h-16 rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  addState === "done" 
                    ? "bg-green-700 text-white" 
                    : "bg-ink text-cream-50 hover:bg-ink-light"
                }`}
              >
                <AnimatePresence mode="wait">
                  {addState === "idle" && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                      <ShoppingBag size={18} /> Add to Bag
                    </motion.span>
                  )}
                  {addState === "adding" && (
                    <motion.div key="adding" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                  )}
                  {addState === "done" && (
                    <motion.span key="done" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      Successfully Added
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 flex items-center justify-center border border-cream-300 rounded-2xl hover:bg-cream-100 transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
              </motion.button>
            </div>
          </div>

          {/* Details list */}
          <div className="bg-white/50 border border-cream-200 rounded-3xl p-6 mt-12 grid grid-cols-2 gap-y-6 gap-x-8">
            {[
              { label: "Fabric", value: "Premium Blend" },
              { label: "Cut", value: "Editorial Fit" },
              { label: "Care", value: "Handle with Care" },
              { label: "Status", value: "In Stock" },
            ].map((d) => (
              <div key={d.label}>
                <p className="text-[9px] uppercase font-black tracking-[0.15em] text-ink-faint mb-1">{d.label}</p>
                <p className="text-xs font-bold text-ink">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="px-4 md:px-12 max-w-7xl mx-auto py-24 mt-12 border-t border-cream-300">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-2">Complete the look</p>
              <h2 className="editorial-heading text-3xl md:text-4xl text-ink">
                You May Also Like
              </h2>
            </div>
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-ink-muted hover:text-ink transition-colors pb-1 border-b border-cream-300">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
