"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, X, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Error connecting to server");
    }
  };

  const handleSave = async (data: Partial<Product>) => {
    try {
      if (editing) {
        // Update existing
        const res = await fetch(`/api/products/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          fetchProducts(); // Refresh list
        }
      } else {
        // This is handled by the dedicated /new page, but if called from modal:
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          fetchProducts();
        }
      }
      setFormOpen(false);
      setEditing(null);
    } catch {
      alert("Failed to save product");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-14 md:pt-0 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="editorial-heading text-2xl md:text-3xl"
          >
            Products
          </motion.h1>
          <p className="text-ink-muted text-sm font-medium mt-1">
            {loading ? "Loading..." : `${products.length} total products`}
          </p>
        </div>
        <Link href="/admin/products/new">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary self-start sm:self-auto inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </motion.div>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-11 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Product list */}
      <div className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-ink-muted" size={32} />
            <p className="text-sm font-medium text-ink-muted">Fetching products...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
            <AlertCircle size={32} />
            <p className="text-sm font-medium">{error}</p>
            <button onClick={fetchProducts} className="text-xs underline font-bold mt-2">Try Again</button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-200 bg-cream-100/50">
                    {["Product", "Category", "Price", "Sizes/Stock", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-display font-black tracking-widest uppercase text-ink-muted/70">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((p, i) => (
                      <motion.tr
                        key={p._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-cream-200 last:border-0 hover:bg-cream-100/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-cream-200 rounded-lg flex-shrink-0 relative overflow-hidden border border-cream-300">
                              {p.images && p.images[0] ? (
                                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon size={16} className="text-ink-faint" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-display font-bold text-sm text-ink line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-ink-muted mt-0.5 font-medium tracking-wider uppercase">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-display font-black uppercase tracking-wider text-ink-muted bg-cream-200 px-2.5 py-1 rounded-md">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-display font-black text-sm text-bark">₹{p.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap max-w-[150px]">
                            {p.sizes.map((s) => (
                              <span
                                key={s.size}
                                title={`${s.size} stock: ${s.stock}`}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-display ${
                                  s.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {s.size}:{s.stock}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1.5">
                            {p.featured && <span className="text-[9px] font-display font-bold bg-ink text-white px-2 py-0.5 rounded shadow-sm">FEATURED</span>}
                            {p.newArrival && <span className="text-[9px] font-display font-bold bg-camel text-bark px-2 py-0.5 rounded shadow-sm">NEW</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => { setEditing(p); setFormOpen(true); }}
                              className="w-8 h-8 flex items-center justify-center bg-cream-200 hover:bg-ink hover:text-white rounded-lg transition-colors border border-cream-300"
                            >
                              <Pencil size={13} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(p._id)}
                              className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-red-500 border border-red-100"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-cream-200">
              {filtered.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 flex items-center gap-4 hover:bg-cream-100/30 transition-colors"
                >
                  <div className="w-14 h-18 bg-cream-200 rounded-xl flex-shrink-0 relative overflow-hidden border border-cream-300 shadow-sm">
                    {p.images && p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-faint">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-ink truncate">{p.name}</p>
                    <p className="text-[10px] text-ink-muted font-bold mt-0.5 uppercase tracking-wider">{p.category} · {p.season}</p>
                    <p className="font-display font-black text-sm mt-1 text-bark">₹{p.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setEditing(p); setFormOpen(true); }} className="w-8 h-8 flex items-center justify-center bg-cream-200 rounded-lg">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-400 rounded-lg">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-cream-200 rounded-full flex items-center justify-center text-ink-muted">
                  <Search size={20} />
                </div>
                <div>
                  <p className="text-ink font-bold font-display">No products found</p>
                  <p className="text-ink-muted text-xs mt-1">Try searching for something else or add a new product.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product form modal */}
      <AnimatePresence>
        {formOpen && (
          <ProductForm
            product={editing}
            onSave={handleSave}
            onClose={() => { setFormOpen(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
