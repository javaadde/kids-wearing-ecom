"use client";

import { motion } from "framer-motion";
import Link from "next/link";
const categories = [
  { label: "All", href: "/shop", color: "bg-ink text-cream-50" },
  { label: "Boys", href: "/shop?category=boys", color: "bg-denim/20 text-denim" },
  { label: "Girls", href: "/shop?category=girls", color: "bg-camel/20 text-bark" },
  { label: "Infants", href: "/shop?category=infants", color: "bg-rust/10 text-rust" },
  { label: "Summer", href: "/shop?season=summer", color: "bg-cream-300 text-ink" },
  { label: "Winter", href: "/shop?season=winter", color: "bg-cream-300 text-ink" },
  { label: "New Arrivals", href: "/shop?filter=newArrival", color: "bg-ink/5 text-ink" },
  { label: "Sale", href: "/shop?filter=sale", color: "bg-rust text-white" },
];

export default function CategoryStrip() {
  return (
    <section className="py-8 px-4">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-label mb-4"
      >
        Browse by
      </motion.p>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Link
              href={cat.href}
              className={`
                flex-shrink-0 px-4 py-2.5 rounded-full font-display font-semibold text-xs
                tracking-wide whitespace-nowrap transition-all duration-200 min-h-[40px]
                flex items-center hover:opacity-80 ${cat.color}
              `}
            >
              {cat.label}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
