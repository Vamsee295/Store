"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ShieldCheck, Clock, CheckCircle2, ArrowRight, HelpCircle, AlertCircle } from "lucide-react";

export default function ReturnsPage() {
  const steps = [
    {
      num: "01",
      title: "Initiate Your Request",
      desc: "Contact our concierge team at care@thirdshelf.store or submit a request via your Customer Sanctuary within 30 days of delivery.",
    },
    {
      num: "02",
      title: "Receive Prepaid Label",
      desc: "We will email you a prepaid, tracked return shipping label. For domestic US orders, standard return shipping is complimentary for store credit or exchanges ($5 label fee for refunds).",
    },
    {
      num: "03",
      title: "Box & Dispatch",
      desc: "Place the item back into its original protective packaging and drop it off at any authorized USPS or courier depot.",
    },
    {
      num: "04",
      title: "Quiet Refund Issued",
      desc: "Once received and verified at our fulfillment hub, your refund is processed back to your original payment method within 3–5 business days.",
    },
  ];

  return (
    <main className="container policy-page-container">
      {/* Header */}
      <div className="policy-header-section">
        <span className="eyebrow">Customer Guarantee · 30 Days</span>
        <h1 className="policy-display-title">Returns & Quiet Refunds</h1>
        <p className="policy-subtitle">
          We want every object on your shelf to feel intentional. If an item doesn&apos;t suit your space, our return process is calm, fair, and transparent.
        </p>
      </div>

      {/* 30-Day Guarantee Banner */}
      <div className="returns-guarantee-card">
        <div className="returns-guarantee-icon">
          <RotateCcw size={24} />
        </div>
        <div className="returns-guarantee-content">
          <h3 className="returns-guarantee-title">30-Day Quiet Return Window</h3>
          <p className="returns-guarantee-desc">
            You have 30 calendar days from the date of confirmed delivery to examine any product in your home. If it doesn&apos;t meet your standards of utility or craftsmanship, we will gladly accept its return.
          </p>
        </div>
      </div>

      {/* 4-Step Process */}
      <section className="policy-section">
        <h2 className="policy-section-heading">How to Return an Item</h2>
        <p className="policy-section-desc">
          Four simple steps to return or exchange any eligible product in our catalog.
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

      {/* Eligibility & Conditions */}
      <section className="policy-section">
        <h2 className="policy-section-heading">Eligibility & Condition Standards</h2>
        <div className="policy-cards-grid">
          <div className="policy-card">
            <h3 className="policy-card-title">Accepted Condition</h3>
            <p className="policy-card-text">
              Products must be in their original, undamaged condition with all accessories, cables, manuals, and original packaging components included.
            </p>
          </div>

          <div className="policy-card">
            <h3 className="policy-card-title">Damaged in Transit?</h3>
            <p className="policy-card-text">
              If an item arrives damaged or flawed during courier transit, contact us within 7 days with a photograph. We issue an immediate priority replacement at zero additional cost.
            </p>
          </div>

          <div className="policy-card">
            <h3 className="policy-card-title">Exclusions</h3>
            <p className="policy-card-text">
              Items marked &ldquo;Final Sale&rdquo; during seasonal archive clearances and digital gift cards cannot be returned or redeemed for cash.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="policy-bottom-cta">
        <div>
          <h3 className="bottom-cta-title">Ready to start a return or exchange?</h3>
          <p className="bottom-cta-desc">
            Our concierge team will generate your prepaid shipping label within 24 hours.
          </p>
        </div>
        <div className="bottom-cta-buttons">
          <Link href="/pages/contact" className="btn btn-primary">
            <span>Contact concierge</span>
            <ArrowRight size={13} />
          </Link>
          <Link href="/account/orders" className="btn btn-secondary">
            View your orders
          </Link>
        </div>
      </div>
    </main>
  );
}
