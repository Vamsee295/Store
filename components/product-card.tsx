"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { ProductIllustration } from "@/components/product-illustrations";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.handle}`} className="product-card group">
      <div className="product-image">
        <div className="product-illustration-wrapper">
          <ProductIllustration
            handle={product.handle}
            fallback={<img src={product.image} alt={product.title} loading="lazy" />}
          />
        </div>
        {product.badge && (
          <span style={{ position: "absolute", left: 12, top: 12, background: "var(--paper)", padding: "7px 9px", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", zIndex: 2 }}>
            {product.badge}
          </span>
        )}
        {!product.available && (
          <span style={{ position: "absolute", left: 12, bottom: 12, background: "var(--white)", padding: "7px 9px", fontSize: 9, zIndex: 2 }}>
            Unavailable
          </span>
        )}
      </div>
      <div className="product-info">
        <div>
          <div className="product-name">{product.title}</div>
          <div className="product-category">{product.category}</div>
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>
      </div>
    </Link>
  );
}
