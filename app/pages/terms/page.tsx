"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Overview & Agreement",
      content: `This website is operated by Third Shelf. Throughout the site, the terms "we", "us", and "our" refer to Third Shelf. By accessing our website, browsing our catalog, or making a purchase, you engage in our "Service" and agree to be bound by these Terms of Service. Please read them carefully before transacting.`,
    },
    {
      title: "2. Online Store & Eligibility",
      content: `By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence. You may not use our products or services for any unauthorized or illegal purpose, nor violate any laws in your jurisdiction (including copyright laws).`,
    },
    {
      title: "3. Product Curation, Specifications & Availability",
      content: `We take tremendous pride in the accuracy of our product specifications, dimensions, materials, and editorial artwork. However, because materials such as natural stone, walnut wood, and anodized aluminum possess organic variations, slight grain and tonal differences may occur. All items are subject to supplier availability, and we reserve the right to limit order quantities per patron or per household where necessary.`,
    },
    {
      title: "4. Pricing, Taxes & Payment Verification",
      content: `All prices displayed on the storefront are denominated in USD unless a localized market currency is selected. Prices are subject to change without notice. Shipping charges, local state sales taxes, and international customs duties are calculated transparently during the Shopify checkout flow before you finalize payment.`,
    },
    {
      title: "5. Order Acceptance & Shopify Checkout",
      content: `Receipt of an order confirmation email does not signify our final acceptance of your order. We reserve the right at any time after receipt of your order to accept or decline it for reasons including inventory discrepancy, suspected payment fraud, or shipping destination limitations. In the event of an order cancellation, any charged amount is refunded immediately to your original payment method.`,
    },
    {
      title: "6. Shipping, Risk of Loss & Delivery",
      content: `Risk of loss and title for all products purchased from Third Shelf pass to you upon our delivery of the package to the authorized shipping courier (USPS, FedEx, DHL). In the rare event of transit damage or loss, please contact our concierge team within 7 calendar days to initiate an insured replacement.`,
    },
    {
      title: "7. Returns, Refunds & Cancellations",
      content: `Our return policy provides a 30-calendar-day quiet examination period from the date of confirmed delivery. Returns must comply with our standard condition requirements (unaltered, in original packaging). Please review our full Returns & Refunds Policy for specific return address procedures.`,
    },
    {
      title: "8. Limitation of Liability & Governing Law",
      content: `In no case shall Third Shelf, our directors, employees, affiliates, or suppliers be liable for any indirect, incidental, punitive, or consequential damages arising from your use of any product acquired through our service. Governing law and dispute resolution apply according to the store's confirmed registered business location and applicable commercial trade regulations.`,
    },
    {
      title: "9. Contact Information",
      content: `Questions regarding these Terms of Service should be directed to our customer concierge team at concierge@thirdshelf.store or via our online concierge form (official registered business entity and address pending owner configuration).`,
    },
  ];

  return (
    <main className="container policy-page-container">
      <div className="policy-header-section">
        <span className="eyebrow">Legal & Governance · Conditions</span>
        <h1 className="policy-display-title">Terms of Service</h1>
        <p className="policy-subtitle">
          Last updated: October 2024. The operational guidelines governing your relationship with Third Shelf.
        </p>
      </div>

      <div className="legal-doc-card">
        <div className="legal-doc-banner">
          <FileText size={18} />
          <span>Commercial Terms of Sale & Service Standards</span>
        </div>

        <div className="legal-sections-list">
          {sections.map((sec, idx) => (
            <div key={idx} className="legal-section-block">
              <h2 className="legal-section-title">{sec.title}</h2>
              <div className="legal-section-body">
                {sec.content.split("\n").map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
