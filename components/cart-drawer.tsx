"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Check,
  RotateCcw,
  FileText
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/components/auth-provider";
import { ProductIllustration } from "@/components/product-illustrations";
import { CheckoutPreviewModal } from "@/components/checkout-preview-modal";

export function CartDrawer() {
  const { isAuthenticated, requireAuth } = useAuth();
  const {
    lines,
    count,
    subtotal,
    isOpen,
    closeCart,
    update,
    remove,
    undoRemove,
    lastRemoved,
    note,
    setNote
  } = useCart();

  const [busy, setBusy] = useState(false);
  const [showNoteField, setShowNoteField] = useState(Boolean(note));
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;


  async function handleCheckout() {
    if (!isAuthenticated) {
      closeCart();
      requireAuth("/cart", "checkout");
      return;
    }

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

  return (
    <div className="cart-drawer-backdrop" onClick={closeCart} role="dialog" aria-modal="true" aria-label="Shopping bag drawer">
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <ShoppingBag size={18} className="drawer-header-icon" />
            <h2 className="drawer-title">Your Bag</h2>
            <span className="drawer-count-badge">({count})</span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="drawer-close-btn"
            aria-label="Close bag drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Shipping Notice */}
        <div className="drawer-shipping-meter">
          <div className="meter-label-row">
            <Truck size={14} className="meter-icon" />
            <span className="meter-text">
              Taxes and international shipping calculated at checkout
            </span>
          </div>
        </div>

        {/* Undo Notification Banner */}
        {lastRemoved && (
          <div className="drawer-undo-bar">
            <span>Removed {lastRemoved.product.title}</span>
            <button type="button" onClick={undoRemove} className="undo-btn">
              <RotateCcw size={12} />
              <span>Undo</span>
            </button>
          </div>
        )}

        {/* Drawer Scrollable Content */}
        <div className="drawer-content">
          {!isAuthenticated ? (
            <div className="drawer-empty-view" style={{ padding: "40px 20px", textAlign: "center" }}>
              <div className="empty-drawer-icon">
                <ShoppingBag size={28} />
              </div>
              <h3 className="empty-drawer-title" style={{ fontSize: 18, color: "#252522", marginBottom: 6 }}>
                Sign in required
              </h3>
              <p className="empty-drawer-desc" style={{ fontSize: 13, color: "var(--muted)", maxWidth: 280, margin: "0 auto 18px", lineHeight: 1.5 }}>
                Your shopping bag is tied to your verified Third Shelf customer account.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  closeCart();
                  requireAuth("/cart", "cart");
                }}
                style={{ padding: "10px 20px", fontSize: 13, margin: "0 auto" }}
              >
                <span>Sign in / Register</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : lines.length === 0 ? (
            <div className="drawer-empty-view">
              <div className="empty-drawer-icon">
                <ShoppingBag size={28} />
              </div>
              <h3 className="empty-drawer-title">Your bag is empty</h3>
              <p className="empty-drawer-desc">
                Explore our curated collection of considered finds for everyday routines.
              </p>
              <Link
                href="/collections/all"
                onClick={closeCart}
                className="btn drawer-explore-btn"
              >
                <span>Explore the collection</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="drawer-items-list">
              {lines.map(({ product, quantity }) => (
                <div key={product.variantId || product.id} className="drawer-line-item">
                  <Link
                    href={`/products/${product.handle}`}
                    onClick={closeCart}
                    className="drawer-item-thumb"
                  >
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

                  <div className="drawer-item-details">
                    <div className="drawer-item-top">
                      <Link
                        href={`/products/${product.handle}`}
                        onClick={closeCart}
                        className="drawer-item-title"
                      >
                        {product.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        className="drawer-item-remove"
                        aria-label={`Remove ${product.title}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="drawer-item-category">{product.category}</div>

                    <div className="drawer-item-bottom">
                      <div className="drawer-qty-stepper">
                        <button
                          type="button"
                          onClick={() => update(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                          className="qty-step-btn"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="qty-step-val">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => update(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                          className="qty-step-btn"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className="drawer-item-subtotal">
                        ${(product.price * quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions (When bag has items) */}
        {lines.length > 0 && (
          <div className="drawer-footer">
            {/* Order Note Collapsible */}
            <div className="drawer-order-note-wrap">
              {!showNoteField ? (
                <button
                  type="button"
                  onClick={() => setShowNoteField(true)}
                  className="drawer-add-note-btn"
                >
                  <FileText size={12} />
                  <span>{note ? "Edit delivery note" : "Add note or gift message"}</span>
                </button>
              ) : (
                <div className="drawer-note-input-wrap">
                  <div className="drawer-note-header">
                    <label htmlFor="drawer-order-note" className="drawer-note-label">
                      Order note / delivery instructions:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNoteField(false)}
                      className="drawer-note-close"
                    >
                      <Check size={12} /> Save
                    </button>
                  </div>
                  <textarea
                    id="drawer-order-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Special instructions or gift note…"
                    rows={2}
                    className="drawer-note-textarea"
                  />
                </div>
              )}
            </div>

            {/* Subtotal Calculation */}
            <div className="drawer-subtotal-row">
              <span className="drawer-subtotal-label">Subtotal</span>
              <span className="drawer-subtotal-value">${subtotal.toFixed(2)}</span>
            </div>

            <p className="drawer-disclaimer">
              Taxes, duties, and verified shipping options are calculated at checkout.
            </p>

            {/* Primary Action Button */}
            <button
              type="button"
              disabled={busy}
              onClick={handleCheckout}
              className="btn drawer-checkout-btn"
            >
              <span>{busy ? "Preparing checkout…" : "Checkout"}</span>
              <ArrowRight size={15} />
            </button>

            {/* Secondary Link to /cart */}
            <div className="drawer-footer-links">
              <Link
                href="/cart"
                onClick={closeCart}
                className="drawer-view-bag-link"
              >
                View full bag page
              </Link>
            </div>
          </div>
        )}
      </div>

      <CheckoutPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        itemCount={count}
        subtotal={subtotal}
        note={note}
      />
    </div>
  );
}
