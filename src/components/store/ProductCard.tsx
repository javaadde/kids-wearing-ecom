"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface Props {
  product: Product;
  index?: number;
}

export const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ProductCard({ product, index = 0 }: Props) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const availableSizes = product.sizes.filter((s) => s.stock > 0);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/product/${product._id}`} className="block">
        {/* Image */}
        <div className="img-zoom relative aspect-[3/4] bg-cream-200 rounded-xl overflow-hidden mb-3">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-cream-300 flex items-center justify-center">
              <span className="text-ink-faint text-xs font-medium">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.newArrival && (
              <span className="bg-ink text-cream-50 text-[9px] font-display font-black tracking-wider uppercase px-2 py-0.5 rounded">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="bg-rust text-white text-[9px] font-display font-black tracking-wider uppercase px-2 py-0.5 rounded">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1 px-0.5">
          <h3 className="font-display font-semibold text-sm text-ink leading-snug line-clamp-2 group-hover:text-ink-light transition-colors">
            {product.name}
          </h3>

          {/* Size availability dots */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.sizes.map((s) => (
              <span
                key={s.size}
                className="text-[9px] font-display font-bold tracking-wide"
                title={`${s.size}: ${s.stock > 0 ? "In stock" : "Out of stock"}`}
              >
                <span
                  className={`size-dot mr-0.5 ${
                    s.stock > 0 ? "bg-ink" : "bg-ink-faint"
                  }`}
                />
              </span>
            ))}
            {availableSizes.length === 0 && (
              <span className="text-[9px] text-rust font-semibold">Sold Out</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-sm text-ink">
              ₹{product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="font-display text-xs text-ink-faint line-through">
                ₹{product.originalPrice!.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
