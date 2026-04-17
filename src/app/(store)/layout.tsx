"use client";

import Header from "@/components/store/Header";
import BottomNav from "@/components/store/BottomNav";
import CartDrawer from "@/components/store/CartDrawer";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pb-nav"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
