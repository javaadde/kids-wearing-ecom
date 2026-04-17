"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types";

const MOCK: Product[] = [
  { _id: "1", name: "Striped Cotton T-Shirt", slug: "1", category: "boys", season: "summer", price: 849, description: "Classic tee.", images: [], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 10 }, { size: "M", stock: 0 }], featured: true, newArrival: true, tags: [], createdAt: "2025-04-10", updatedAt: "" },
  { _id: "2", name: "Wide-Leg Denim Pants", slug: "2", category: "girls", season: "all", price: 1299, description: "Relaxed denim.", images: [], sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 6 }], featured: true, newArrival: false, tags: [], createdAt: "2025-04-08", updatedAt: "" },
  { _id: "3", name: "Linen Bucket Hat", slug: "3", category: "unisex", season: "summer", price: 499, description: "Sand linen hat.", images: [], sizes: [{ size: "One Size", stock: 0 }], featured: false, newArrival: true, tags: [], createdAt: "2025-04-06", updatedAt: "" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p._id !== id));
    fetch(`/api/products/${id}`, { method: "DELETE" }).catch(() => {});
  };

  const handleSave = (product: Partial<Product>) => {
    if (editing) {
      setProducts((prev) => prev.map((p) => p._id === editing._id ? { ...p, ...product } : p));
    } else {
      setProducts((prev) => [{ ...product, _id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: "" } as Product, ...prev]);
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="max-w-6xl mx-auto pt-14 md:pt-0">
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
          <p className="text-ink-muted text-sm font-medium mt-1">{products.length} total products</p>
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
      <div className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100">
                {["Product", "Category", "Price", "Sizes/Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-display font-black tracking-widest uppercase text-ink-muted">
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
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-cream-200 last:border-0 hover:bg-cream-100 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-cream-200 rounded-lg flex-shrink-0" />
                        <div>
                          <p className="font-display font-bold text-sm text-ink line-clamp-1">{p.name}</p>
                          <p className="text-xs text-ink-muted mt-0.5 font-medium">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-display font-semibold capitalize text-ink-muted bg-cream-200 px-2.5 py-1 rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-display font-black text-sm">₹{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {p.sizes.map((s) => (
                          <span
                            key={s.size}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-display ${
                              s.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {s.size}: {s.stock}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {p.featured && <span className="text-[9px] font-display font-bold bg-ink/10 text-ink px-1.5 py-0.5 rounded uppercase">Featured</span>}
                        {p.newArrival && <span className="text-[9px] font-display font-bold bg-camel/20 text-bark px-1.5 py-0.5 rounded uppercase">New</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setEditing(p); setFormOpen(true); }}
                          className="w-8 h-8 flex items-center justify-center bg-cream-200 hover:bg-ink hover:text-cream-50 rounded-lg transition-colors"
                        >
                          <Pencil size={13} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(p._id)}
                          className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-red-500"
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
              transition={{ delay: i * 0.05 }}
              className="p-4 flex items-center gap-4"
            >
              <div className="w-14 h-16 bg-cream-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm text-ink truncate">{p.name}</p>
                <p className="text-xs text-ink-muted font-medium mt-0.5 capitalize">{p.category} · {p.season}</p>
                <p className="font-display font-black text-sm mt-1">₹{p.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setEditing(p); setFormOpen(true); }} className="text-ink-muted hover:text-ink transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-ink-muted font-medium text-sm">No products found</div>
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
