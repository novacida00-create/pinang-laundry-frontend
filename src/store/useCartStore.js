import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((s) => ({ items: [...s.items, item] })),
  clear: () => set({ items: [] })
}));