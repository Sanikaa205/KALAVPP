"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { X, Check, AlertCircle, Heart, ShoppingBag } from "lucide-react";

// ─── Toast Store ────────────────────────────────────────────

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  icon?: "heart" | "cart" | "check" | "error";
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Helper
export function toast(message: string, type: Toast["type"] = "success", icon?: Toast["icon"]) {
  useToastStore.getState().addToast({ message, type, icon });
}

// ─── Toast Component ────────────────────────────────────────

function ToastIcon({ icon, type }: { icon?: Toast["icon"]; type: Toast["type"] }) {
  const className = "h-4 w-4";
  if (icon === "heart") return <Heart className={`${className} fill-current text-red-500`} />;
  if (icon === "cart") return <ShoppingBag className={`${className} text-amber-600`} />;
  if (icon === "error" || type === "error") return <AlertCircle className={`${className} text-red-500`} />;
  return <Check className={`${className} text-emerald-500`} />;
}

function ToastItem({ toast: t, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div
      className="flex items-center gap-3 bg-white border border-stone-200 shadow-lg rounded-lg px-4 py-3 min-w-[280px] max-w-[380px] animate-slide-in"
    >
      <ToastIcon icon={t.icon} type={t.type} />
      <p className="flex-1 text-sm text-stone-700">{t.message}</p>
      <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
