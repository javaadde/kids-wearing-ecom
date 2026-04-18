"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { Product, SizeStock } from "@/types";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "3M", "6M", "12M", "18M", "One Size"];
const CATEGORIES = ["boys", "girls", "infants", "unisex"];
const SEASONS = ["summer", "winter", "all"];

export default function NewProductPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("boys");
  const [season, setSeason] = useState("all");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [sizes, setSizes] = useState<SizeStock[]>([{ size: "S", stock: 0 }]);
  
  // Image Upload state
  const [images, setImages] = useState<string[]>([]);

  const autoSlug = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const addSize = () => setSizes([...sizes, { size: "M", stock: 0 }]);
  const removeSize = (i: number) => setSizes(sizes.filter((_, idx) => idx !== i));
  const updateSize = (i: number, field: keyof SizeStock, value: string | number) =>
    setSizes(sizes.map((s, idx) => idx === i ? { ...s, [field]: field === "stock" ? Number(value) : value } : s));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = (result: any) => {
    if (result.info && result.info.secure_url) {
      setImages((prev) => [...prev, result.info.secure_url]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the payload
    const payload = {
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
      images,
      tags: [],
    };

    // Normally this creates a new product in MongoDB
    // await fetch('/api/products', { method: 'POST', body: JSON.stringify(payload) })
    
    // For now, let's pretend it saved successfully and go back to products page!
    console.log("Saving Product:", payload);
    alert("Product will be saved successfully! Redirecting...");
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto pt-14 md:pt-0 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="w-10 h-10 flex items-center justify-center bg-cream-50 hover:bg-cream-200 border border-cream-300 rounded-full transition-colors">
          <ArrowLeft size={18} className="text-ink" />
        </Link>
        <div>
          <h1 className="editorial-heading text-2xl md:text-3xl">Add New Product</h1>
          <p className="text-ink-muted text-sm font-medium mt-1">Upload details & product gallery.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-cream-50 border border-cream-300 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
        
        {/* Images Section */}
        <div>
          <h3 className="section-label mb-4 text-lg">Product Images</h3>
          <p className="text-xs text-ink-muted mb-4 font-medium">The first image will be used as the primary display image (Main Card Image). The remaining images form the detailed preview gallery.</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((imgUrl, idx) => (
              <div key={idx} className="relative w-32 h-40 rounded-xl overflow-hidden border border-cream-200 bg-cream-100 group">
                <Image src={imgUrl} alt={`Upload ${idx}`} fill className="object-cover" />
                {idx === 0 && (
                  <span className="absolute top-2 left-2 bg-camel text-bark text-[9px] uppercase font-black px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="text-white" size={20} />
                </button>
              </div>
            ))}
            
            <CldUploadWidget 
              uploadPreset="ml_default" // You may need to change this preset!
              onSuccess={handleImageUpload}
              options={{ multiple: true }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-32 h-40 border-2 border-dashed border-cream-300 hover:border-ink hover:bg-cream-100 rounded-xl flex flex-col items-center justify-center text-ink-muted hover:text-ink transition-colors gap-2"
                >
                  <ImageIcon size={24} />
                  <span className="text-xs font-semibold">Upload Image</span>
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>

        <hr className="border-cream-200" />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="section-label block mb-2">Product Name *</label>
            <input value={name} onChange={(e) => { setName(e.target.value); setSlug(autoSlug(e.target.value)); }} required className="input-field w-full" placeholder="e.g. Striped Cotton Tee" />
          </div>
          <div>
            <label className="section-label block mb-2">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="input-field w-full text-ink-muted" placeholder="auto-generated" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-2 lg:col-span-1">
            <label className="section-label block mb-2">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-full">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <label className="section-label block mb-2">Season *</label>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className="input-field w-full">
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-1 border-l pl-4 border-cream-200">
            <label className="section-label block mb-2">Price (₹) *</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min={0} className="input-field w-full" placeholder="849" />
          </div>
          <div className="col-span-1">
            <label className="section-label block mb-2">Original Price</label>
            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} min={0} className="input-field w-full" placeholder="1199" />
          </div>
        </div>

        <hr className="border-cream-200" />

        <div>
          <label className="section-label block mb-2">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="input-field w-full resize-none leading-relaxed" placeholder="Detailed product description..." />
        </div>

        <hr className="border-cream-200" />

        {/* Sizes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="section-label">Sizes & Stock Tracker</label>
            <button type="button" onClick={addSize} className="text-sm font-display font-semibold text-ink hover:text-camel transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-cream-200 rounded-lg">
              <Plus size={14} /> Add Size
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sizes.map((s, i) => (
              <div key={i} className="flex gap-3 items-center bg-white p-3 rounded-xl border border-cream-200">
                <select value={s.size} onChange={(e) => updateSize(i, "size", e.target.value)} className="input-field flex-1">
                  {SIZE_OPTIONS.map((sz) => <option key={sz} value={sz}>{sz}</option>)}
                </select>
                <input type="number" value={s.stock} onChange={(e) => updateSize(i, "stock", e.target.value)} min={0} className="input-field w-24 text-center font-bold" placeholder="Stock" />
                <button type="button" onClick={() => removeSize(i)} className="text-red-400 hover:text-red-600 transition-colors w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-cream-200" />

        {/* Toggles */}
        <div className="flex flex-col sm:flex-row gap-8">
          {[
            { label: "Featured Product", desc: "Show on the home page hero highlights.", value: featured, set: setFeatured },
            { label: "New Arrival", desc: "Add strict 'NEW' tag onto product.", value: newArrival, set: setNewArrival },
          ].map(({ label, desc, value, set }) => (
            <div key={label} className="flex gap-4">
              <div onClick={() => set(!value)} className={`w-12 h-7 rounded-full cursor-pointer transition-colors relative flex-shrink-0 mt-1 ${value ? "bg-ink" : "bg-cream-300"}`}>
                <motion.div animate={{ x: value ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 35 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-ink">{label}</p>
                <p className="text-xs text-ink-muted mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-cream-200" />

        <div className="flex justify-end pt-2">
          <motion.button whileTap={{ scale: 0.98 }} type="submit" className="btn-primary min-w-[200px] justify-center text-base py-3.5">
            Publish Product
          </motion.button>
        </div>

      </form>
      
      <style jsx>{`
        .input-field {
          background: #ffffff;
          border: 1px solid #E0DDD4;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #1A1A1A;
          transition: all 0.2s;
          outline: none;
          font-family: var(--font-inter);
        }
        .input-field:focus {
          border-color: #1A1A1A;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.05);
        }
      `}</style>
    </div>
  );
}
