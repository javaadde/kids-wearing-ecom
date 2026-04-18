"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

export default function NewArrivalsBanner() {
  const [latest, setLatest] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  useEffect(() => {
    fetch("/api/products?limit=5")
      .then((r) => r.json())
      .then((data) => {
        if (data?.products) setLatest(data.products);
      })
      .catch(() => {});
  }, []);

  const bgColors = ["#E8E3DB", "#D9E4EE", "#E8DDD3", "#EBE8E0", "#DDE4DB"];

  return (
    <section ref={ref} className="py-24 overflow-hidden bg-cream-50/50">
      {/* Section header */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto mb-12 flex items-end justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-2"
          >
            Just Landed
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="editorial-heading text-4xl md:text-5xl"
          >
            Latest Drops
          </motion.h2>
        </div>
        <Link
          href="/shop?filter=newArrival"
          className="text-[10px] font-black uppercase tracking-widest text-ink-muted hover:text-ink transition-colors pb-1 border-b border-ink/20"
        >
          Explore All →
        </Link>
      </div>

      {/* Horizontal scroll band */}
      <motion.div style={{ x }} className="flex gap-6 px-4 md:px-12 w-max">
        {latest.length > 0 ? (
          latest.map((product, i) => (
            <Link href={`/product/${product._id}`} key={product._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex-shrink-0 w-64 md:w-80 group cursor-pointer"
              >
                {/* Outfit card */}
                <div
                  className="aspect-[4/5] rounded-3xl mb-6 relative overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ backgroundColor: bgColors[i % bgColors.length] }}
                >
                  {product.images?.[0] ? (
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink/20">
                      <span className="font-display font-black text-4xl">DROP</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Label below – editorial style */}
                <div className="pt-2">
                  <p className="font-display font-black text-lg text-ink group-hover:underline underline-offset-4 decoration-1">{product.name}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-ink-muted mt-1 opacity-70">
                    {product.category} · {product.season}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          // Placeholder skeleton
          [1, 2, 3, 4, 5].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 md:w-80 h-[400px] bg-cream-200 rounded-3xl animate-pulse" />
          ))
        )}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-20 px-4 md:px-12 max-w-7xl mx-auto"
      >
        <div className="bg-ink rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 overflow-hidden relative">
          <div className="relative z-10">
            <p className="section-label text-camel mb-3 tracking-[0.3em]">Season Premiere</p>
            <h3 className="editorial-heading text-4xl md:text-6xl text-cream-50 max-w-xl leading-tight">
              Curated for the Next Generation
            </h3>
            <p className="text-cream-300/80 text-base md:text-lg mt-4 font-medium max-w-md">
              A collection defined by minimalist silhouettes and premium organic fabrics.
            </p>
          </div>
          <Link href="/shop" className="group relative z-10 inline-flex h-16 items-center justify-center rounded-full bg-cream-50 px-10 text-[11px] font-black uppercase tracking-[0.2em] text-ink transition-all hover:bg-camel hover:scale-105 active:scale-95">
            Shop Collection
          </Link>
          
          {/* Decorative element */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 border-[40px] border-white/5 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
