"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    // Check if any admin exists to show setup link
    fetch("/api/admin/register")
      .then(res => res.json())
      .then(data => setNeedsSetup(data.needsSetup))
      .catch(() => {});
  }, []);

  const setupSuccess = searchParams.get("setup") === "success";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/admin/dashboard",
      });

      if (res?.error) {
        setLoading(false);
        setError(res.error === "CredentialsSignin" 
          ? "Invalid email or password." 
          : "An unexpected error occurred during login.");
      }
    } catch (err) {
      setLoading(false);
      setError("Connection failed. Check your internet or server status.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-display font-black text-3xl text-cream-50 tracking-tight">
            KIDO<span className="text-camel">.</span>
          </p>
          <p className="text-sm text-cream-300 mt-1 font-medium">Admin Portal</p>
        </div>

        {setupSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
          >
            <p className="text-green-400 text-xs font-semibold">Admin account created successfully! Please log in.</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-display font-semibold text-cream-300 tracking-wide mb-2 uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-cream-50/10 border border-cream-50/20 text-cream-50 placeholder:text-cream-300/40 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-camel transition-colors"
              placeholder="admin@kidostudio.com"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-display font-semibold text-cream-300 tracking-wide mb-2 uppercase">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-cream-50/10 border border-cream-50/20 text-cream-50 placeholder:text-cream-300/40 rounded-xl px-4 py-3.5 pr-12 text-sm font-medium focus:outline-none focus:border-camel transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-[42px] text-cream-300/60 hover:text-cream-50 transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-400 text-xs font-medium text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-camel text-ink font-display font-bold text-sm py-4 rounded-xl hover:bg-rust transition-colors mt-2 disabled:opacity-60"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full" />
            ) : (
              <><LogIn size={16} /> Sign In</>
            )}
          </motion.button>
        </form>

        {needsSetup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-camel/10 border border-camel/20 rounded-xl flex items-center gap-3"
          >
            <ShieldAlert className="text-camel shrink-0" size={18} />
            <div className="flex-1">
              <p className="text-[10px] text-cream-50 font-bold uppercase tracking-wider mb-0.5">No Admin Detected</p>
              <Link href="/admin/register" className="text-xs text-camel hover:text-rust font-semibold underline decoration-camel/30 transition-colors">
                Setup Initial Admin Account
              </Link>
            </div>
          </motion.div>
        )}

        <p className="text-center text-xs text-cream-300/40 mt-8">
          Kido Studio Admin — Authorized Access Only
        </p>
      </motion.div>
    </div>
  );
}
