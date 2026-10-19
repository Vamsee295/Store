"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Package, CheckCircle2, AlertCircle } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum.trim() || !email.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/track-order?order=${encodeURIComponent(orderNum.trim())}&email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      setResult(data.order || null);
      if (data.message) {
        setErrorMessage(data.message);
      }
    } catch {
      setResult(null);
      setErrorMessage("Unable to connect to order tracking service. Please try again or contact customer care.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container track-page-container">
      {/* Header */}
      <div className="track-header-section">
        <span className="eyebrow">Self-Service Lookup · Real-Time</span>
        <h1 className="track-display-title">Track Your Dispatch</h1>
        <p className="track-subtitle">
          Enter your Third Shelf order number and the email address used during checkout to view live transit milestones.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="track-lookup-card">
        <form onSubmit={handleLookup} className="track-form">
          <div className="track-inputs-row">
            <div className="form-group">
              <label htmlFor="orderNum" className="form-label">
                Order Number
              </label>
              <input
                id="orderNum"
                type="text"
                required
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                placeholder="e.g. #1001"
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Checkout Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. you@example.com"
                className="form-input"
              />
            </div>

            <div className="track-btn-wrap">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary track-search-btn"
              >
                {loading ? (
                  <span>Searching…</span>
                ) : (
                  <>
                    <Search size={15} />
                    <span>Track dispatch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tracking Results Area */}
      {searched && (
        <div className="track-result-section">
          {result ? (
            <div className="track-result-card">
              {/* Header */}
              <div className="track-result-header">
                <div>
                  <div className="track-result-order-num">Order #{result.orderNumber}</div>
                  <div className="track-result-carrier">
                    {result.carrier} · Tracking #<code>{result.trackingNumber}</code>
                  </div>
                </div>
                <div className="track-status-badge delivered">
                  <CheckCircle2 size={15} />
                  <span>{result.statusText}</span>
                </div>
              </div>

              {/* Transit Timeline */}
              <div className="track-timeline-wrap">
                <h3 className="track-timeline-heading">Transit Progress</h3>
                <div className="track-timeline-list">
                  {result.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="track-timeline-item completed">
                      <div className="timeline-node">
                        <CheckCircle2 size={14} />
                      </div>
                      <div className="timeline-text">
                        <div className="timeline-event-title">{event.title}</div>
                        <div className="timeline-event-time">{event.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in parcel */}
              <div className="track-items-wrap">
                <h3 className="track-items-heading">Parcel Contents</h3>
                <div className="track-items-list">
                  {result.items.map((item: any, idx: number) => (
                    <div key={idx} className="track-item-pill">
                      <Package size={14} />
                      <span>{item.title}</span>
                      <span className="track-item-variant">({item.variant})</span>
                      <span className="track-item-qty">×{item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="track-result-footer">
                <div>
                  Delivered safely to <strong>{result.destination}</strong>
                </div>
                <Link href="/pages/contact" className="btn btn-secondary track-help-btn">
                  Report issue with delivery
                </Link>
              </div>
            </div>
          ) : (
            <div className="track-not-found">
              <AlertCircle size={28} className="track-not-found-icon" />
              <h3>Order lookup status</h3>
              <p>
                {errorMessage || `We could not locate an order matching #${orderNum} with email ${email}. Please verify the details on your checkout receipt.`}
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
