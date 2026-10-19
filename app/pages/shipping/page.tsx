"use client";

import React from "react";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, Globe, Package, CheckCircle2, ArrowRight } from "lucide-react";

export default function ShippingPage() {
  const tiers = [
    {
      region: "United States (Domestic)",
      method: "Standard Tracked Delivery",
      timeline: "3–5 business days",
      cost: "$4.95",
      freeThreshold: "Free on orders over $50",
    },
    {
      region: "United States (Domestic)",
      method: "Express Priority",
      timeline: "1–2 business days",
      cost: "$12.95",
      freeThreshold: "Flat rate priority dispatch",
    },
    {
      region: "Canada & Mexico",
      method: "International Standard",
      timeline: "5–8 business days",
      cost: "$8.95",
      freeThreshold: "Free on orders over $75",
    },
    {
      region: "United Kingdom & Europe",
      method: "International Tracked",
      timeline: "6–10 business days",
      cost: "$9.95",
      freeThreshold: "Free on orders over $90",
    },
    {
      region: "Australia & Rest of World",
      method: "Global Courier Service",
      timeline: "7–12 business days",
      cost: "$14.95",
      freeThreshold: "Calculated dynamically at checkout",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Order Verification",
      desc: "Your order details and inventory are verified instantly through Shopify's secure order processing network.",
    },
    {
      num: "02",
      title: "Considered Packing (24–48 hrs)",
      desc: "Each item is inspected, wrapped in plastic-minimal recyclable paper, and securely boxed for protection.",
    },
    {
      num: "03",
      title: "Direct Carrier Handoff",
      desc: "A tracking number is issued and emailed directly to your inbox with live carrier updates (USPS, FedEx, DHL).",
    },
    {
      num: "04",
      title: "Quiet Delivery",
      desc: "Arrives safely at your doorstep or workspace. Backed by our 30-day quiet returns guarantee.",
    },
  ];

  return (
    <main className="container policy-page-container">
      {/* Header */}
      <div className="policy-header-section">
        <span className="eyebrow">Store Policies · Transparency</span>
        <h1 className="policy-display-title">Shipping & Delivery</h1>
        <p className="policy-subtitle">
          Transparent shipping tiers, verified dispatch timelines, and live tracking for every destination we serve.
        </p>
      </div>

      {/* Free Shipping Highlight Banner */}
      <div className="shipping-perk-banner">
        <div className="shipping-perk-icon">
          <Truck size={22} />
        </div>
        <div className="shipping-perk-content">
          <h3 className="shipping-perk-title">Free Standard Delivery on Orders Over $50</h3>
          <p className="shipping-perk-desc">
            All domestic US orders qualifying for $50 or more automatically receive free tracked ground delivery at checkout.
          </p>
        </div>
      </div>

      {/* Shipping Tiers Table */}
      <section className="policy-section">
        <h2 className="policy-section-heading">Delivery Rates & Estimated Windows</h2>
        <p className="policy-section-desc">
          Final shipping fees and real-time courier options are confirmed transparently by Shopify during checkout based on your exact delivery address.
        </p>

        <div className="shipping-table-wrap">
          <table className="shipping-table">
            <thead>
              <tr>
                <th>Destination Region</th>
                <th>Service Tier</th>
                <th>Transit Window</th>
                <th>Standard Fee</th>
                <th>Complimentary Tier</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t, idx) => (
                <tr key={idx}>
                  <td className="font-semibold">{t.region}</td>
                  <td>{t.method}</td>
                  <td>
                    <span className="timeline-badge">
                      <Clock size={12} />
                      <span>{t.timeline}</span>
                    </span>
                  </td>
                  <td className="font-mono">{t.cost}</td>
                  <td className="highlight-cell">{t.freeThreshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The 4-Step Process */}
      <section className="policy-section">
        <h2 className="policy-section-heading">The Dispatch Journey</h2>
        <p className="policy-section-desc">
          From the moment you confirm your order to the day it arrives on your desk, every phase is carefully tracked.
        </p>

        <div className="shipping-steps-grid">
          {steps.map((s) => (
            <div key={s.num} className="shipping-step-card">
              <span className="step-num">{s.num}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packaging & Customs FAQs */}
      <section className="policy-section">
        <h2 className="policy-section-heading">Customs, Duties & Packaging</h2>
        <div className="policy-cards-grid">
          <div className="policy-card">
            <h3 className="policy-card-title">Sustainable Packaging</h3>
            <p className="policy-card-text">
              We eliminate single-use plastics wherever possible. Packages utilize unbleached Kraft corrugated cardboard, paper tape, and protective void-fill made from post-consumer recycled pulp.
            </p>
          </div>

          <div className="policy-card">
            <h3 className="policy-card-title">International Customs & VAT</h3>
            <p className="policy-card-text">
              For shipments outside the United States, applicable VAT, duties, and import fees are calculated and clearly itemized at checkout where supported, avoiding surprise fees upon delivery.
            </p>
          </div>

          <div className="policy-card">
            <h3 className="policy-card-title">Live Tracking Notifications</h3>
            <p className="policy-card-text">
              As soon as our fulfillment partners scan your parcel, you receive an automated dispatch notification with direct carrier tracking links (USPS, FedEx, DHL, or Shop app).
            </p>
          </div>
        </div>
      </section>

      {/* Help Banner */}
      <div className="policy-bottom-cta">
        <div>
          <h3 className="bottom-cta-title">Need to trace an existing dispatch?</h3>
          <p className="bottom-cta-desc">
            Use our self-service tracking lookup or speak with our concierge team.
          </p>
        </div>
        <div className="bottom-cta-buttons">
          <Link href="/pages/track-order" className="btn btn-secondary">
            <span>Track order</span>
            <ArrowRight size={13} />
          </Link>
          <Link href="/pages/contact" className="btn btn-primary">
            Contact concierge
          </Link>
        </div>
      </div>
    </main>
  );
}
