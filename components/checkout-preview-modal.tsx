"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, X, ExternalLink, ArrowRight } from "lucide-react";

interface CheckoutPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
  subtotal: number;
  note?: string;
  fallbackReason?: string;
}

export function CheckoutPreviewModal({
  isOpen,
  onClose,
  itemCount,
  subtotal,
  note,
  fallbackReason,
}: CheckoutPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(37, 37, 34, 0.65)",
        backdropFilter: "blur(8px)",
        animation: "modalFadeIn 0.2s ease-out forwards",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fffdfa",
          border: "1px solid var(--line)",
          borderRadius: 6,
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.18)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(247, 245, 240, 0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--accent)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--muted)",
              }}
            >
              Shopify Commerce Architecture
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "transparent",
              border: 0,
              padding: 4,
              cursor: "pointer",
              color: "var(--muted)",
              display: "flex",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 24px" }}>
          <h3
            id="checkout-modal-title"
            style={{
              fontFamily: "var(--serif)",
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "var(--foreground)",
              marginBottom: 10,
            }}
          >
            Checkout Handoff Ready
          </h3>

          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--muted)",
              marginBottom: 20,
            }}
          >
            Third Shelf routes all payment processing and fulfillment directly through Shopify&apos;s PCI-compliant SSL checkout. In this local development and preview environment, your order data has been prepared cleanly:
          </p>

          {/* Bag summary card */}
          <div
            style={{
              padding: "14px 18px",
              background: "var(--bg-subtle)",
              border: "1px solid var(--line)",
              borderRadius: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              fontSize: 12.5,
            }}
          >
            <div>
              <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                {itemCount} {itemCount === 1 ? "considered item" : "considered items"}
              </span>
              {note && (
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
                  Note: &ldquo;{note}&rdquo;
                </div>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>
                ${subtotal.toFixed(2)}
              </div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>Pre-tax subtotal</div>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
            {[
              "Cart payload formatted for Shopify Storefront API cartCreate mutation",
              "Dynamic shipping calculation and taxes handled automatically on handoff",
              "Supports Shop Pay, Apple Pay, Google Pay, and major credit cards",
              "Orders instantly synchronize with dropshipping fulfillment automation",
            ].map((text, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <CheckCircle2 size={15} style={{ color: "var(--foreground)", marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, lineHeight: 1.5, color: "var(--foreground)" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Developer guidance notice */}
          <div
            style={{
              padding: "12px 14px",
              background: "#fff9f0",
              border: "1px solid #fae1b8",
              borderRadius: 4,
              fontSize: 11,
              lineHeight: 1.5,
              color: "#7a5015",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0, color: "#b87315" }} />
            <div>
              <strong>Production Activation:</strong> Set your{" "}
              <code style={{ fontFamily: "var(--mono)", fontSize: 10, background: "rgba(0,0,0,0.05)", padding: "1px 4px", borderRadius: 3 }}>
                NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
              </code>{" "}
              and token in <code style={{ fontFamily: "var(--mono)", fontSize: 10, background: "rgba(0,0,0,0.05)", padding: "1px 4px", borderRadius: 3 }}>.env.local</code> to activate live redirection.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--line)",
            background: "rgba(247, 245, 240, 0.4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: "10px 18px", fontSize: 11.5 }}
          >
            Return to bag
          </button>
          <Link
            href="/collections/all"
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: "10px 18px", fontSize: 11.5, display: "flex", alignItems: "center", gap: 6 }}
          >
            <span>Continue exploring</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
