"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Truck,
  ShoppingBag,
  LogIn,
  AlertCircle
} from "lucide-react";
import { AccountNav } from "./account-nav";

interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt?: string;
  defaultAddress?: {
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
  } | null;
  orders?: {
    nodes: Array<{
      id: string;
      orderNumber: number;
      processedAt: string;
      financialStatus: string;
      fulfillmentStatus: string;
      totalPrice: { amount: string; currencyCode: string };
      lineItems: {
        nodes: Array<{
          title: string;
          quantity: number;
          variant?: {
            title: string;
            price: { amount: string };
          } | null;
        }>;
      };
    }>;
  };
}

export default function AccountOverviewPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    customer: CustomerData | null;
    authenticated: boolean;
    configured: boolean;
    message?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      try {
        const res = await fetch("/api/account");
        const json = await res.json();
        setData({
          customer: json.customer || null,
          authenticated: Boolean(json.authenticated),
          configured: Boolean(json.configured),
          message: json.message,
        });
      } catch (err) {
        console.error("Failed to load account:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, []);

  if (loading) {
    return (
      <main className="container account-page-container">
        <div className="account-loading-state">
          <div className="account-spinner" />
          <p>Retrieving your sanctuary details…</p>
        </div>
      </main>
    );
  }

  // 1. Unauthenticated or Unconfigured State
  // Strictly adhering to Rule 1 & Rule 2: Never show fabricated sample customer data
  if (!data?.authenticated || !data?.customer) {
    return (
      <main className="container account-page-container" style={{ maxWidth: 720, margin: "60px auto", padding: "0 20px" }}>
        <div className="auth-header" style={{ textAlign: "center", marginBottom: 32 }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: 8, color: "var(--muted)" }}>
            Customer Sanctuary
          </span>
          <h1 className="display" style={{ fontSize: 36, letterSpacing: "-.04em", marginBottom: 12 }}>
            Account Access
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
            Sign in to view your verified dispatches, tracking timelines, and saved delivery addresses.
          </p>
        </div>

        {!data?.configured && (
          <div className="account-preview-banner" style={{ marginBottom: 28, background: "#fbf8f2", borderColor: "#e4dcce" }}>
            <div className="account-preview-icon-wrap" style={{ color: "#7a6a4d" }}>
              <ShieldCheck size={18} />
            </div>
            <div className="account-preview-text" style={{ color: "#544937" }}>
              <strong>Shopify Integration Status:</strong> Customer accounts connect directly with your Shopify Storefront API when live credentials are set in <code>.env.local</code>. Fictional demo accounts are disabled to protect customer privacy and maintain commercial accuracy.
            </div>
          </div>
        )}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: "36px 32px",
            textAlign: "center",
            display: "grid",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--paper)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg)",
              }}
            >
              <LogIn size={24} strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "0 0 8px" }}>
              Ready to sign in?
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
              Existing patrons can sign in with their email address. If this is your first purchase, you can browse our catalog freely and register anytime.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360, margin: "10px auto 0", width: "100%" }}>
            <Link
              href="/login?redirectTo=/account"
              className="btn btn-primary"
              style={{ justifyContent: "center", padding: "12px 24px", fontSize: 13 }}
            >
              Sign in to your account
            </Link>

            <Link
              href="/signup?redirectTo=/account"
              className="btn btn-secondary"
              style={{ justifyContent: "center", padding: "12px 24px", fontSize: 13 }}
            >
              Create an account
            </Link>

            <div style={{ paddingTop: 12, borderTop: "1px solid var(--line)", marginTop: 6 }}>
              <Link
                href="/collections/all"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#252522",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                <ShoppingBag size={15} />
                <span>Continue shopping (Shop all)</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 2. Authenticated Real Customer Account
  const customer = data.customer;
  const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Member";
  const orders = customer.orders?.nodes || [];
  const latestOrder = orders[0];
  const totalOrdersCount = orders.length;

  return (
    <main className="container account-page-container">
      {/* Editorial Header */}
      <div className="account-header-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="account-eyebrow">Customer Sanctuary</div>
          <h1 className="account-display-title">Welcome back, {customer.firstName || "Member"}.</h1>
          <p className="account-header-subtitle">
            Manage your personal details, review past dispatches, and track incoming deliveries.
          </p>
        </div>

        {/* Prominent Shopping CTA on Dashboard */}
        <Link
          href="/collections/all"
          className="btn btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          <ShoppingBag size={15} strokeWidth={1.5} />
          <span>Continue shopping</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Account Grid */}
      <div className="account-layout-grid">
        {/* Navigation Sidebar */}
        <AccountNav
          customerName={fullName}
          email={customer.email}
          isPreview={false}
        />

        {/* Main Content Area */}
        <div className="account-main-content">
          {/* Quick Metrics Bar */}
          <div className="account-stats-row">
            <div className="account-stat-card">
              <div className="account-stat-label">Total Dispatches</div>
              <div className="account-stat-val">{totalOrdersCount}</div>
              <div className="account-stat-hint">Fulfilled to your address</div>
            </div>

            <div className="account-stat-card">
              <div className="account-stat-label">Default Shipping</div>
              <div className="account-stat-val">
                {customer.defaultAddress?.city
                  ? `${customer.defaultAddress.city}, ${customer.defaultAddress.province || customer.defaultAddress.country}`
                  : "Not set"}
              </div>
              <div className="account-stat-hint">Verified delivery destination</div>
            </div>

            <div className="account-stat-card">
              <div className="account-stat-label">Member Since</div>
              <div className="account-stat-val">
                {customer.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Verified"}
              </div>
              <div className="account-stat-hint">Third Shelf Patron</div>
            </div>
          </div>

          {/* Recent Order Spotlight */}
          <section className="account-section-card">
            <div className="account-section-header">
              <div>
                <h2 className="account-section-title">Recent Dispatch</h2>
                <p className="account-section-desc">Most recently processed order from our fulfillment partners.</p>
              </div>
              {orders.length > 0 && (
                <Link href="/account/orders" className="account-link-arrow">
                  <span>View all orders</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {latestOrder ? (
              <div className="account-order-preview-card">
                <div className="account-order-preview-meta">
                  <div className="account-order-id-group">
                    <span className="account-order-tag">Order #{latestOrder.orderNumber}</span>
                    <span className="account-order-date">
                      {new Date(latestOrder.processedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="account-order-status-badge fulfilled">
                    <CheckCircle2 size={13} />
                    <span>{latestOrder.fulfillmentStatus === "FULFILLED" ? "Delivered" : "In Transit"}</span>
                  </div>
                </div>

                {/* Line Items List */}
                <div className="account-order-items-list">
                  {latestOrder.lineItems.nodes.map((item, idx) => (
                    <div key={idx} className="account-order-item-row">
                      <div className="account-order-item-details">
                        <span className="account-order-item-title">{item.title}</span>
                        {item.variant?.title && (
                          <span className="account-order-item-variant">· {item.variant.title}</span>
                        )}
                        <span className="account-order-item-qty">× {item.quantity}</span>
                      </div>
                      <span className="account-order-item-price">
                        ${(Number(item.variant?.price?.amount || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="account-order-preview-footer">
                  <div className="account-order-total-group">
                    <span className="account-order-total-label">Total Paid:</span>
                    <span className="account-order-total-val">
                      ${Number(latestOrder.totalPrice.amount).toFixed(2)} {latestOrder.totalPrice.currencyCode}
                    </span>
                  </div>
                  <Link
                    href={`/account/orders`}
                    className="btn btn-secondary account-receipt-btn"
                  >
                    View receipt & tracking
                  </Link>
                </div>
              </div>
            ) : (
              <div className="account-empty-state">
                <Package size={28} strokeWidth={1.5} className="account-empty-icon" />
                <h3 className="account-empty-title">No dispatches yet</h3>
                <p className="account-empty-desc">
                  When you acquire considered objects from our catalog, their transit timeline and details will appear here.
                </p>
                <Link href="/collections/all" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <ShoppingBag size={15} />
                  <span>Explore the catalog</span>
                </Link>
              </div>
            )}
          </section>

          {/* Address & Concierge 2-column Grid */}
          <div className="account-cards-split">
            {/* Default Shipping Address Card */}
            <div className="account-subcard">
              <div className="account-subcard-header">
                <div className="account-subcard-title-wrap">
                  <MapPin size={16} strokeWidth={1.5} />
                  <h3 className="account-subcard-title">Default Address</h3>
                </div>
                <Link href="/account/addresses" className="account-subcard-action">
                  {customer.defaultAddress ? "Edit" : "Add"}
                </Link>
              </div>
              <div className="account-address-content">
                {customer.defaultAddress ? (
                  <address className="account-address-formatted">
                    <strong>{fullName}</strong>
                    <div>{customer.defaultAddress.address1}</div>
                    {customer.defaultAddress.address2 && <div>{customer.defaultAddress.address2}</div>}
                    <div>
                      {customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}
                    </div>
                    <div>{customer.defaultAddress.country}</div>
                    {customer.phone && <div className="account-address-phone">{customer.phone}</div>}
                  </address>
                ) : (
                  <p className="account-address-empty">
                    No address saved yet. Save a default delivery destination for faster checkout.
                  </p>
                )}
              </div>
            </div>

            {/* Concierge Assistance Card */}
            <div className="account-subcard concierge-card">
              <div className="account-subcard-header">
                <div className="account-subcard-title-wrap">
                  <HelpCircle size={16} strokeWidth={1.5} />
                  <h3 className="account-subcard-title">Customer Concierge</h3>
                </div>
              </div>
              <div className="account-concierge-body">
                <p>
                  Need assistance with an order, address change, or return? Our team responds within 24 hours.
                </p>
                <div className="account-concierge-features">
                  <div className="concierge-feature-item">
                    <CheckCircle2 size={13} />
                    <span>30-day quiet returns</span>
                  </div>
                  <div className="concierge-feature-item">
                    <CheckCircle2 size={13} />
                    <span>Direct carrier tracking</span>
                  </div>
                </div>
                <Link href="/pages/contact" className="btn btn-secondary concierge-cta">
                  Contact concierge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
