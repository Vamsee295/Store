"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  Layers,
  Heart,
} from "lucide-react";
import type { Product, ProductVariant } from "@/lib/products";
import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/components/auth-provider";
import { ProductIllustration } from "@/components/product-illustrations";
import { ProductCard } from "@/components/product-card";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  demoMode: boolean;
}

export function ProductDetailView({ product, relatedProducts, demoMode }: ProductDetailViewProps) {
  const { add } = useCart();
  const { isAuthenticated, requireAuth, toggleFavourite, isFavourite } = useAuth();
  const isFav = isFavourite(product.handle);
  const [pendingToast, setPendingToast] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const purchaseSectionRef = useRef<HTMLDivElement>(null);

  const isDemo = product.id.startsWith("demo-");

  // Check if returning from login with a preserved pending action
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");

    if (action && isAuthenticated) {
      if (action === "add_to_cart") {
        const variantId = params.get("variantId");
        const qty = Math.max(1, parseInt(params.get("quantity") || "1", 10));
        const targetVariant = product.variants?.find((v) => v.id === variantId) || selectedVariant;

        const productToAdd: Product = {
          ...product,
          price: targetVariant?.price ?? product.price,
          variantId: targetVariant?.id ?? product.variantId,
          title: targetVariant ? `${product.title} — ${targetVariant.title}` : product.title,
        };

        for (let i = 0; i < qty; i++) {
          add(productToAdd);
        }

        setAdded(true);
        setPendingToast(`Welcome back! Added ${qty} to your shopping bag.`);
        setTimeout(() => {
          setAdded(false);
          setPendingToast(null);
        }, 3500);
      } else if (action === "favourite") {
        toggleFavourite(product.handle);
        setPendingToast("Welcome back! Saved to your favourites.");
        setTimeout(() => setPendingToast(null), 3500);
      }

      // Clean action query parameters from browser URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [isAuthenticated, product, selectedVariant, add, toggleFavourite]);

  // Construct gallery items
  const galleryItems = React.useMemo(() => {
    if (isDemo) {
      const items: { url: string; altText: string; isIllustration?: boolean }[] = [
        { url: "", altText: "Editorial 2D vector artwork", isIllustration: true },
      ];
      if (product.images && product.images.length > 0) {
        product.images.forEach((imgUrl, i) => {
          items.push({
            url: imgUrl,
            altText: `${product.title} perspective ${i + 1}`,
            isIllustration: false,
          });
        });
      } else if (product.image) {
        items.push({
          url: product.image,
          altText: product.title,
          isIllustration: false,
        });
      }
      return items;
    }

    // Live Shopify product
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery.map((g, i) => ({
        url: g.url,
        altText: g.altText || `${product.title} photograph ${i + 1}`,
        isIllustration: false,
      }));
    }

    if (product.images && product.images.length > 0) {
      return product.images.map((url, i) => ({
        url,
        altText: product.imageAlt || `${product.title} photograph ${i + 1}`,
        isIllustration: false,
      }));
    }

    if (product.image) {
      return [
        {
          url: product.image,
          altText: product.imageAlt || product.title,
          isIllustration: false,
        },
      ];
    }

    return [];
  }, [isDemo, product]);

  // Active price based on selected variant or base product
  const activePrice = selectedVariant?.price ?? product.price;
  const activeCompareAt = selectedVariant?.compareAt ?? product.compareAt;
  const isVariantAvailable = selectedVariant ? selectedVariant.available : product.available;
  const variantStock = selectedVariant?.quantityAvailable ?? product.stockCount;

  // Listen for scroll to toggle sticky mobile bar
  useEffect(() => {
    const handleScroll = () => {
      if (!purchaseSectionRef.current) return;
      const rect = purchaseSectionRef.current.getBoundingClientRect();
      if (rect.bottom < 60) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.image?.url) {
      const matchIdx = galleryItems.findIndex((item) => item.url === v.image?.url);
      if (matchIdx !== -1) {
        setActiveMediaIndex(matchIdx);
      }
    }
  };

  const handleAddToCart = () => {
    if (!isVariantAvailable) return;

    // Login requirement gate: Browsing is public, adding to cart requires login
    if (!isAuthenticated) {
      requireAuth(`/products/${product.handle}`, "cart", {
        action: "add_to_cart",
        variantId: selectedVariant?.id ?? product.variantId,
        quantity: String(quantity),
      });
      return;
    }

    // Create customized product instance with selected variant
    const productToAdd: Product = {
      ...product,
      price: activePrice,
      variantId: selectedVariant?.id ?? product.variantId,
      title: selectedVariant ? `${product.title} — ${selectedVariant.title}` : product.title,
    };

    // Add designated quantity to bag
    for (let i = 0; i < quantity; i++) {
      add(productToAdd);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleFavourite = async () => {
    if (!isAuthenticated) {
      requireAuth(`/products/${product.handle}`, "favourites", {
        action: "favourite",
      });
      return;
    }
    await toggleFavourite(product.handle);
  };

  const currentMedia = galleryItems[activeMediaIndex] || galleryItems[0];

  return (
    <div className="pdp-container">
      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="pdp-breadcrumb">
        <Link href="/collections/all" className="pdp-back-link">
          <ArrowLeft size={14} />
          <span>Back to collection</span>
        </Link>
        <span className="breadcrumb-separator">/</span>
        <Link href={`/collections/${product.categoryHandle}`}>{product.category}</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="pdp-breadcrumb-active">{product.title}</span>
      </nav>

      {demoMode && (
        <div className="catalog-preview-banner" role="status" style={{ marginBottom: 32 }}>
          <div className="catalog-preview-dot" />
          <span>
            <strong>Editorial Preview:</strong> Real catalog specifications, live variant pricing, and Shopify checkout handoff synchronize once connected to your Shopify store.
          </span>
        </div>
      )}

      {/* Main Two-Column Product Layout */}
      <div className="pdp-layout-grid">
        {/* Left Column: Interactive Media Gallery */}
        <div className="pdp-gallery-column">
          <div className="pdp-main-media-viewport">
            {currentMedia?.isIllustration ? (
              <div className="pdp-vector-wrapper">
                <ProductIllustration
                  handle={product.handle}
                  fallback={<img src={product.image} alt={product.title} />}
                />
              </div>
            ) : currentMedia?.url ? (
              <div className="pdp-photo-wrapper">
                <img
                  src={currentMedia.url}
                  alt={currentMedia.altText || product.title}
                  className="pdp-photo-image"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ece8e0",
                  color: "var(--muted)",
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#5d564b", marginBottom: 6 }}>
                  Third Shelf Studio
                </span>
                <span style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase" }}>
                  Product photography in production
                </span>
              </div>
            )}

            {product.badge && (
              <span className="pdp-hero-badge">
                <Sparkles size={11} />
                <span>{product.badge}</span>
              </span>
            )}
          </div>

          {/* Interactive Thumbnail Gallery */}
          {galleryItems.length > 1 && (
            <div className="pdp-thumbnails-strip" role="tablist" aria-label="Product viewpoints">
              {galleryItems.map((item, idx) => (
                <button
                  key={item.url || idx}
                  type="button"
                  role="tab"
                  aria-selected={activeMediaIndex === idx}
                  aria-label={item.isIllustration ? "View editorial 2D vector artwork" : `View photograph ${idx + 1}`}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`pdp-thumb-btn ${activeMediaIndex === idx ? "active" : ""}`}
                >
                  <div className="pdp-thumb-preview">
                    {item.isIllustration ? (
                      <ProductIllustration handle={product.handle} />
                    ) : (
                      <img src={item.url} alt="" />
                    )}
                  </div>
                  <span className="pdp-thumb-label">
                    {item.isIllustration ? "Artwork" : `View ${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees Panel (Desktop) */}
          <div className="pdp-trust-grid">
            <div className="trust-card">
              <Truck size={18} className="trust-icon" />
              <div>
                <h3 className="trust-title">Considered Dispatch</h3>
                <p className="trust-desc">Carefully inspected and packed in plastic-free recycled materials.</p>
              </div>
            </div>
            <div className="trust-card">
              <RotateCcw size={18} className="trust-icon" />
              <div>
                <h3 className="trust-title">30-Day Quiet Trial</h3>
                <p className="trust-desc">Experience the find in your daily routine. Free returns if it doesn&apos;t earn its place.</p>
              </div>
            </div>
            <div className="trust-card">
              <ShieldCheck size={18} className="trust-icon" />
              <div>
                <h3 className="trust-title">Authentic Materials</h3>
                <p className="trust-desc">Honest finishes, durable construction, and transparent craftsmanship.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Purchase Details & Accordions */}
        <div className="pdp-panel-column">
          <div className="pdp-panel-sticky">
            <span className="eyebrow pdp-category-eyebrow">{product.category}</span>
            <h1 className="display pdp-title">{product.title}</h1>

            {/* Price & Compare At */}
            <div className="pdp-price-row">
              <span className="pdp-price">${activePrice.toFixed(2)}</span>
              {activeCompareAt && activeCompareAt > activePrice && (
                <span className="pdp-compare-at">${activeCompareAt.toFixed(2)}</span>
              )}
              <span className="pdp-tax-notice">Taxes and shipping calculated at checkout</span>
            </div>

            {/* Stock Availability Indicator */}
            <div className="pdp-stock-status">
              <span
                className={`stock-dot ${
                  isVariantAvailable ? "in-stock" : "out-of-stock"
                }`}
              />
              <span className="stock-text">
                {isVariantAvailable
                  ? typeof variantStock === "number" && variantStock > 0 && variantStock < 10
                    ? `Low stock · Only ${variantStock} units remaining in this batch`
                    : "In stock · Dispatches from studio hub in 24–48 hours"
                  : "Currently sold out · Join waitlist via concierge"}
              </span>
            </div>

            {/* Product Story / Description */}
            <p className="pdp-narrative">{product.description}</p>

            {/* Variant Picker (Colorways / Sizes) */}
            {product.variants && product.variants.length > 0 && (
              <div className="pdp-variants-section">
                <div className="variant-label-row">
                  <span className="variant-type-label">Select Option / Color:</span>
                  <span className="variant-selected-value">
                    {selectedVariant?.title || "Choose a variant"}
                  </span>
                </div>

                <div className="variant-options-row" role="radiogroup" aria-label="Available variants">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const isAvail = v.available;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={!isAvail}
                        onClick={() => handleVariantSelect(v)}
                        className={`pdp-variant-chip ${isSelected ? "selected" : ""} ${!isAvail ? "out-of-stock" : ""}`}
                        style={!isAvail ? { opacity: 0.5, cursor: "not-allowed", textDecoration: "line-through" } : {}}
                      >
                        {v.colorHex && (
                          <span
                            className="variant-swatch-circle"
                            style={{ backgroundColor: v.colorHex }}
                            aria-hidden="true"
                          />
                        )}
                        <span>{v.title}</span>
                        {!isAvail && <span style={{ fontSize: 10, marginLeft: 4 }}>(Sold out)</span>}
                        {isAvail && v.price !== product.price && (
                          <span className="variant-price-diff">${v.price.toFixed(2)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Preserved Action Resume Confirmation */}
            {pendingToast && (
              <div
                style={{
                  background: "#fbf8f2",
                  border: "1px solid #c8b99c",
                  borderRadius: 6,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#3d3426",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Check size={15} color="#2b6e4e" />
                <span>{pendingToast}</span>
              </div>
            )}

            {/* Quantity Selector, Add to Bag & Favourite CTAs */}
            <div ref={purchaseSectionRef} className="pdp-purchase-actions">
              <div className="pdp-quantity-selector" aria-label="Quantity selector">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  className="qty-btn"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="qty-btn"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!(selectedVariant ? selectedVariant.available : product.available)}
                className={`btn pdp-add-to-bag-btn ${added ? "added-state" : ""}`}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added {quantity} to bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>
                      {(selectedVariant ? selectedVariant.available : product.available)
                        ? `Add to bag · $${(activePrice * quantity).toFixed(2)}`
                        : "Currently sold out"}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleFavourite}
                aria-label={isFav ? "Remove from favourites" : "Save to favourites"}
                title={isFav ? "Saved in favourites" : "Save to favourites"}
                className="btn btn-secondary pdp-fav-btn"
                style={{
                  padding: "0 16px",
                  minWidth: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: isFav ? "#c2410c" : "var(--line)",
                  color: isFav ? "#c2410c" : "inherit",
                  background: isFav ? "rgba(194, 65, 12, 0.08)" : "transparent",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Heart size={18} fill={isFav ? "#c2410c" : "none"} strokeWidth={1.5} />
              </button>
            </div>

            {/* Micro Details List */}
            <div className="pdp-micro-highlights">
              <div className="highlight-item">
                <Check size={14} className="highlight-check" />
                <span>Thoughtfully selected and tested for everyday routines</span>
              </div>
              <div className="highlight-item">
                <Check size={14} className="highlight-check" />
                <span>Tracked shipping with verified carrier partners</span>
              </div>
            </div>

            {/* Editorial Accordions (Materials, Dimensions, Care, Shipping) */}
            <div className="pdp-accordions-group">
              <details className="pdp-accordion" open>
                <summary className="accordion-summary">
                  <div className="accordion-title-wrap">
                    <Layers size={14} className="accordion-icon" />
                    <span>Materials & Craftsmanship</span>
                  </div>
                  <ChevronDown size={14} className="accordion-arrow" />
                </summary>
                <div className="accordion-content">
                  <p>
                    {product.specs?.materials ||
                      "Crafted with durable, purposeful materials selected to age gracefully through daily use. Every surface and joint has been verified for tactile appeal and durability."}
                  </p>
                </div>
              </details>

              <details className="pdp-accordion">
                <summary className="accordion-summary">
                  <div className="accordion-title-wrap">
                    <Sparkles size={14} className="accordion-icon" />
                    <span>Dimensions & Specifications</span>
                  </div>
                  <ChevronDown size={14} className="accordion-arrow" />
                </summary>
                <div className="accordion-content">
                  <p>
                    <strong>Dimensions: </strong>
                    {product.specs?.dimensions || "Compact footprint calibrated for modern workspaces and home surfaces."}
                  </p>
                  {product.specs?.weight && (
                    <p style={{ marginTop: 8 }}>
                      <strong>Weight: </strong>
                      {product.specs.weight}
                    </p>
                  )}
                </div>
              </details>

              <details className="pdp-accordion">
                <summary className="accordion-summary">
                  <div className="accordion-title-wrap">
                    <Truck size={14} className="accordion-icon" />
                    <span>Shipping & Delivery Timelines</span>
                  </div>
                  <ChevronDown size={14} className="accordion-arrow" />
                </summary>
                <div className="accordion-content">
                  <p>
                    {product.specs?.shipping ||
                      "Orders dispatch within 24 to 48 business hours from our fulfillment partners. Real-time carrier tracking numbers are emailed as soon as the parcel enters transit."}
                  </p>
                  <p style={{ marginTop: 8 }}>
                    Shipping rates and destination delivery estimates are calculated transparently at checkout.
                  </p>
                </div>
              </details>

              <details className="pdp-accordion">
                <summary className="accordion-summary">
                  <div className="accordion-title-wrap">
                    <RotateCcw size={14} className="accordion-icon" />
                    <span>Care Instructions & Durability</span>
                  </div>
                  <ChevronDown size={14} className="accordion-arrow" />
                </summary>
                <div className="accordion-content">
                  <p>
                    {product.specs?.care ||
                      "Wipe gently with a dry or lightly dampened microfiber cloth. Avoid abrasive detergents, excessive heat, or prolonged direct sunlight."}
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar (Triggered on Scroll) */}
      <div className={`pdp-mobile-sticky-bar ${showStickyBar ? "visible" : ""}`}>
        <div className="mobile-sticky-info">
          <div className="mobile-sticky-thumb">
            {isDemo ? (
              <ProductIllustration handle={product.handle} />
            ) : product.image ? (
              <img
                src={product.image}
                alt={product.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#ece8e0" }} />
            )}
          </div>
          <div className="mobile-sticky-meta">
            <div className="mobile-sticky-title">{product.title}</div>
            <div className="mobile-sticky-price">
              ${activePrice.toFixed(2)}
              {selectedVariant && (
                <span className="mobile-sticky-variant"> · {selectedVariant.title}</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={handleToggleFavourite}
            aria-label={isFav ? "Remove from favourites" : "Save to favourites"}
            className="btn btn-secondary"
            style={{
              padding: "0 12px",
              height: 42,
              minWidth: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderColor: isFav ? "#c2410c" : "var(--line)",
              color: isFav ? "#c2410c" : "inherit",
              background: isFav ? "rgba(194, 65, 12, 0.08)" : "transparent",
              borderRadius: 4,
            }}
          >
            <Heart size={16} fill={isFav ? "#c2410c" : "none"} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isVariantAvailable}
            className="btn mobile-sticky-btn"
          >
            {added ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> {isVariantAvailable ? "Add to bag" : "Sold out"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contextual Recommendations / "You May Also Like" */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Complementary Essentials</span>
              <h2 className="section-title">Complete the setup.</h2>
            </div>
            <Link href={`/collections/${product.categoryHandle}`} className="pdp-view-category-link">
              <span>Explore more in {product.category}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
