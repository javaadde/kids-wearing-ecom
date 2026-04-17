"use client";

import { motion } from "framer-motion";

const messages = [
  "Free Delivery Over ₹1499",
  "7-Day Easy Returns",
  "100% Safe & Soft Fabrics",
  "Loved by 12,000+ Families",
  "Curated by Style Experts",
  "New Drops Every Week",
  "Sizes 0–14 Years",
];

const repeated = [...messages, ...messages];

export default function TrustMarquee() {
  return (
    <section className="py-10 border-y border-cream-300 overflow-hidden">
      <div className="relative flex">
        <div className="animate-marquee flex gap-12 items-center">
          {repeated.map((msg, i) => (
            <div key={i} className="flex items-center gap-12 flex-shrink-0">
              <span className="font-display font-semibold text-sm text-ink-muted whitespace-nowrap tracking-wide">
                {msg}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-camel flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
