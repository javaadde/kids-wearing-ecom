"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { Home, ShoppingBag, Search, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/account", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cream-50/90 backdrop-blur-xl border-t border-cream-200 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] relative"
            >
              <motion.div
                animate={{ scale: active ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.5}
                  className={active ? "text-ink" : "text-ink-muted"}
                />
              </motion.div>
              <span
                className={`text-[10px] font-display font-semibold tracking-wide ${
                  active ? "text-ink" : "text-ink-faint"
                }`}
              >
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-3 inset-x-0 mx-auto w-6 h-0.5 bg-ink rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
