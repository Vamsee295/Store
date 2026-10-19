"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Search, X, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const SUGGESTIONS = [
  "Cable organizer",
  "Device stand",
  "Drawer organizer",
  "Packing cubes",
  "Water bottle",
  "Carry pouch",
  "Desk light",
  "Catchall tray",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [shopifyLive, setShopifyLive] = useState(false);
  const [, startTransition] = useTransition();

  // Load initial results and handle query debounce
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const url = query.trim()
          ? `/api/search?q=${encodeURIComponent(query.trim())}`
          : `/api/search`;
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          startTransition(() => {
            setProducts(data.products || []);
            setShopifyLive(Boolean(data.shopifyConfigured));
          });
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn("Search error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <main className="container" style={{ paddingTop: 60, paddingBottom: 100, minHeight: "70vh" }}>
      {/* Editorial Header */}
      <nav aria-label="Breadcrumb" className="catalog-breadcrumb" style={{ marginBottom: 20 }}>
        <Link href="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span>Search</span>
      </nav>

      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Thoughtful Product Discovery
      </div>
      <h1
        className="display"
        style={{
          fontSize: "clamp(42px, 5.5vw, 68px)",
          letterSpacing: "-0.04em",
          margin: "0 0 28px",
        }}
      >
        Search the shelf.
      </h1>

      {/* Main Search Input Form */}
      <div
        style={{
          position: "relative",
          maxWidth: 720,
          marginBottom: 20,
        }}
      >
        <label htmlFor="search-page-input" className="sr-only">
          Search products
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            paddingBottom: 14,
            borderBottom: "1.5px solid var(--ink)",
          }}
        >
          {loading ? (
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--muted)", flexShrink: 0 }} />
          ) : (
            <Search size={22} style={{ color: "var(--foreground)", flexShrink: 0 }} />
          )}

          <input
            id="search-page-input"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, room, materials, or keyword…"
            style={{
              width: "100%",
              border: 0,
              outline: 0,
              background: "transparent",
              fontSize: "clamp(18px, 2.2vw, 24px)",
              fontFamily: "inherit",
              color: "var(--foreground)",
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              style={{
                background: "transparent",
                border: 0,
                cursor: "pointer",
                padding: 6,
                color: "var(--muted)",
                display: "flex",
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Search Query Chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          marginBottom: 36,
          fontSize: 12,
        }}
      >
        <span style={{ color: "var(--muted)", marginRight: 4 }}>Curated suggestions:</span>
        {SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setQuery(tag)}
            style={{
              padding: "5px 11px",
              background: "rgba(37,37,34,0.05)",
              border: "1px solid var(--line)",
              borderRadius: 9999,
              fontSize: 11,
              color: "var(--foreground)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 12,
          borderBottom: "1px solid var(--line)",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--muted)" }}>
          {query.trim()
            ? `${products.length} ${products.length === 1 ? "find" : "finds"} matching “${query}”`
            : "Browse available collection"}
        </span>

        {!shopifyLive && (
          <span
            style={{
              fontSize: 10,
              color: "#8a6d3b",
              background: "#fff9f0",
              border: "1px solid #f2e2be",
              padding: "3px 8px",
              borderRadius: 4,
            }}
          >
            Preview catalog
          </span>
        )}
      </div>

      {/* Results Grid or Empty State */}
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="catalog-empty-card" style={{ marginTop: 20 }}>
          <div className="empty-icon-circle">
            <Sparkles size={24} className="empty-sparkle-icon" />
          </div>
          <h2 className="display empty-title">
            {query.trim() ? `No finds match “${query}”` : "No products available"}
          </h2>
          <p className="empty-description">
            {query.trim()
              ? "We couldn't locate any products matching your search term. Try searching for broader terms like “cable”, “home”, or “stand”."
              : "No items currently found in the catalog. Explore our curated collections."}
          </p>
          <div className="empty-actions">
            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="btn btn-empty-reset"
              >
                Clear search
              </button>
            )}
            <Link href="/collections/all" className="btn btn-light">
              <span>Explore all collections</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
