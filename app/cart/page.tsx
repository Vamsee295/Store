"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  Truck,
  RotateCcw,
  ShoppingBag,
  FileText,
  Check,
  ShieldCheck
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/components/auth-provider";
import { ProductIllustration } from "@/components/product-illustrations";
import { CheckoutPreviewModal } from "@/components/checkout-preview-modal";

const FREE_SHIPPING_THRESHOLD = 50;

export default function CartPage() {
  const {
    lines,
    count,
    subtotal,
    remove,
    update,
    undoRemove,
    lastRemoved,
    note,
    setNote
  } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [busy, setBusy] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [showNoteField, setShowNoteField] = useState(Boolean(note));

  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  async function handleCheckout() {
    setBusy(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note,
          lines: lines.map((l) => ({
            merchandiseId: l.product.variantId,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setPreviewModalOpen(true);
      }
    } catch {
      setPreviewModalOpen(true);
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) {
    return (
      <main className="container cart-page-container">
        <div className="account-loading-state" style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--muted)" }}>Loading your shopping bag…</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="container cart-page-container" style={{ maxWidth: 640, margin: "60px auto", padding: "0 20px" }}>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: "48px 32px",
            textAlign: "center",
            display: "grid",
            gap: 20,
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
              color: "#252522",
            }}
          >
            <ShoppingBag size={28} strokeWidth={1.5} />
          </div>
          <span className="eyebrow" style={{ color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
            Customer Sanctuary
          </span>
          <h1 className="display" style={{ fontSize: 30, margin: 0, color: "#252522" }}>
            Sign in required to view your bag.
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
            Third Shelf preserves your shopping bag, variant choices, and delivery preferences securely to your customer account. Sign in to access your bag or continue browsing.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/login?redirectTo=/cart&reason=cart"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px" }}
            >
              <span>Sign in to access bag</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/signup?redirectTo=/cart&reason=cart"
              className="btn btn-secondary"
              style={{ padding: "12px 24px" }}
            >
              <span>Create an account</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container cart-page-container">
      <div className="cart-page-header">
        <span className="eyebrow cart-eyebrow">Your Selection</span>
        <h1 className="display cart-page-title">
          Your bag <span className="cart-title-count">({count})</span>
        </h1>
      </div>

      {/* Free Shipping Meter */}
      <div className="cart-shipping-banner">
        <div className="meter-label-row">
          <Truck size={15} className="meter-icon" />
          <span className="meter-text">
            {amountToFreeShipping > 0
              ? `Add $${amountToFreeShipping.toFixed(2)} more for Free Courier Delivery`
              : "You've unlocked Free Domestic Courier Delivery!"}
          </span>
        </div>
        <div className="meter-bar-track">
          <div
            className={`meter-bar-fill ${freeShippingProgress >= 100 ? "complete" : ""}`}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Undo Notification Bar */}
      {lastRemoved && (
        <div className="cart-undo-bar">
          <span>Removed {lastRemoved.product.title}</span>
          <button type="button" onClick={undoRemove} className="undo-btn">
            <RotateCcw size={13} />
            <span>Undo removal</span>
          </button>
        </div>
      )}

      {lines.length === 0 ? (
        <div className="cart-empty-panel">
          <div className="empty-cart-icon-circle">
            <ShoppingBag size={32} />
          </div>
          <h2 className="display empty-cart-headline">Nothing here just yet.</h2>
          <p className="empty-cart-subtext">
            A considered find is waiting in our collection. Take your time exploring.
          </p>
          <Link className="btn empty-cart-btn" href="/collections/all">
            <span>Explore the collection</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="cart-main-grid">
          {/* Left Column: Line Items List */}
          <div className="cart-items-column">
            {lines.map(({ product, quantity }) => (
              <div key={product.variantId || product.id} className="cart-row-item">
                <Link href={`/products/${product.handle}`} className="cart-row-thumb">
                  {!product.id.startsWith("demo-") && product.image ? (
                    <img
                      src={product.image}
                      alt={product.imageAlt || product.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <ProductIllustration
                      handle={product.handle}
                      fallback={
                        product.image ? (
                          <img src={product.image} alt={product.title} />
                        ) : null
                      }
                    />
                  )}
                </Link>

                <div className="cart-row-info">
                  <div className="cart-row-header">
                    <div>
                      <Link href={`/products/${product.handle}`} className="cart-row-title">
                        {product.title}
                      </Link>
                      <div className="cart-row-category">{product.category}</div>
                    </div>
                    <div className="cart-row-price-single">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="cart-row-controls">
                    <div className="cart-row-stepper">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => update(product.id, quantity - 1)}
                        className="stepper-btn"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="stepper-count">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => update(product.id, quantity + 1)}
                        className="stepper-btn"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${product.title}`}
                      onClick={() => remove(product.id)}
                      className="cart-row-remove-btn"
                    >
                      <Trash2 size={15} />
                      <span>Remove</span>
                    </button>

                    <div className="cart-row-line-total">
                      ${(product.price * quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Order Note / Gift Message */}
            <div className="cart-note-card">
              {!showNoteField ? (
                <button
                  type="button"
                  onClick={() => setShowNoteField(true)}
                  className="cart-note-trigger"
                >
                  <FileText size={14} />
                  <span>{note ? "Edit order note / gift message" : "Add order note or gift instructions"}</span>
                </button>
              ) : (
                <div className="cart-note-editor">
                  <div className="cart-note-top">
                    <label htmlFor="cart-special-note" className="cart-note-label">
                      Special delivery instructions / gift note:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNoteField(false)}
                      className="cart-note-save"
                    >
                      <Check size={12} /> Done
                    </button>
                  </div>
                  <textarea
                    id="cart-special-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter any special requests, gate codes, or gift message…"
                    rows={3}
                    className="cart-note-textarea"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <aside className="cart-summary-column">
            <div className="cart-summary-card">
              <h2 className="summary-card-title">Order summary</h2>

              <div className="summary-row">
                <span>Subtotal ({count} items)</span>
                <span className="summary-val">${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span className="summary-val">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span style={{ color: "#3e7b4a", fontWeight: 600 }}>Free</span>
                  ) : (
                    "Calculated at checkout"
                  )}
                </span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row summary-total-row">
                <span>Estimated total</span>
                <span className="summary-total-val">${subtotal.toFixed(2)}</span>
              </div>

              <p className="summary-disclaimer">
                Taxes, customs, and final shipping options will be confirmed by Shopify during checkout.
              </p>

              <button
                type="button"
                className="btn cart-checkout-btn"
                disabled={busy}
                onClick={handleCheckout}
              >
                <span>{busy ? "Preparing checkout…" : "Continue to checkout"}</span>
                <ArrowRight size={15} />
              </button>

              <div className="cart-trust-badges">
                <div className="cart-trust-item">
                  <ShieldCheck size={14} />
                  <span>Secure Shopify checkout</span>
                </div>
                <div className="cart-trust-item">
                  <RotateCcw size={14} />
                  <span>30-day quiet returns</span>
                </div>
              </div>

              <Link href="/collections/all" className="cart-continue-link">
                ← Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}

      <CheckoutPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        itemCount={count}
        subtotal={subtotal}
        note={note}
      />
    </main>
  );
}
