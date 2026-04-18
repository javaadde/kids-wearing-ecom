"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  icon: ReactNode;
  color: string;
  textColor: string;
  delay?: number;
}

export default function StatsCard({ label, value, prefix = "", icon, color, textColor, delay = 0 }: Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    prefix === "₹" ? `${prefix}${Math.round(v).toLocaleString()}` : `${prefix}${Math.round(v)}`
  );

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.8, delay, ease: "easeOut" });
    return controls.stop;
  }, [value, delay, count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${color} ${textColor} rounded-2xl p-5 space-y-3`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-xs font-display font-semibold tracking-widest uppercase opacity-70`}>
          {label}
        </p>
        <div className="opacity-60">{icon}</div>
      </div>
      <motion.p className="font-display font-black text-2xl md:text-3xl leading-none">
        {rounded}
      </motion.p>
    </motion.div>
  );
}
