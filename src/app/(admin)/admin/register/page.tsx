"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, ShieldPlus } from "lucide-react";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we actually need setup
    fetch("/api/admin/register")
      .then((res) => res.json())
      .then((data) => {
        setNeedsSetup(data.needsSetup);
        if (data.needsSetup === false) {
          // If setup already done, redirect to login
          router.push("/admin/login");
        }
      })
      .catch(() => setNeedsSetup(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success! Redirect to login
      router.push("/admin/login?setup=success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (needsSetup === null) return null;

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-cream-50/5 border border-cream-50/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-camel/20 rounded-2xl mb-4 text-camel">
              <ShieldPlus size={32} />
            </div>
            <h1 className="font-display font-black text-2xl text-cream-50 tracking-tight">
              Initial Admin Setup
            </h1>
            <p className="text-sm text-cream-300/60 mt-2">
              Create the primary administrator account for KIDO.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-display font-semibold text-cream-300 tracking-wide mb-2 uppercase">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-cream-50/5 border border-cream-50/10 text-cream-50 placeholder:text-cream-300/30 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-camel transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-cream-300 tracking-wide mb-2 uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-cream-50/5 border border-cream-50/10 text-cream-50 placeholder:text-cream-300/30 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-camel transition-colors"
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
                className="w-full bg-cream-50/5 border border-cream-50/10 text-cream-50 placeholder:text-cream-300/30 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-camel transition-colors"
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
              <p className="text-red-400 text-xs font-medium text-center bg-red-400/10 py-2 rounded-lg">
                {error}
              </p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-14 flex items-center justify-center gap-2 bg-camel text-ink font-display font-bold text-sm rounded-xl hover:bg-rust transition-colors mt-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
              ) : (
                <><UserPlus size={18} /> Create Admin Account</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-[10px] text-cream-300/30 mt-8 leading-relaxed uppercase tracking-widest">
            Security Notice: This page will be disabled automatically after the first admin is created.
          </p>
        </div>
      </div>
    </div>
  );
}
