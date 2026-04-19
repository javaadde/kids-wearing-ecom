"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, MapPin, Phone, User, Hash, ChevronDown } from "lucide-react";
import Image from "next/image";

const WHATSAPP_NUMBER = "917593073393";

interface OrderItem {
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  category: string;
}

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  totalPrice: number;
}

export default function WhatsAppOrderModal({
  isOpen,
  onClose,
  items,
  totalPrice,
}: WhatsAppOrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    isKerala: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.district.trim()) newErrors.district = "District/City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Build WhatsApp message
    const itemLines = items
      .map(
        (item, i) =>
          `${i + 1}. *${item.name}*\n` +
          `   📦 Category: ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}\n` +
          `   📏 Size: ${item.size}\n` +
          `   🔢 Quantity: ${item.quantity}\n` +
          `   💰 Price: ₹${(item.price * item.quantity).toLocaleString()}`
      )
      .join("\n\n");

    const message =
      `🛍️ *New Order from KIDO Store*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `*ORDER ITEMS:*\n${itemLines}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *Total: ₹${totalPrice.toLocaleString()}*\n\n` +
      `*DELIVERY DETAILS:*\n` +
      `👤 Name: ${formData.name}\n` +
      `📱 Phone: ${formData.phone}\n` +
      `📍 Address: ${formData.address}\n` +
      `🏙️ District: ${formData.district}\n` +
      `📌 Kerala: ${formData.isKerala ? "Yes ✅" : "No ❌"}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed inset-x-4 top-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-[60] bg-cream-50 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-display font-black text-base uppercase tracking-tight">
                    Order via WhatsApp
                  </h2>
                  <p className="text-[10px] text-ink-muted font-medium tracking-wide">
                    Fill details to complete your order
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-cream-200 hover:bg-cream-300 transition-colors"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scroll px-6 py-5 space-y-5">
              {/* Order Summary */}
              <div className="space-y-3">
                <p className="section-label">Order Summary</p>
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-cream-100 rounded-xl p-3"
                    >
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-cream-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-ink truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-ink-muted mt-0.5">
                          {item.category.charAt(0).toUpperCase() +
                            item.category.slice(1)}{" "}
                          · Size: {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-display font-black text-sm flex-shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-cream-200">
                  <span className="font-display font-medium text-ink-muted text-sm">
                    Total
                  </span>
                  <span className="font-display font-black text-xl">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Form */}
              <div className="space-y-4">
                <p className="section-label">Delivery Details</p>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted flex items-center gap-1.5">
                    <User size={11} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 bg-cream-100 border rounded-xl text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20 transition-all ${
                      errors.name
                        ? "border-rust ring-1 ring-rust/20"
                        : "border-cream-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[10px] font-bold text-rust">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted flex items-center gap-1.5">
                    <Phone size={11} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    placeholder="10 digit phone number"
                    className={`w-full px-4 py-3 bg-cream-100 border rounded-xl text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20 transition-all ${
                      errors.phone
                        ? "border-rust ring-1 ring-rust/20"
                        : "border-cream-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[10px] font-bold text-rust">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted flex items-center gap-1.5">
                    <MapPin size={11} /> Delivery Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="House no, street, locality, landmark..."
                    rows={3}
                    className={`w-full px-4 py-3 bg-cream-100 border rounded-xl text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20 transition-all resize-none ${
                      errors.address
                        ? "border-rust ring-1 ring-rust/20"
                        : "border-cream-300"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[10px] font-bold text-rust">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* District */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted flex items-center gap-1.5">
                    <Hash size={11} /> District / City
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    placeholder="e.g. Ernakulam, Thrissur..."
                    className={`w-full px-4 py-3 bg-cream-100 border rounded-xl text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20 transition-all ${
                      errors.district
                        ? "border-rust ring-1 ring-rust/20"
                        : "border-cream-300"
                    }`}
                  />
                  {errors.district && (
                    <p className="text-[10px] font-bold text-rust">
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* Kerala Toggle */}
                <div className="flex items-center justify-between bg-cream-100 border border-cream-300 rounded-xl px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-ink-muted" />
                    <span className="text-sm font-bold text-ink">
                      Address in Kerala?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isKerala: !formData.isKerala })
                    }
                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                      formData.isKerala ? "bg-green-500" : "bg-cream-300"
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md ${
                        formData.isKerala ? "left-[calc(100%-1.625rem)]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer with submit */}
            <div className="border-t border-cream-200 px-6 py-5 flex-shrink-0 space-y-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-500/30"
              >
                <MessageCircle size={18} />
                Send Order on WhatsApp
              </motion.button>
              <button
                onClick={onClose}
                className="w-full text-center text-sm text-ink-muted hover:text-ink transition-colors font-medium py-1"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
