"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { X, Plus, Minus, ShoppingBag, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WhatsAppOrderModal from "./WhatsAppOrderModal";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const total = totalPrice();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const handleCheckoutWhatsApp = () => {
    setShowWhatsAppModal(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeCart}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
                <div>
                  <h2 className="font-display font-black text-lg tracking-tight uppercase">Your Bag</h2>
                  <p className="text-ink-muted text-xs mt-0.5 font-medium">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={closeCart}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-cream-200 hover:bg-cream-300 transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto custom-scroll px-6 py-4 space-y-4">
                <AnimatePresence>
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full gap-4 py-20"
                    >
                      <ShoppingBag size={48} strokeWidth={1} className="text-ink-faint" />
                      <p className="font-display font-semibold text-ink-muted text-center">
                        Your bag is empty
                      </p>
                      <Link href="/shop" onClick={closeCart} className="btn-primary text-sm px-6 py-3">
                        Start Shopping
                      </Link>
                    </motion.div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.size}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 bg-cream-100 rounded-xl p-3"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
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

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-semibold text-sm text-ink truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-ink-muted mt-1">Size: {item.size}</p>
                          <p className="font-display font-black text-sm mt-1">
                            ₹{item.price.toLocaleString()}
                          </p>

                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-2 bg-cream-200 rounded-full px-2 py-1">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() =>
                                  updateQuantity(item.productId, item.size, item.quantity - 1)
                                }
                                className="w-6 h-6 flex items-center justify-center"
                              >
                                <Minus size={12} />
                              </motion.button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() =>
                                  updateQuantity(item.productId, item.size, item.quantity + 1)
                                }
                                className="w-6 h-6 flex items-center justify-center"
                              >
                                <Plus size={12} />
                              </motion.button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.size)}
                              className="text-xs text-ink-muted hover:text-rust transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-cream-200 px-6 py-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-medium text-ink-muted text-sm">Total</span>
                    <span className="font-display font-black text-xl">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckoutWhatsApp}
                    className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-display font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-500/25"
                  >
                    <MessageCircle size={16} />
                    <span>Checkout via WhatsApp</span>
                  </motion.button>
                  <button
                    onClick={closeCart}
                    className="w-full text-center text-sm text-ink-muted hover:text-ink transition-colors font-medium py-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WhatsApp Order Modal for cart checkout */}
      <WhatsAppOrderModal
        isOpen={showWhatsAppModal}
        onClose={() => {
          setShowWhatsAppModal(false);
          clearCart();
          closeCart();
        }}
        items={items.map((item) => ({
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          category: "kids", // cart items don't track category individually
        }))}
        totalPrice={total}
      />
    </>
  );
}
