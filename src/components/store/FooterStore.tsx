"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, X } from "lucide-react";

export default function FooterStore() {
  return (
    <footer className="bg-ink text-cream-200 py-16 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="font-display font-black text-2xl text-cream-50 tracking-tight">
              KIDO<span className="text-camel">.</span>
            </Link>
            <p className="text-sm text-cream-300 mt-3 leading-relaxed font-medium">
              Editorial kids fashion for the coolest little humans. Clean, modern, and effortlessly stylish.
            </p>
            <div className="flex gap-4 mt-5">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-9 h-9 bg-cream-50/10 rounded-full flex items-center justify-center hover:bg-camel/30 transition-colors"
              >
                <Camera size={15} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-9 h-9 bg-cream-50/10 rounded-full flex items-center justify-center hover:bg-camel/30 transition-colors"
              >
                <X size={15} />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Shop",
                links: ["All Products", "Boys", "Girls", "Infants", "Sale"],
              },
              {
                title: "Help",
                links: ["Size Guide", "Returns", "Track Order", "Contact"],
              },
              {
                title: "Brand",
                links: ["About Us", "Sustainability", "Careers", "Press"],
              },
            ].map((group) => (
              <div key={group.title}>
                <p className="font-display font-black text-xs tracking-widest uppercase text-cream-50 mb-4">
                  {group.title}
                </p>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-cream-300 hover:text-cream-50 transition-colors font-medium"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream-50/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream-300/60 font-medium">
            © 2025 Kido Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((item) => (
              <Link key={item} href="#" className="text-xs text-cream-300/60 hover:text-cream-300 transition-colors font-medium">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
