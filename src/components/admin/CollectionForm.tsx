"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface Props {
  collection: any | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const CATEGORIES = ["boys", "girls", "infants", "unisex", "all"];

export default function CollectionForm({ collection, onSave, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(collection?.name || "");
  const [category, setCategory] = useState(collection?.category || "boys");
  const [backgroundImage, setBackgroundImage] = useState(collection?.backgroundImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setBackgroundImage(data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave({ name, category, backgroundImage });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-x-4 top-[10vh] md:top-[15vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-cream-50 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-cream-200">
          <h2 className="font-display font-black text-xl uppercase tracking-tight">
            {collection ? "Edit Collection" : "New Collection"}
          </h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-cream-200 hover:bg-ink hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Image Upload Area */}
          <div className="space-y-3">
             <label className="section-label block">Background Image</label>
             <div className="group relative w-full aspect-[16/9] bg-cream-200 rounded-2xl overflow-hidden border-2 border-dashed border-cream-300 hover:border-ink/20 transition-colors">
                {backgroundImage ? (
                  <>
                    <Image src={backgroundImage} alt="Col" fill className="object-cover" />
                    <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-primary py-2 px-4 text-[10px]">Change</button>
                       <button type="button" onClick={() => setBackgroundImage("")} className="bg-rust text-white py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-widest">Remove</button>
                    </div>
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-cream-100 transition-colors"
                  >
                    {isUploading ? <Loader2 size={24} className="animate-spin text-ink-muted" /> : <ImageIcon size={32} className="text-ink-faint" />}
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-ink">Upload Image</p>
                       <p className="text-[9px] text-ink-muted mt-0.5">Recommended: 16:9 Aspect Ratio</p>
                    </div>
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="section-label block mb-1.5">Collection Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field w-full h-12"
                placeholder="e.g. Graphic Tees"
              />
            </div>

            <div className="col-span-2">
              <label className="section-label block mb-1.5">Primary Category</label>
              <div className="flex flex-wrap gap-2">
                 {CATEGORIES.map((c) => (
                   <button
                     key={c}
                     type="button"
                     onClick={() => setCategory(c)}
                     className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                       category === c ? 'bg-ink text-white border-ink' : 'bg-white text-ink-muted border-cream-200 hover:border-ink'
                     }`}
                   >
                     {c}
                   </button>
                 ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading || isSaving}
            className="btn-primary w-full justify-center h-14 text-sm"
          >
            {isUploading ? "Uploading..." : isSaving ? "Saving..." : (collection ? "Update Collection" : "Create Collection")}
          </button>
        </form>
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
          outline: none;
        }
      `}</style>
    </>
  );
}
