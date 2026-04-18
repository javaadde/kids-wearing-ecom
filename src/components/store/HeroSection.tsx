"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function AnimatedWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden">
      {word.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden bg-[#EDECEA]">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-camel/15 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-denim/10 via-transparent to-transparent" />
      </div>

      {/* Mobile Video Background */}
      <div className="absolute inset-0 md:hidden z-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-80 object-center" 
        >
          <source src="/images/inspirations/downloaded-file.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#EDECEA] via-[#EDECEA]/30 to-transparent" />
      </div>

      {/* Editorial grid background lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #1A1A1A 0, #1A1A1A 1px, transparent 0, transparent 50%)",
          backgroundSize: "80px 100%",
        }}
      />

      {/* Floating season tag */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute top-24 left-4 md:left-12 flex items-center gap-2"
      >
        <span className="w-8 h-px bg-ink-muted" />
        <span className="section-label">SS 2025 Collection</span>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 px-4 md:px-12 pb-24 md:pb-20 max-w-7xl mx-auto w-full">
        {/* Category label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="section-label mb-6"
        >
          Boys &amp; Girls · Infant to 14Y
        </motion.p>

        {/* Hero headline */}
        <h1 className="editorial-heading text-[14vw] md:text-[9vw] leading-[0.9] mb-8">
          <div className="flex flex-wrap gap-x-4">
            <AnimatedWord word="KIDO" delay={0.1} />
            <AnimatedWord word="STUDIO" delay={0.35} />
          </div>
          <div className="flex flex-wrap gap-x-4 items-baseline mt-2">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block text-[8vw] md:text-[5vw] font-display font-light italic text-ink-muted tracking-wide normal-case"
            >
              freshly curated for
            </motion.span>
          </div>
          <div>
            <motion.span
              initial={{ opacity: 0, skewX: -4 }}
              animate={{ opacity: 1, skewX: 0 }}
              transition={{ delay: 1.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block text-camel"
            >
              cool kids
            </motion.span>
          </div>
        </h1>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Link href="/shop" className="btn-primary group">
            <span>Shop Now</span>
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </Link>
          <Link
            href="/shop?filter=newArrival"
            className="font-display font-semibold text-sm text-ink-muted hover:text-ink transition-colors flex items-center gap-2 px-2 py-3"
          >
            New Arrivals →
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-20 right-4 md:right-12 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-ink to-transparent"
        />
        <span className="section-label" style={{ writingMode: "vertical-rl" }}>
          Scroll
        </span>
      </motion.div>

    </section>
  );
}
