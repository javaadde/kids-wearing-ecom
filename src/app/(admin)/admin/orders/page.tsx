"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronDown } from "lucide-react";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: string;
  date: string;
  address: string;
}

const MOCK_ORDERS: Order[] = [
  { id: "ORD001", customer: "Priya Sharma", email: "priya@mail.com", items: 3, total: 2498, status: "pending", date: "Apr 17, 2025", address: "Mumbai, MH 400001" },
  { id: "ORD002", customer: "Rahul Mehta", email: "rahul@mail.com", items: 1, total: 1299, status: "shipped", date: "Apr 16, 2025", address: "Delhi, DL 110001" },
  { id: "ORD003", customer: "Ananya Kumar", email: "ananya@mail.com", items: 4, total: 3798, status: "delivered", date: "Apr 14, 2025", address: "Bangalore, KA 560001" },
  { id: "ORD004", customer: "Vikram Patel", email: "vikram@mail.com", items: 1, total: 849, status: "processing", date: "Apr 13, 2025", address: "Ahmedabad, GJ 380001" },
  { id: "ORD005", customer: "Sneha Reddy", email: "sneha@mail.com", items: 2, total: 2199, status: "cancelled", date: "Apr 12, 2025", address: "Hyderabad, TS 500001" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).catch(() => {});
  };

  return (
    <div className="max-w-6xl mx-auto pt-14 md:pt-0">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="editorial-heading text-2xl md:text-3xl mb-2"
      >
        Orders
      </motion.h1>
      <p className="text-ink-muted text-sm font-medium mb-8">{orders.length} total orders</p>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-display font-semibold text-xs tracking-wide border transition-all capitalize ${
              filterStatus === s
                ? "bg-ink text-cream-50 border-ink"
                : "bg-cream-50 text-ink-muted border-cream-300 hover:border-ink"
            }`}
          >
            {s === "all" ? "All Orders" : s}
          </motion.button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-cream-50 border border-cream-300 rounded-2xl overflow-hidden"
            >
              {/* Order row */}
              <div
                className="flex flex-col md:flex-row md:items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-cream-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package size={17} className="text-ink-muted" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-ink">{order.id}</p>
                    <p className="text-xs text-ink-muted font-medium mt-0.5">{order.customer} · {order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                  <div className="text-right md:text-left">
                    <p className="font-display font-black text-sm">₹{order.total.toLocaleString()}</p>
                    <p className="text-xs text-ink-muted font-medium">{order.items} item{order.items > 1 ? "s" : ""}</p>
                  </div>

                  <span className={`text-[10px] font-display font-bold tracking-wide uppercase px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>

                  <motion.div
                    animate={{ rotate: expandedId === order.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto md:ml-0"
                  >
                    <ChevronDown size={16} className="text-ink-muted" />
                  </motion.div>
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-cream-200"
                  >
                    <div className="px-5 py-5 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="section-label mb-1">Customer</p>
                          <p className="font-medium text-ink">{order.customer}</p>
                          <p className="text-ink-muted">{order.email}</p>
                        </div>
                        <div>
                          <p className="section-label mb-1">Ship To</p>
                          <p className="font-medium text-ink">{order.address}</p>
                        </div>
                        <div>
                          <p className="section-label mb-1">Order Date</p>
                          <p className="font-medium text-ink">{order.date}</p>
                        </div>
                      </div>

                      {/* Status update */}
                      <div>
                        <p className="section-label mb-2">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => (
                            <motion.button
                              key={s}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateStatus(order.id, s)}
                              className={`px-4 py-2 rounded-xl font-display font-semibold text-xs capitalize border transition-all ${
                                order.status === s
                                  ? "bg-ink text-cream-50 border-ink"
                                  : "bg-cream-100 text-ink-muted border-cream-300 hover:border-ink hover:text-ink"
                              }`}
                            >
                              {s}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-ink-muted font-medium text-sm">
          No orders with status "{filterStatus}"
        </div>
      )}
    </div>
  );
}
