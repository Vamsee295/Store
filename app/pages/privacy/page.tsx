"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `When you visit or make a purchase from Third Shelf, we collect necessary customer information to fulfill orders and provide concierge assistance. This includes:
- Identity Data: First name, last name, and customer account credentials.
- Contact Data: Email address, shipping destination, billing address, and telephone number.
- Transaction Data: Details of products acquired, order totals, and payment confirmation references. We do NOT store full credit card numbers or security CVV codes on our servers; all payment transactions are tokenized and processed directly by Shopify's Level 1 PCI-DSS compliant infrastructure.
- Technical & Device Data: IP address, browser type, operating system, and session cookies strictly necessary to maintain your shopping cart state.`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We process customer personal data only for lawful, legitimate business operations:
- To verify, process, package, and dispatch orders placed through our storefront.
- To transmit real-time shipment tracking links and order receipts.
- To provide concierge customer service and handle returns or exchanges.
- To detect and prevent fraudulent transactions.
- With your explicit consent, to transmit our bi-weekly editorial newsletter, "The Considered Edit" (which you may opt out of at any time).`,
    },
    {
      title: "3. Information Sharing & Third Parties",
      content: `Third Shelf does not sell, rent, or trade your personal data to third-party data brokers or marketing aggregators. We share information solely with verified operational service providers:
- Commerce Platform: Shopify Inc., which powers our checkout, inventory database, and order management engine.
- Shipping Couriers: USPS, FedEx, UPS, and DHL to physically deliver your parcels.
- Legal & Regulatory Compliance: When required by applicable law, search warrant, subpoena, or to protect our legal rights.`,
    },
    {
      title: "4. Cookies & Local Storage",
      content: `We utilize minimal, privacy-respecting cookies and client-side storage:
- Essential Session Cookies: To preserve items in your shopping bag and maintain authenticated customer sanctuary sessions.
- Performance & Security: To monitor server load and mitigate denial-of-service threats.
We do not employ cross-site invasive surveillance or third-party behavioral ad trackers.`,
    },
    {
      title: "5. Your Privacy Rights (GDPR & CCPA)",
      content: `Depending on your jurisdiction, you possess the right to:
- Access: Request a copy of the personal data we hold about you.
- Correction: Request correction of inaccurate or incomplete contact records.
- Deletion (The Right to be Forgotten): Request deletion of your customer sanctuary profile and order history, subject to statutory tax and accounting retention requirements.
- Opt-out: Unsubscribe from marketing communications instantly via the unsubscribe link in any email or within your Account Preferences.`,
    },
    {
      title: "6. Data Retention & Security",
      content: `We retain order transaction records for the duration required by applicable tax, commercial, and accounting laws. We employ SSL/TLS encryption for all data in transit, strict access control policies, and continuous security monitoring.`,
    },
    {
      title: "7. Contact Our Privacy Officer",
      content: `For any inquiries regarding this Privacy Policy or to exercise your statutory data protection rights, please contact our privacy team at privacy@thirdshelf.store or via our online concierge form (official registered business address pending owner configuration).`,
    },
  ];

  return (
    <main className="container policy-page-container">
      <div className="policy-header-section">
        <span className="eyebrow">Legal & Governance · Transparency</span>
        <h1 className="policy-display-title">Privacy Policy</h1>
        <p className="policy-subtitle">
          Last updated: October 2024. How Third Shelf collects, protects, and respects your personal data.
        </p>
      </div>

      <div className="legal-doc-card">
        <div className="legal-doc-banner">
          <ShieldCheck size={18} />
          <span>Compliant with GDPR, CCPA, and Shopify PCI-DSS Level 1 Security Standards</span>
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
