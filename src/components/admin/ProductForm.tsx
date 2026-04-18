"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { Product, SizeStock } from "@/types";

interface Props {
  product: Product | null;
  onSave: (data: Partial<Product>) => void;
  onClose: () => void;
}

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "3M", "6M", "12M", "18M", "One Size"];
const CATEGORIES = ["boys", "girls", "infants", "unisex"];
const SEASONS = ["summer", "winter", "all"];

export default function ProductForm({ product, onSave, onClose }: Props) {
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [category, setCategory] = useState(product?.category || "boys");
  const [season, setSeason] = useState(product?.season || "all");
  const [price, setPrice] = useState(String(product?.price || ""));
  const [originalPrice, setOriginalPrice] = useState(String(product?.originalPrice || ""));
  const [description, setDescription] = useState(product?.description || "");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [newArrival, setNewArrival] = useState(product?.newArrival || false);
  const [sizes, setSizes] = useState<SizeStock[]>(
    product?.sizes || [{ size: "S", stock: 0 }]
  );

  const autoSlug = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const addSize = () => setSizes([...sizes, { size: "M", stock: 0 }]);
  const removeSize = (i: number) => setSizes(sizes.filter((_, idx) => idx !== i));
  const updateSize = (i: number, field: keyof SizeStock, value: string | number) =>
    setSizes(sizes.map((s, idx) => idx === i ? { ...s, [field]: field === "stock" ? Number(value) : value } : s));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      slug: slug || autoSlug(name),
      category: category as Product["category"],
      season: season as Product["season"],
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description,
      featured,
      newArrival,
      sizes,
      images: product?.images || [],
      tags: product?.tags || [],
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed inset-x-4 top-8 bottom-8 z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-cream-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <h2 className="font-display font-black text-lg">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-cream-200 hover:bg-cream-300 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scroll px-6 py-6 space-y-5">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="section-label block mb-1.5">Product Name *</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); if (!product) setSlug(autoSlug(e.target.value)); }}
                required
                className="input-field w-full"
                placeholder="e.g. Striped Cotton Tee"
              />
            </div>
            <div>
              <label className="section-label block mb-1.5">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="input-field w-full"
                placeholder="auto-generated"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-label block mb-1.5">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-full">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="section-label block mb-1.5">Season *</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)} className="input-field w-full">
                {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-label block mb-1.5">Price (₹) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min={0} className="input-field w-full" placeholder="849" />
            </div>
            <div>
              <label className="section-label block mb-1.5">Original Price (₹)</label>
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} min={0} className="input-field w-full" placeholder="1199" />
            </div>
          </div>

          <div>
            <label className="section-label block mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="input-field w-full resize-none"
              placeholder="Describe the product..."
            />
          </div>

          {/* Sizes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="section-label">Sizes & Stock</label>
              <button type="button" onClick={addSize} className="text-xs font-display font-semibold text-ink hover:text-camel transition-colors flex items-center gap-1">
                <Plus size={12} /> Add Size
              </button>
            </div>
            <div className="space-y-2">
              {sizes.map((s, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <select
                    value={s.size}
                    onChange={(e) => updateSize(i, "size", e.target.value)}
                    className="input-field flex-1"
                  >
                    {SIZE_OPTIONS.map((sz) => <option key={sz} value={sz}>{sz}</option>)}
                  </select>
                  <input
                    type="number"
                    value={s.stock}
                    onChange={(e) => updateSize(i, "stock", e.target.value)}
                    min={0}
                    className="input-field w-24 text-center"
                    placeholder="Stock"
                  />
                  <button type="button" onClick={() => removeSize(i)} className="text-red-400 hover:text-red-600 transition-colors w-8 h-8 flex items-center justify-center">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-muted mt-2 font-medium">Stock = 0 marks the size as &quot;Out of Stock&quot; on storefront.</p>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[
              { label: "Featured", value: featured, set: setFeatured },
              { label: "New Arrival", value: newArrival, set: setNewArrival },
            ].map(({ label, value, set }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => set(!value)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${value ? "bg-ink" : "bg-cream-300"}`}
                >
                  <motion.div
                    animate={{ x: value ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute top-1 w-4 h-4 bg-cream-50 rounded-full shadow"
                  />
                </div>
                <span className="font-display font-semibold text-sm text-ink">{label}</span>
              </label>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-cream-200 flex gap-3">
          <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            form="product-form"
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            className="btn-primary flex-1 justify-center"
          >
            {product ? "Save Changes" : "Add Product"}
          </motion.button>
        </div>
      </motion.div>

      <style jsx>{`
        .input-field {
          background: #F5F4F0;
          border: 1px solid #E0DDD4;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #1A1A1A;
          transition: border-color 0.2s;
          outline: none;
          font-family: var(--font-inter);
        }
        .input-field:focus {
          border-color: #1A1A1A;
        }
      `}</style>
    </>
  );
}
