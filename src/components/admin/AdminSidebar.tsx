"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: ShoppingBag, label: "Products" },
  { href: "/admin/orders", icon: Package, label: "Orders" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Nav = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-cream-300">
        <Link href="/" className="font-display font-black text-xl text-ink tracking-tight">
          KIDO<span className="text-camel">.</span>
        </Link>
        <p className="text-xs text-ink-muted mt-1 font-medium">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display font-semibold text-sm transition-all ${
                active
                  ? "bg-ink text-cream-50"
                  : "text-ink-muted hover:bg-cream-200 hover:text-ink"
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-cream-300">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left font-display font-semibold text-sm text-ink-muted hover:bg-cream-200 hover:text-rust transition-all"
        >
          <LogOut size={17} strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 bg-cream-50 rounded-xl flex items-center justify-center shadow-sm"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-cream-50 shadow-2xl md:hidden"
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
        >
          <X size={16} />
        </button>
        <Nav />
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-cream-50 border-r border-cream-300 flex-col">
        <Nav />
      </div>
    </>
  );
}
