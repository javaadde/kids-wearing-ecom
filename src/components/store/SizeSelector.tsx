"use client";

import { motion } from "framer-motion";
import { SizeStock } from "@/types";

interface Props {
  sizes: SizeStock[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="section-label">Size</span>
        {selected && (
          <span className="text-xs font-display font-semibold text-ink">{selected}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map(({ size, stock }) => {
          const available = stock > 0;
          const isSelected = selected === size;

          return (
            <motion.button
              key={size}
              whileHover={available ? { scale: 1.06 } : {}}
              whileTap={available ? { scale: 0.95 } : {}}
              onClick={() => available && onSelect(size)}
              disabled={!available}
              className={`
                relative min-w-[44px] h-11 px-3 rounded-lg font-display font-semibold text-sm
                transition-all duration-200 border
                ${
                  isSelected
                    ? "bg-ink text-cream-50 border-ink"
                    : available
                    ? "bg-cream-100 text-ink border-cream-300 hover:border-ink"
                    : "bg-cream-100 text-ink-faint border-cream-200 cursor-not-allowed"
                }
              `}
              aria-label={`Size ${size}${!available ? " - Out of stock" : ""}`}
            >
              {size}
              {/* Strikethrough overlay for OOS */}
              {!available && (
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden
                >
                  <span className="absolute w-full h-px bg-ink-faint rotate-[135deg] scale-75" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      {selected && sizes.find((s) => s.size === selected)?.stock === 0 && (
        <p className="text-xs text-rust font-medium">This size is out of stock</p>
      )}
    </div>
  );
}
