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
            />
          ) : (
            <div className="product-image-fallback">
              <span className="product-fallback-brand">Third Shelf</span>
              <span className="product-fallback-sub">Image in studio</span>
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
          className={`product-card-fav-btn ${isFav ? "is-fav" : ""}`}
        >
          <Heart size={14} fill={isFav ? "#c2410c" : "none"} strokeWidth={1.5} />
        </button>

        {product.badge && (
          <span className="product-card-badge">
            {product.badge}
          </span>
        )}

        {product.compareAt && product.compareAt > product.price && !product.badge && (
          <span className="product-card-badge">
            Special Edit
          </span>
        )}

        {!product.available && (
          <span className="product-card-badge product-card-badge-soldout">
            Sold Out
          </span>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <div className="product-title-row">
          <div className="product-name">{product.title}</div>
          <div className="product-price">
            {product.compareAt && product.compareAt > product.price && (
              <span className="product-price-compare">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
            <span className="product-price-current">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
