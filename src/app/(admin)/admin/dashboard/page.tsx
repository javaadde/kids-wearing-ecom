"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";

interface DashboardStats {
  totalProducts: number;
  lowStock: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      const products = data.products || [];

      // Calculate low stock (products where any size has stock <= 5)
      const lowStockCount = products.filter(
        (p: { sizes: { stock: number }[] }) =>
          p.sizes?.some((s: { stock: number }) => s.stock <= 5)
      ).length;

      setStats({
        totalProducts: products.length,
        lowStock: lowStockCount,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="max-w-6xl mx-auto pt-14 md:pt-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="editorial-heading text-2xl md:text-3xl mb-2">Dashboard</h1>
        <p className="text-ink-muted text-sm font-medium mb-8">Welcome back, Admin 👋</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard
          label="Products"
          value={loading ? 0 : stats.totalProducts}
          icon={<ShoppingBag size={20} />}
          color="bg-ink"
          textColor="text-cream-50"
          delay={0}
        />
        <StatsCard
          label="Low Stock"
          value={loading ? 0 : stats.lowStock}
          icon={<AlertTriangle size={20} />}
          color="bg-rust"
          textColor="text-white"
          delay={0.1}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-green-500 text-white rounded-2xl p-5 space-y-3 col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-display font-semibold tracking-widest uppercase opacity-70">
              Orders
            </p>
            <div className="opacity-60">
              <MessageCircle size={20} />
            </div>
          </div>
          <p className="font-display font-black text-lg leading-none">Via WhatsApp</p>
        </motion.div>
      </div>

      {/* WhatsApp Orders Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-cream-300">
          <h2 className="font-display font-black text-base flex items-center gap-2">
            <MessageCircle size={16} className="text-green-500" />
            Order Management
          </h2>
        </div>

        <div className="px-6 py-8 flex flex-col items-center text-center space-y-6">
          {/* WhatsApp icon */}
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
            <MessageCircle size={36} className="text-green-500" />
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="font-display font-black text-lg text-ink">
              Orders arrive via WhatsApp
            </h3>
            <p className="text-sm text-ink-muted font-medium leading-relaxed">
              Customers place orders directly through WhatsApp. All order details including item info, sizes, quantities, and delivery addresses are sent to your WhatsApp number.
            </p>
          </div>

          <div className="bg-cream-100 border border-cream-200 rounded-2xl px-6 py-4 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-faint">
              WhatsApp Number
            </p>
            <p className="font-display font-black text-lg text-ink">+91 7593073393</p>
          </div>

          <a
            href="https://wa.me/917593073393"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-display font-bold text-sm transition-colors shadow-lg shadow-green-500/20"
          >
            Open WhatsApp
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
      >
        <Link
          href="/admin/products"
          className="flex items-center gap-4 bg-cream-50 border border-cream-300 rounded-2xl p-5 hover:border-ink transition-colors group"
        >
          <div className="w-12 h-12 bg-cream-200 rounded-xl flex items-center justify-center group-hover:bg-ink group-hover:text-cream-50 transition-colors">
            <Package size={20} />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-ink">Manage Products</p>
            <p className="text-xs text-ink-muted mt-0.5">Add, edit, or remove products</p>
          </div>
        </Link>

        <Link
          href="/admin/collections"
          className="flex items-center gap-4 bg-cream-50 border border-cream-300 rounded-2xl p-5 hover:border-ink transition-colors group"
        >
          <div className="w-12 h-12 bg-cream-200 rounded-xl flex items-center justify-center group-hover:bg-ink group-hover:text-cream-50 transition-colors">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-ink">Manage Collections</p>
            <p className="text-xs text-ink-muted mt-0.5">Organize your product collections</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
