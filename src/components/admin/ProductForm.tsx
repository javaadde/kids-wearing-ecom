"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Image as ImageIcon, Loader2, Tags } from "lucide-react";
import Image from "next/image";
import { Product, SizeStock } from "@/types";

interface Props {
  product: Product | null;
  onSave: (data: Partial<Product>) => void;
  onClose: () => void;
}

interface CollectionItem {
  _id: string;
  name: string;
}

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "3M", "6M", "12M", "18M", "One Size"];
const CATEGORIES = ["boys", "girls", "infants", "unisex"];
const SEASONS = ["summer", "winter", "all"];

export default function ProductForm({ product, onSave, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [category, setCategory] = useState<string>(product?.category || "boys");
  const [collectionName, setCollectionName] = useState(product?.collectionName || "");
  const [season, setSeason] = useState<string>(product?.season || "all");
  const [price, setPrice] = useState(String(product?.price || ""));
  const [originalPrice, setOriginalPrice] = useState(String(product?.originalPrice || ""));
  const [description, setDescription] = useState(product?.description || "");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [newArrival, setNewArrival] = useState(product?.newArrival || false);
  const [sizes, setSizes] = useState<SizeStock[]>(
    product?.sizes || [{ size: "S", stock: 0 }]
  );
  
  // Collections state
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionBackgroundImage, setNewCollectionBackgroundImage] = useState("");
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [isColUploading, setIsColUploading] = useState(false);
  const [isColSaving, setIsColSaving] = useState(false);
  const colFileRef = useRef<HTMLInputElement>(null);

  // Image states
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, [category]);

  const fetchCollections = async () => {
    try {
      setCollectionLoading(true);
      const res = await fetch(`/api/collections?category=${category}`, { cache: "no-store" });
      const data = await res.json();
      if (data.collections) setCollections(data.collections);
    } catch (err) {
      console.error("Error fetching collections:", err);
    } finally {
      setCollectionLoading(false);
    }
  };

  const handleColImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsColUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setNewCollectionBackgroundImage(data.url);
      }
    } finally {
      setIsColUploading(false);
    }
  };

  const handleAddCollection = async () => {
    if (!newCollectionName.trim() || isColSaving) return;
    setIsColSaving(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName, category, backgroundImage: newCollectionBackgroundImage }),
      });
      if (res.ok) {
        const data = await res.json();
        setCollections((prev) => [...prev, data.collection]);
        setCollectionName(data.collection.name);
        setIsAddingCollection(false);
        setNewCollectionName("");
        setNewCollectionBackgroundImage("");
      }
    } catch (err) {
      alert("Failed to add collection");
    } finally {
      setIsColSaving(false);
    }
  };

  const autoSlug = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const addSize = () => setSizes([...sizes, { size: "M", stock: 0 }]);
  const removeSize = (i: number) => setSizes(sizes.filter((_, idx) => idx !== i));
  const updateSize = (i: number, field: keyof SizeStock, value: string | number) =>
    setSizes(sizes.map((s, idx) => idx === i ? { ...s, [field]: field === "stock" ? Number(value) : value } : s));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      slug: slug || autoSlug(name),
      category: category as Product["category"],
      collectionName,
      season: season as Product["season"],
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description,
      featured,
      newArrival,
      sizes,
      images,
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
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scroll px-6 py-6 space-y-6">
          
          {/* Images Management */}
          <div>
            <label className="section-label block mb-3">Product Images</label>
            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {images.map((img, i) => (
                  <motion.div 
                    key={img} 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative w-20 h-24 rounded-lg overflow-hidden border border-cream-200 bg-cream-100 group"
                  >
                    <Image src={img} alt="Product" fill className="object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="text-white" size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-24 border-2 border-dashed border-cream-300 hover:border-ink rounded-lg flex flex-col items-center justify-center text-ink-muted hover:text-ink transition-colors gap-1"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                <span className="text-[10px] font-bold">{isUploading ? "Uploading" : "Add"}</span>
              </button>
            </div>
          </div>

          <hr className="border-cream-200" />

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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="section-label block mb-1.5">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-full">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="relative">
              <label className="section-label block mb-1.5">Collection</label>
              <AnimatePresence mode="wait">
                {isAddingCollection ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 p-3 bg-cream-100 rounded-xl border border-cream-200">
                    <div className="flex gap-1.5 flex-1">
                      <div 
                        className="relative w-10 h-10 bg-cream-200 rounded-lg overflow-hidden flex-shrink-0 border border-cream-300 cursor-pointer group/col"
                        onClick={() => !isColUploading && colFileRef.current?.click()}
                      >
                        {newCollectionBackgroundImage ? (
                          <>
                            <Image src={newCollectionBackgroundImage} alt="Col" fill className="object-cover" />
                            <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover/col:opacity-100 flex items-center justify-center transition-opacity">
                               <Plus size={12} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-muted">
                            {isColUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                          </div>
                        )}
                        <input type="file" ref={colFileRef} onChange={handleColImageUpload} className="hidden" accept="image/*" />
                      </div>
                      <input 
                        autoFocus
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCollection())}
                        className="input-field flex-1 h-10"
                        placeholder="Collection Name..."
                      />
                    </div>
                    <div className="flex gap-2">
                       <button 
                         type="button" 
                         onClick={handleAddCollection} 
                         disabled={isColUploading || isColSaving} 
                         className="flex-1 h-8 bg-ink text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1"
                       >
                         {isColSaving ? <Loader2 size={12} className="animate-spin" /> : <><Plus size={12}/> Create</>}
                       </button>
                       <button type="button" onClick={() => { setIsAddingCollection(false); setNewCollectionBackgroundImage(""); }} className="w-12 h-8 bg-cream-300 rounded-lg flex items-center justify-center text-ink flex-shrink-0"><X size={14}/></button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                    <select 
                      value={collectionName} 
                      onChange={(e) => {
                        if (e.target.value === "ADD_NEW") {
                          setIsAddingCollection(true);
                        } else {
                          setCollectionName(e.target.value);
                        }
                      }} 
                      className="input-field w-full pr-8 appearance-none"
                    >
                      <option value="">None</option>
                      {collections.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                      <option value="ADD_NEW" className="font-bold text-ink">+ Add New Collection</option>
                    </select>
                    <Tags size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
                  </motion.div>
                )}
              </AnimatePresence>
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
            type="submit"
            disabled={isUploading}
            className={`btn-primary flex-1 justify-center ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isUploading ? "Uploading..." : (product ? "Save Changes" : "Add Product")}
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
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #E0DDD4;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
