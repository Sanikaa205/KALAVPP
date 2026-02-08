"use client";

import { create } from "zustand";
import { toast } from "@/components/ui/toast";

interface WishlistState {
  productIds: Set<string>;
  loading: Set<string>;
  fetched: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  isToggling: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  productIds: new Set<string>(),
  loading: new Set<string>(),
  fetched: false,

  fetchWishlist: async () => {
    if (get().fetched) return;
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) return;
      const data = await res.json();
      const items = data.wishlistItems || data.items || [];
      const ids = new Set<string>(items.map((item: any) => item.productId || item.product?.id));
      set({ productIds: ids, fetched: true });
    } catch {
      // Not logged in or error — silently ignore
    }
  },

  toggleWishlist: async (productId: string) => {
    const { loading, productIds } = get();
    if (loading.has(productId)) return;

    // Optimistic update
    const wasWishlisted = productIds.has(productId);
    const newIds = new Set(productIds);
    const newLoading = new Set(loading);
    newLoading.add(productId);

    if (wasWishlisted) {
      newIds.delete(productId);
    } else {
      newIds.add(productId);
    }
    set({ productIds: newIds, loading: newLoading });

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        // Revert optimistic update
        const revertIds = new Set(get().productIds);
        if (wasWishlisted) revertIds.add(productId);
        else revertIds.delete(productId);
        set({ productIds: revertIds });

        if (res.status === 401) {
          toast("Please sign in to save items", "error", "error");
        } else {
          toast("Something went wrong", "error", "error");
        }
        return;
      }

      const data = await res.json();
      if (data.added) {
        toast("Added to wishlist", "success", "heart");
      } else {
        toast("Removed from wishlist", "info", "heart");
      }
    } catch {
      // Revert on network error
      const revertIds = new Set(get().productIds);
      if (wasWishlisted) revertIds.add(productId);
      else revertIds.delete(productId);
      set({ productIds: revertIds });
      toast("Network error — try again", "error", "error");
    } finally {
      const finalLoading = new Set(get().loading);
      finalLoading.delete(productId);
      set({ loading: finalLoading });
    }
  },

  isWishlisted: (productId: string) => get().productIds.has(productId),
  isToggling: (productId: string) => get().loading.has(productId),
}));
