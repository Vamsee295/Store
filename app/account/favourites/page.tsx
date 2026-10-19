"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Check,
  Eye,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AccountNav } from "../account-nav";
import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/components/cart-provider";
import { ProductIllustration } from "@/components/product-illustrations";
import type { Product } from "@/lib/products";

export default function AccountFavouritesPage() {
  const router = useRouter();
  const { isAuthenticated, customer, loading: authLoading, requireAuth, toggleFavourite } = useAuth();
  const { add } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      requireAuth("/account/favourites", "favourites");
      return;
    }

    async function loadFavourites() {
      try {
        const res = await fetch("/api/account/favourites");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load favourites:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFavourites();
  }, [authLoading, isAuthenticated, requireAuth]);

  const handleRemove = async (handle: string) => {
    await toggleFavourite(handle);
    setProducts((prev) => prev.filter((p) => p.handle !== handle));
  };

  const handleAddToCart = (product: Product) => {
    add(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (authLoading || loading) {
    return (
      <main className="container account-page-container">
        <div className="account-loading-state">
          <div className="account-spinner" />
          <p>Retrieving your saved favourites…</p>
        </div>
      </main>
    );
  }

  const customerName = customer
    ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Member"
    : "Member";

  return (
    <main className="container account-page-container">
      {/* Header */}
      <div
        className="account-header-section"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div>
          <div className="account-eyebrow">Customer Sanctuary</div>
          <h1 className="account-display-title">Saved Favourites</h1>
          <p className="account-header-subtitle">
            Pieces you have earmarked for your daily setup. Saved securely to your verified account.
          </p>
        </div>

        <Link
          href="/collections/all"
          className="btn btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            fontSize: 13,
            marginBottom: 8,
          }}
        >
          <ShoppingBag size={15} />
          <span>Explore collection</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="account-layout-grid">
        <AccountNav
          customerName={customerName}
          email={customer?.email || ""}
          isPreview={false}
        />

        <div className="account-main-content">
          {products.length === 0 ? (
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--line)",
                borderRadius: 8,
                padding: "60px 24px",
                textAlign: "center",
                display: "grid",
                gap: 16,
                justifyItems: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--paper)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--muted)",
                }}
              >
                <Heart size={26} strokeWidth={1.5} />
              </div>
              <h2
                className="display"
                style={{ fontSize: 24, margin: 0, color: "#252522" }}
              >
                No saved items just yet.
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--muted)",
                  maxWidth: 420,
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                When exploring our edit, tap the heart icon on any piece to earmark it here. Your selections are kept permanently in your sanctuary.
              </p>
              <Link
                href="/collections/all"
                className="btn btn-primary"
                style={{
                  marginTop: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                }}
              >
                <span>Browse the collection</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {products.map((p) => {
                const isDemo = p.id.startsWith("demo-");
                const isAdded = Boolean(addedIds[p.id]);

                return (
                  <div
                    key={p.handle}
                    style={{
                      background: "#ffffff",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    }}
                  >
                    {/* Media Thumbnail */}
                    <Link
                      href={`/products/${p.handle}`}
                      style={{
                        position: "relative",
                        aspectRatio: "1/1",
                        background: "#f4f1ea",
                        display: "block",
                        overflow: "hidden",
                      }}
                    >
                      {!isDemo && p.image ? (
                        <img
                          src={p.image}
                          alt={p.imageAlt || p.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <ProductIllustration handle={p.handle} />
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(p.handle);
                        }}
                        aria-label={`Remove ${p.title} from favourites`}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background: "rgba(255, 255, 255, 0.92)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid var(--line)",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#c2410c",
                          zIndex: 2,
                        }}
                      >
                        <Heart size={15} fill="#c2410c" strokeWidth={0} />
                      </button>
                    </Link>

                    {/* Content */}
                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            color: "var(--muted)",
                            marginBottom: 4,
                          }}
                        >
                          {p.category}
                        </div>
                        <Link
                          href={`/products/${p.handle}`}
                          style={{
                            fontFamily: "var(--serif)",
                            fontSize: 17,
                            color: "#252522",
                            textDecoration: "none",
                            lineHeight: 1.3,
                            display: "block",
                            marginBottom: 8,
                          }}
                        >
                          {p.title}
                        </Link>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#383632",
                            marginBottom: 16,
                          }}
                        >
                          ${p.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <Link
                          href={`/products/${p.handle}`}
                          className="btn btn-secondary"
                          style={{
                            padding: "8px 12px",
                            fontSize: 12,
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Eye size={13} />
                          <span>View piece</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(p)}
                          disabled={!p.available}
                          className="btn btn-primary"
                          style={{
                            padding: "8px 12px",
                            fontSize: 12,
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: isAdded ? "#2b6e4e" : "#252522",
                          }}
                        >
                          {isAdded ? (
                            <>
                              <Check size={13} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={13} />
                              <span>{p.available ? "Add to bag" : "Sold out"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
