"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Tags, Search, X } from "lucide-react";
import Image from "next/image";
import { Collection } from "@/types";
import CollectionForm from "@/components/admin/CollectionForm";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/collections", { cache: "no-store" });
      const data = await res.json();
      if (data.collections) setCollections(data.collections);
      else setError(data.error || "Failed to fetch");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Collection>) => {
    try {
      const url = editing ? `/api/collections/${editing._id}` : "/api/collections";
      const method = editing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchCollections();
        setFormOpen(false);
        setEditing(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save");
      }
    } catch {
      alert("Error saving collection");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will not delete the products in this collection, but they will no longer be linked.")) return;
    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      if (res.ok) fetchCollections();
    } catch {
      alert("Delete failed");
    }
  };

  const filtered = collections.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto pt-14 md:pt-0 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="editorial-heading text-2xl md:text-3xl">Collections</motion.h1>
          <p className="text-ink-muted text-sm font-medium mt-1">{loading ? "Loading..." : `${collections.length} groups created`}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="btn-primary self-start sm:self-auto inline-flex items-center gap-2"
        >
          <Plus size={16} /> Add Collection
        </motion.button>
      </div>

       {/* Search */}
       <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search collections..."
          className="w-full pl-11 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">
            <X size={14} />
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-ink-muted" size={32} />
            <p className="text-sm font-medium text-ink-muted">Fetching collections...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
            <AlertCircle size={32} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-muted">
            <Tags size={32} className="opacity-20" />
            <p className="text-sm font-medium">No collections found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-200 bg-cream-100/50">
                    <th className="px-6 py-4 text-left text-[10px] font-display font-black tracking-widest uppercase text-ink-muted/70">Image</th>
                    <th className="px-6 py-4 text-left text-[10px] font-display font-black tracking-widest uppercase text-ink-muted/70">Name</th>
                    <th className="px-6 py-4 text-left text-[10px] font-display font-black tracking-widest uppercase text-ink-muted/70">Category</th>
                    <th className="px-6 py-4 text-right text-[10px] font-display font-black tracking-widest uppercase text-ink-muted/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                   {filtered.map((c) => (
                     <tr key={c._id} className="hover:bg-cream-100/30 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-200 border border-cream-300 shadow-sm">
                             {c.backgroundImage ? <Image src={c.backgroundImage} alt={c.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-ink/20"><Tags size={14}/></div>}
                           </div>
                        </td>
                        <td className="px-6 py-4 font-display font-black text-ink">{c.name}</td>
                        <td className="px-6 py-4">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                             c.category === 'boys' ? 'bg-denim/10 text-denim' : 
                             c.category === 'girls' ? 'bg-camel/20 text-bark' : 
                             'bg-cream-300 text-ink'
                           }`}>
                             {c.category}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-end gap-2">
                             <button onClick={() => { setEditing(c); setFormOpen(true); }} className="w-8 h-8 flex items-center justify-center bg-cream-200 hover:bg-ink hover:text-white rounded-lg transition-colors border border-cream-300"><Pencil size={13}/></button>
                             <button onClick={() => handleDelete(c._id)} className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-red-500 border border-red-100"><Trash2 size={13}/></button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {formOpen && (
          <CollectionForm
            collection={editing}
            onSave={handleSave}
            onClose={() => { setFormOpen(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
