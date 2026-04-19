"use client";

import { motion } from "framer-motion";
import { MessageCircle, ExternalLink, Smartphone } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="max-w-6xl mx-auto pt-14 md:pt-0">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="editorial-heading text-2xl md:text-3xl mb-2"
      >
        Orders
      </motion.h1>
      <p className="text-ink-muted text-sm font-medium mb-8">
        All orders are managed via WhatsApp
      </p>

      {/* WhatsApp Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden"
      >
        <div className="px-6 py-8 md:py-16 flex flex-col items-center text-center space-y-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center"
          >
            <MessageCircle size={44} className="text-green-500" />
          </motion.div>

          <div className="space-y-3 max-w-lg">
            <h2 className="font-display font-black text-xl md:text-2xl text-ink">
              Orders Come to Your WhatsApp
            </h2>
            <p className="text-base text-ink-muted font-medium leading-relaxed">
              When customers place an order on the website, a WhatsApp message is
              automatically composed with all the order details — including product
              name, category, size, quantity, delivery address, and contact
              information.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {[
              {
                step: "01",
                title: "Customer Shops",
                desc: "Browses products, selects size & quantity",
              },
              {
                step: "02",
                title: "Fills Details",
                desc: "Enters name, phone, address & Kerala status",
              },
              {
                step: "03",
                title: "WhatsApp Opens",
                desc: "Pre-filled message sent to your number",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="bg-cream-100 border border-cream-200 rounded-2xl p-5 text-left"
              >
                <p className="text-[10px] font-black text-green-500 tracking-widest mb-2">
                  STEP {item.step}
                </p>
                <p className="font-display font-bold text-sm text-ink mb-1">
                  {item.title}
                </p>
                <p className="text-xs text-ink-muted font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* WhatsApp number */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-green-50 border border-green-200 rounded-2xl px-8 py-5 space-y-2"
          >
            <div className="flex items-center gap-2 justify-center">
              <Smartphone size={14} className="text-green-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-green-700">
                Connected Number
              </p>
            </div>
            <p className="font-display font-black text-2xl text-green-700">
              +91 7593073393
            </p>
          </motion.div>

          <a
            href="https://wa.me/917593073393"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-display font-black text-sm uppercase tracking-wider transition-colors shadow-lg shadow-green-500/20"
          >
            <MessageCircle size={18} />
            Open WhatsApp
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
