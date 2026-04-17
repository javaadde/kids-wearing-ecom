"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";

export default function Header() {
  const { totalItems, openCart } = useCartStore();
  const count = totalItems();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-cream-50/90 backdrop-blur-xl shadow-sm" : "bg-transparent"
        }`}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-display font-black text-xl tracking-tight text-ink">
            KIDO<span className="text-camel">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["Shop", "Boys", "Girls", "Infants", "Sale"].map((item) => (
              <Link
                key={item}
                href={item === "Shop" ? "/shop" : `/shop?category=${item.toLowerCase()}`}
                className="font-display text-sm font-medium text-ink-muted hover:text-ink transition-colors tracking-wide"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={openCart}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} className="text-ink" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-rust text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Hamburger for mobile */}
            <button
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-cream-50 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {["Shop", "Boys", "Girls", "Infants", "Sale"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={item === "Shop" ? "/shop" : `/shop?category=${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="font-display font-black text-4xl text-ink tracking-tight uppercase hover:text-camel transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
