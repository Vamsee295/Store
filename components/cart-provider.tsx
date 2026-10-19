"use client";

import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import type { Product } from "@/lib/products";
import { useAuth } from "@/components/auth-provider";

export type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  note: string;
  lastRemoved: CartLine | null;
  add: (product: Product, quantity?: number) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setNote: (note: string) => void;
  undoRemove: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "third_shelf_bag_v1";
const NOTE_STORAGE_KEY = "third_shelf_bag_note_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNoteState] = useState("");
  const [lastRemoved, setLastRemoved] = useState<CartLine | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync with customer authentication: unauthenticated users have no local bag
  useEffect(() => {
    if (!isAuthenticated) {
      setLines([]);
      setIsHydrated(true);
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLines(JSON.parse(saved));
      }
      const savedNote = localStorage.getItem(NOTE_STORAGE_KEY);
      if (savedNote) {
        setNoteState(savedNote);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setIsHydrated(true);
  }, [isAuthenticated]);

  // Save to localStorage when lines change after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage unavailable
    }
  }, [lines, isHydrated]);

  const setNote = useCallback((newNote: string) => {
    setNoteState(newNote);
    try {
      localStorage.setItem(NOTE_STORAGE_KEY, newNote);
    } catch {
      // Storage unavailable
    }
  }, []);

  const add = useCallback((product: Product, quantity = 1) => {
    if (!isAuthenticated) return;
    setLines((old) => {
      const found = old.find((l) => l.product.variantId === product.variantId || l.product.id === product.id);
      if (found) {
        return old.map((l) =>
          l.product.variantId === product.variantId || l.product.id === product.id
            ? { ...l, quantity: Math.min(l.quantity + quantity, 99) }
            : l
        );
      }
      return [...old, { product, quantity }];
    });
    setIsOpen(true);
  }, [isAuthenticated]);

  const remove = useCallback(
    (id: string) => {
      setLines((old) => {
        const itemToRemove = old.find((l) => l.product.id === id || l.product.variantId === id);
        if (itemToRemove) {
          setLastRemoved(itemToRemove);
        }
        return old.filter((l) => l.product.id !== id && l.product.variantId !== id);
      });
    },
    []
  );

  const undoRemove = useCallback(() => {
    if (!lastRemoved) return;
    setLines((old) => [...old, lastRemoved]);
    setLastRemoved(null);
  }, [lastRemoved]);

  const update = useCallback((id: string, qty: number) => {
    setLines((old) =>
      qty <= 0
        ? old.filter((l) => l.product.id !== id && l.product.variantId !== id)
        : old.map((l) =>
            l.product.id === id || l.product.variantId === id
              ? { ...l, quantity: Math.min(qty, 99) }
              : l
          )
    );
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setLastRemoved(null);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const subtotal = useMemo(
    () => lines.reduce((acc, line) => acc + line.product.price * line.quantity, 0),
    [lines]
  );

  const count = useMemo(
    () => lines.reduce((acc, line) => acc + line.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      isOpen,
      note,
      lastRemoved,
      add,
      remove,
      update,
      clear,
      openCart,
      closeCart,
      toggleCart,
      setNote,
      undoRemove,
    }),
    [
      lines,
      count,
      subtotal,
      isOpen,
      note,
      lastRemoved,
      add,
      remove,
      update,
      clear,
      openCart,
      closeCart,
      toggleCart,
      setNote,
      undoRemove,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

