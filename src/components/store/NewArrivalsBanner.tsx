"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const looks = [
  { label: "Striped T-Shirt", category: "Boys · Summer", color: "#E8E3DB" },
  { label: "Linen Wide-Leg", category: "Girls · All Season", color: "#D9E4EE" },
  { label: "Puffer Vest", category: "Unisex · Winter", color: "#E8DDD3" },
  { label: "Sailor Dress", category: "Girls · Summer", color: "#EBE8E0" },
  { label: "Cargo Joggers", category: "Boys · All Season", color: "#DDE4DB" },
];

export default function NewArrivalsBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={ref} className="py-16 overflow-hidden">
      {/* Section header */}
      <div className="px-4 max-w-7xl mx-auto mb-10 flex items-end justify-between">
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
            className="editorial-heading text-3xl md:text-4xl"
          >
            New Arrivals
          </motion.h2>
        </div>
        <Link
          href="/shop?filter=newArrival"
          className="font-display font-semibold text-xs text-ink-muted hover:text-ink transition-colors uppercase tracking-wide"
        >
          Shop All →
        </Link>
      </div>

      {/* Horizontal scroll band */}
      <motion.div style={{ x }} className="flex gap-4 px-4 md:px-12 w-max">
        {looks.map((look, i) => (
          <motion.div
            key={look.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 w-52 md:w-64"
          >
            {/* Outfit card */}
            <div
              className="aspect-[3/4] rounded-2xl mb-4 flex items-end p-4"
              style={{ backgroundColor: look.color }}
            >
              <div className="w-full h-0.5 bg-ink/10 rounded" />
            </div>
            {/* Label below – editorial style */}
            <div className="border-t border-cream-300 pt-3">
              <p className="font-display font-semibold text-sm text-ink">{look.label}</p>
              <p className="text-xs text-ink-muted mt-1 font-medium">{look.category}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 px-4 max-w-7xl mx-auto"
      >
        <div className="bg-ink rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="section-label text-cream-300 mb-2">Limited Time</p>
            <h3 className="editorial-heading text-2xl md:text-4xl text-cream-50">
              Summer Drop is Live
            </h3>
            <p className="text-cream-300 text-sm mt-2 font-medium">
              Fresh styles. Free delivery over ₹1499.
            </p>
          </div>
          <Link href="/shop?season=summer" className="btn-outline border-cream-300 text-cream-50 hover:bg-cream-50 hover:text-ink flex-shrink-0">
            Shop Summer →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
