"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type CartLine = { product: Product; quantity: number };
type CartContextValue = { lines: CartLine[]; count: number; add: (product: Product) => void; remove: (id: string) => void; update: (id: string, qty: number) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const add = useCallback((product: Product) => setLines(old => {
    const found = old.find(l => l.product.id === product.id);
    return found ? old.map(l => l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l) : [...old, { product, quantity: 1 }];
  }), []);
  const remove = useCallback((id: string) => setLines(old => old.filter(l => l.product.id !== id)), []);
  const update = useCallback((id: string, qty: number) => setLines(old => qty <= 0 ? old.filter(l => l.product.id !== id) : old.map(l => l.product.id === id ? { ...l, quantity: Math.min(qty, 99) } : l)), []);
  const clear = useCallback(() => setLines([]), []);
  const value = useMemo(() => ({ lines, count: lines.reduce((n,l)=>n+l.quantity,0), add, remove, update, clear }), [lines,add,remove,update,clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
