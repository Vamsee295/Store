"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle2,
  Truck,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Clock,
  RotateCcw,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { AccountNav } from "../account-nav";

interface OrderNode {
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
        image?: { url: string };
      } | null;
    }>;
  };
}

export default function AccountOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderNode[]>([]);
  const [customerName, setCustomerName] = useState("Member");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "DELIVERED" | "TRANSIT">("ALL");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/account");
        const json = await res.json();
        if (!json.authenticated || !json.customer) {
          router.replace("/login?redirectTo=/account/orders");
          return;
        }
        setOrders(json.customer.orders?.nodes || []);
        setCustomerName(`${json.customer.firstName || ""} ${json.customer.lastName || ""}`.trim() || "Member");
        setCustomerEmail(json.customer.email || "");
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [router]);

  const filteredOrders = orders.filter((o) => {
    if (filter === "DELIVERED") return o.fulfillmentStatus === "FULFILLED";
    if (filter === "TRANSIT") return o.fulfillmentStatus !== "FULFILLED";
    return true;
  });

  if (loading) {
    return (
      <main className="container account-page-container">
        <div className="account-loading-state">
          <div className="account-spinner" />
          <p>Loading your dispatches…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container account-page-container">
      {/* Header */}
      <div className="account-header-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="account-eyebrow">Customer Sanctuary</div>
          <h1 className="account-display-title">Orders & Dispatches</h1>
          <p className="account-header-subtitle">
            Track shipments, review past order receipts, and access support for your delivered goods.
          </p>
        </div>

        <Link
          href="/collections/all"
          className="btn btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", fontSize: 13, marginBottom: 8 }}
        >
          <ShoppingBag size={15} />
          <span>Continue shopping</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Layout Grid */}
      <div className="account-layout-grid">
        <AccountNav
          customerName={customerName}
          email={customerEmail}
          isPreview={false}
        />

        <div className="account-main-content">
          {/* Filter Bar */}
          <div className="orders-filter-row">
            <div className="orders-filter-pills">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={`orders-filter-btn ${filter === "ALL" ? "active" : ""}`}
              >
                All dispatches ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("DELIVERED")}
                className={`orders-filter-btn ${filter === "DELIVERED" ? "active" : ""}`}
              >
                Delivered
              </button>
              <button
                type="button"
                onClick={() => setFilter("TRANSIT")}
                className={`orders-filter-btn ${filter === "TRANSIT" ? "active" : ""}`}
              >
                In transit
              </button>
            </div>

            <div className="orders-summary-count">
              Showing {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
            </div>
          </div>

          {/* Orders Ledger */}
          {filteredOrders.length > 0 ? (
            <div className="orders-ledger-list">
              {filteredOrders.map((order) => {
                const isDelivered = order.fulfillmentStatus === "FULFILLED";
                const totalAmount = Number(order.totalPrice.amount).toFixed(2);

                return (
                  <article key={order.id} className="order-ledger-card">
                    {/* Order Card Top Bar */}
                    <div className="order-card-header">
                      <div className="order-card-meta-left">
                        <div className="order-number-badge">Order #{order.orderNumber}</div>
                        <div className="order-date-text">
                          Placed on{" "}
                          {new Date(order.processedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="order-card-meta-right">
                        <span className={`order-status-chip ${isDelivered ? "delivered" : "in-transit"}`}>
                          {isDelivered ? (
                            <>
                              <CheckCircle2 size={13} />
                              <span>Delivered</span>
                            </>
                          ) : (
                            <>
                              <Truck size={13} />
                              <span>In Transit</span>
                            </>
                          )}
                        </span>
                        <span className="order-payment-chip">
                          {order.financialStatus === "PAID" ? "Paid in full" : order.financialStatus}
                        </span>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="order-items-table">
                      {order.lineItems.nodes.map((item, idx) => {
                        const unitPrice = Number(item.variant?.price?.amount || 0);
                        const lineTotal = (unitPrice * item.quantity).toFixed(2);

                        return (
                          <div key={idx} className="order-table-row">
                            <div className="order-item-main">
                              <div className="order-item-icon-box">
                                <Package size={18} strokeWidth={1.5} />
                              </div>
                              <div className="order-item-text">
                                <span className="order-item-title">{item.title}</span>
                                {item.variant?.title && (
                                  <span className="order-item-variant">Variant: {item.variant.title}</span>
                                )}
                              </div>
                            </div>

                            <div className="order-item-qty">Qty: {item.quantity}</div>
                            <div className="order-item-price">${lineTotal}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Card Footer */}
                    <div className="order-card-footer">
                      <div className="order-footer-details">
                        <span className="order-total-label">Total order amount:</span>
                        <span className="order-total-amount">
                          ${totalAmount} {order.totalPrice.currencyCode}
                        </span>
                      </div>

                      <div className="order-footer-actions">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Order #${order.orderNumber} receipt details are stored in your Shopify account.`);
                          }}
                          className="btn btn-secondary order-receipt-btn"
                        >
                          <FileText size={14} />
                          <span>Receipt</span>
                        </a>

                        <Link
                          href="/pages/contact"
                          className="btn btn-secondary order-help-btn"
                        >
                          Need help?
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="account-empty-state">
              <Package size={32} strokeWidth={1.5} className="account-empty-icon" />
              <h3 className="account-empty-title">No orders found</h3>
              <p className="account-empty-desc">
                {filter !== "ALL"
                  ? "There are no orders matching the selected filter."
                  : "You have not placed any orders yet. Discover our curated catalog of everyday essentials."}
              </p>
              <Link href="/collections/all" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ShoppingBag size={15} />
                <span>Browse all products</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
