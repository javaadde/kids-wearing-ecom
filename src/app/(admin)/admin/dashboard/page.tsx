"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  const [stats] = useState({
    totalOrders: 142,
    revenue: 187540,
    products: 87,
    lowStock: 5,
  });

  const recentOrders = [
    { id: "ORD001", customer: "Priya S.", total: 2498, status: "pending", date: "Today" },
    { id: "ORD002", customer: "Rahul M.", total: 1299, status: "shipped", date: "Yesterday" },
    { id: "ORD003", customer: "Ananya K.", total: 3798, status: "delivered", date: "Apr 14" },
    { id: "ORD004", customer: "Vikram P.", total: 849, status: "processing", date: "Apr 13" },
    { id: "ORD005", customer: "Sneha R.", total: 2199, status: "cancelled", date: "Apr 12" },
  ];

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={<Package size={20} />}
          color="bg-ink"
          textColor="text-cream-50"
          delay={0}
        />
        <StatsCard
          label="Revenue"
          value={stats.revenue}
          prefix="₹"
          icon={<TrendingUp size={20} />}
          color="bg-camel"
          textColor="text-ink"
          delay={0.1}
        />
        <StatsCard
          label="Products"
          value={stats.products}
          icon={<ShoppingBag size={20} />}
          color="bg-cream-50"
          textColor="text-ink"
          delay={0.2}
        />
        <StatsCard
          label="Low Stock"
          value={stats.lowStock}
          icon={<AlertTriangle size={20} />}
          color="bg-rust"
          textColor="text-white"
          delay={0.3}
        />
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-300">
          <h2 className="font-display font-black text-base">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-display font-semibold text-ink-muted hover:text-ink transition-colors uppercase tracking-wide">
            View All →
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-display font-black tracking-widest uppercase text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="border-b border-cream-200 last:border-0 hover:bg-cream-100 transition-colors"
                >
                  <td className="px-6 py-4 font-display font-bold text-sm text-ink">{order.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-ink">{order.customer}</td>
                  <td className="px-6 py-4 font-display font-black text-sm">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-display font-bold tracking-wide uppercase px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-muted font-medium">{order.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden divide-y divide-cream-200">
          {recentOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-display font-bold text-sm text-ink">{order.id}</p>
                <p className="text-xs text-ink-muted mt-0.5 font-medium">{order.customer} · {order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-sm">₹{order.total.toLocaleString()}</p>
                <span className={`text-[10px] font-display font-bold tracking-wide uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
