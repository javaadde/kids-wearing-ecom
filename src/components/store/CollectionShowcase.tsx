"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Collection } from "@/types";

export default function CollectionShowcase() {
  const [boys, setBoys] = useState<Collection[]>([]);
  const [girls, setGirls] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collections", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.collections) {
          setBoys(data.collections.filter((c: Collection) => c.category === "boys"));
          setGirls(data.collections.filter((c: Collection) => c.category === "girls"));
        }
      })
      .catch((err) => console.error("Showcase fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && boys.length === 0 && girls.length === 0) return null;

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="px-4 md:px-12 max-w-7xl mx-auto space-y-12">
           <div className="h-20 w-1/3 bg-cream-100 animate-pulse rounded-2xl" />
           <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[600px]">
              <div className="md:col-span-8 bg-cream-100 animate-pulse rounded-[3rem]" />
              <div className="md:col-span-4 space-y-8">
                 <div className="h-1/2 bg-cream-100 animate-pulse rounded-[2.5rem]" />
                 <div className="h-1/2 bg-cream-100 animate-pulse rounded-[2.5rem]" />
              </div>
           </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden" id="collections">
      <div className="px-4 md:px-12 max-w-7xl mx-auto space-y-32">
        
        {/* Boys Collection Row */}
        {boys.length > 0 && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cream-200 pb-10">
              <div className="max-w-2xl">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-0.5 bg-denim" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-denim">Curated for Him</span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="editorial-heading text-5xl md:text-7xl leading-[0.9] -tracking-wide"
                >
                  The Boys <br/> <span className="text-ink-muted">Collection</span>
                </motion.h2>
              </div>
              <Link href="/shop?category=boys" className="group inline-flex items-center gap-3 py-4 px-8 bg-ink text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-denim transition-all shadow-xl shadow-ink/10">
                Explore All Boys <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
               {/* Hero Collection Card */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                 className="md:col-span-8 aspect-[16/10] md:aspect-auto md:h-[600px] bg-denim/10 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-denim/5"
               >
                  {boys[0]?.backgroundImage && (
                    <Image src={boys[0].backgroundImage} alt={boys[0].name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-12 flex flex-col justify-end z-10">
                     <div className="max-w-md">
                        <p className="text-denim font-black text-xs uppercase tracking-[0.4em] mb-4">Featured Selection</p>
                        <h3 className="editorial-heading text-5xl text-white mb-6 leading-tight">{boys[0]?.name}</h3>
                        <Link href={`/shop?category=boys&collection=${boys[0]?.name}`} className="inline-flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                           View Collection <ArrowRight size={12} />
                        </Link>
                     </div>
                  </div>
               </motion.div>

               {/* Secondary Cards Column */}
               <div className="md:col-span-4 flex flex-col gap-8">
                  {boys.slice(1, 4).map((col, i) => (
                    <Link key={col._id} href={`/shop?category=boys&collection=${col.name}`} className="flex-1">
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                        className="group relative h-full min-h-[280px] rounded-[2.5rem] overflow-hidden bg-cream-50 border border-cream-200"
                      >
                         {col.backgroundImage && <Image src={col.backgroundImage} alt={col.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                         <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/60 transition-colors" />
                         <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                            <p className="font-display font-black text-2xl mb-1">{col.name}</p>
                            <span className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-60">Shop Catalogue</span>
                         </div>
                      </motion.div>
                    </Link>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* Girls Collection Row */}
        {girls.length > 0 && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row-reverse md:items-end justify-between gap-6 border-b border-cream-200 pb-10">
              <div className="max-w-2xl md:text-right">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center md:justify-end gap-3 mb-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-camel">Elegant Essentials</span>
                   <div className="w-10 h-0.5 bg-camel" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="editorial-heading text-5xl md:text-7xl leading-[0.9] -tracking-wide"
                >
                  The Girls <br/> <span className="text-ink-muted">Studio</span>
                </motion.h2>
              </div>
              <Link href="/shop?category=girls" className="group inline-flex items-center gap-3 py-4 px-8 border-2 border-ink text-ink rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-ink hover:text-white transition-all shadow-xl shadow-ink/5">
                Discover All Girls <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
               {/* Secondary Cards Column (Swapped for Girls) */}
               <div className="md:col-span-4 flex flex-col gap-8 order-2 md:order-1">
                  {girls.slice(1, 4).map((col, i) => (
                    <Link key={col._id} href={`/shop?category=girls&collection=${col.name}`} className="flex-1">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                        className="group relative h-full min-h-[280px] rounded-[2.5rem] overflow-hidden bg-cream-50 border border-cream-200"
                      >
                         {col.backgroundImage && <Image src={col.backgroundImage} alt={col.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                         <div className="absolute inset-0 bg-camel/40 group-hover:bg-camel/60 transition-colors" />
                         <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                            <p className="font-display font-black text-2xl mb-1">{col.name}</p>
                            <span className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-60">Shop Catalogue</span>
                         </div>
                      </motion.div>
                    </Link>
                  ))}
               </div>

               {/* Hero Collection Card */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                 className="md:col-span-8 aspect-[16/10] md:aspect-auto md:h-[600px] bg-camel/10 rounded-[3rem] relative overflow-hidden group order-1 md:order-2 shadow-2xl shadow-camel/5"
               >
                  {girls[0]?.backgroundImage && (
                    <Image src={girls[0].backgroundImage} alt={girls[0].name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bark/80 via-bark/20 to-transparent" />
                  <div className="absolute inset-0 p-12 flex flex-col justify-end z-10 md:text-right">
                     <div className="max-w-md md:ml-auto">
                        <p className="text-camel font-black text-xs uppercase tracking-[0.4em] mb-4">Limited Edition</p>
                        <h3 className="editorial-heading text-5xl text-white mb-6 leading-tight">{girls[0]?.name}</h3>
                        <Link href={`/shop?category=girls&collection=${girls[0]?.name}`} className="inline-flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                           <ArrowRight size={12} className="rotate-180 hidden md:block" /> View Collection <ArrowRight size={12} className="md:hidden" />
                        </Link>
                     </div>
                  </div>
               </motion.div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
