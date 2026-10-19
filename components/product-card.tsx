"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductIllustration } from "@/components/product-illustrations";
import { useAuth } from "@/components/auth-provider";

export function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const { isAuthenticated, requireAuth, toggleFavourite, isFavourite } = useAuth();
  const isFav = isFavourite(product.handle);
  const isDemo = product.id.startsWith("demo-");
  const hasPhoto = Boolean(product.image && !imgError);

  return (
    <Link href={`/products/${product.handle}`} className="product-card group">
      <div className="product-image">
        {/* If live Shopify product or item with real photograph, render authentic image */}
        {!isDemo ? (
          hasPhoto ? (
            <img
              src={product.image}
              alt={product.imageAlt || product.title}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#ece8e0",
                color: "var(--muted)",
                padding: 16,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 16,
                  color: "#5d564b",
                  marginBottom: 4,
                }}
              >
                Third Shelf
              </span>
              <span style={{ fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>
                Image in studio
              </span>
            </div>
          )
        ) : (
          /* Demo fixture preview with 2D vector editorial artwork */
          <div className="product-illustration-wrapper">
            <ProductIllustration
              handle={product.handle}
              fallback={
                hasPhoto ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    onError={() => setImgError(true)}
                  />
                ) : null
              }
            />
          </div>
        )}

        {/* Favourite Quick-Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isAuthenticated) {
              requireAuth(`/products/${product.handle}`, "favourites", { action: "favourite" });
              return;
            }
            toggleFavourite(product.handle);
          }}
          aria-label={isFav ? "Remove from favourites" : "Save to favourites"}
          title={isFav ? "Saved in favourites" : "Save to favourites"}
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            background: "rgba(247, 245, 240, 0.94)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "50%",
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 4,
            color: isFav ? "#c2410c" : "#666",
            transition: "transform 0.15s ease, background 0.15s ease",
          }}
        >
          <Heart size={14} fill={isFav ? "#c2410c" : "none"} strokeWidth={1.5} />
        </button>

        {product.badge && (
          <span
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              background: "var(--paper)",
              padding: "7px 9px",
              fontSize: 9,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              zIndex: 2,
            }}
          >
            {product.badge}
          </span>
        )}

        {product.compareAt && product.compareAt > product.price && !product.badge && (
          <span
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              background: "var(--paper)",
              padding: "7px 9px",
              fontSize: 9,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              zIndex: 2,
            }}
          >
            Special Edit
          </span>
        )}

        {!product.available && (
          <span
            style={{
              position: "absolute",
              left: 12,
              bottom: 12,
              background: "var(--white)",
              padding: "7px 9px",
              fontSize: 9,
              zIndex: 2,
            }}
          >
            Sold Out
          </span>
        )}
      </div>

      <div className="product-info">
        <div>
          <div className="product-name">{product.title}</div>
          <div className="product-category">{product.category}</div>
        </div>
        <div className="product-price" style={{ textAlign: "right" }}>
          {product.compareAt && product.compareAt > product.price && (
            <span
              style={{
                textDecoration: "line-through",
                color: "var(--muted)",
                marginRight: 6,
                fontSize: 11,
              }}
            >
              ${product.compareAt.toFixed(2)}
            </span>
          )}
          <span>${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
