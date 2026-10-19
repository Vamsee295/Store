"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Search, HelpCircle, ArrowRight, Mail, RotateCcw, Truck, ShieldCheck } from "lucide-react";

interface FAQItem {
  id: string;
  category: "shipping" | "products" | "returns" | "orders";
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "f1",
    category: "shipping",
    question: "How long does shipping take, and how can I track my parcel?",
    answer: "Standard domestic US delivery typically takes 3 to 5 business days after order dispatch. Priority Express orders arrive within 1 to 2 business days. As soon as your parcel is packed and handed to the courier (USPS, FedEx, or DHL), you receive an automated email with your direct tracking link.",
  },
  {
    id: "f2",
    category: "shipping",
    question: "Do you offer free shipping?",
    answer: "Yes. All domestic US orders totaling $50 or more automatically receive complimentary standard tracked delivery at checkout. International orders qualify for free delivery at $75 (Canada) or $90 (Europe & UK).",
  },
  {
    id: "f3",
    category: "shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to Canada, the United Kingdom, the European Union, Australia, and selected global destinations. Shipping fees and any required import duties/VAT are calculated dynamically at checkout.",
  },
  {
    id: "f4",
    category: "returns",
    question: "What is your 30-day quiet return policy?",
    answer: "You have 30 calendar days from the day your package is marked as delivered to test any item in your space. If it does not fulfill its intended purpose or meet your aesthetic standards, we will provide a prepaid return label. Items must be in their original condition with all packaging materials included.",
  },
  {
    id: "f5",
    category: "returns",
    question: "How quickly are refunds issued?",
    answer: "Once our fulfillment hub inspects your returned package (usually within 48 hours of receipt), we process your refund immediately. Depending on your financial institution, funds appear on your original payment card within 3 to 5 business days.",
  },
  {
    id: "f6",
    category: "products",
    question: "How do you source and vet the products on Third Shelf?",
    answer: "We inspect each product candidate across four foundational benchmarks: purpose-led utility, material integrity (anodized aluminum, stoneware, weighted silicone, heavy canvas), visual restraint, and honest durability. We reject 95% of candidates to maintain a curated, uncluttered shelf.",
  },
  {
    id: "f7",
    category: "products",
    question: "Are the illustrations on category cards depictions of real products?",
    answer: "Our category card illustrations represent the thematic spirit and archetypes of each collection (such as Technology, Home, and Travel) rather than implying a specific single stock unit. Product detail pages feature precise photographs, technical dimensions, and exact variant specifications.",
  },
  {
    id: "f8",
    category: "orders",
    question: "Can I modify or cancel my order after placing it?",
    answer: "Because our fulfillment partners begin verification and packing within a short window, please contact care@thirdshelf.store immediately with your Order Number if you need to adjust an address or cancel. If your order has already been dispatched, you can initiate a return as soon as it arrives.",
  },
  {
    id: "f9",
    category: "orders",
    question: "Is checkout secure?",
    answer: "All transactions are processed through Shopify's PCI-DSS Level 1 certified SSL checkout engine. We never store or view your full credit card credentials. We support Shop Pay, Apple Pay, Google Pay, Visa, Mastercard, and American Express.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("f1");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCat = activeCategory === "all" || faq.category === activeCategory;
      const matchesQuery =
        !search.trim() ||
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [search, activeCategory]);

  return (
    <main className="container faq-page-container">
      {/* Header */}
      <div className="faq-header-section">
        <span className="eyebrow">Help Center · Assistance</span>
        <h1 className="faq-display-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">
          Instant guidance regarding shipping timelines, product craftsmanship, returns, and order management.
        </p>

        {/* Search Bar */}
        <div className="faq-search-box">
          <Search size={18} className="faq-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. shipping, return, aluminum, tracking)…"
            className="faq-search-input"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="faq-search-clear"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="faq-category-pills">
        {[
          { id: "all", label: "All Questions" },
          { id: "shipping", label: "Shipping & Transit" },
          { id: "returns", label: "30-Day Returns" },
          { id: "products", label: "Curation & Materials" },
          { id: "orders", label: "Orders & Checkout" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`faq-cat-btn ${activeCategory === cat.id ? "active" : ""}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="faq-accordion-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`faq-accordion-item ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                  className="faq-question-btn"
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <ChevronDown
                    size={17}
                    className={`faq-chevron ${isOpen ? "rotated" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="faq-answer-panel">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="faq-no-results">
            <HelpCircle size={28} className="faq-no-icon" />
            <h3>No matching questions found</h3>
            <p>Try searching for a different keyword or contact our concierge directly.</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="btn btn-secondary"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Bottom Concierge Card */}
      <div className="faq-concierge-card">
        <div className="faq-concierge-text">
          <h3>Need personal assistance?</h3>
          <p>
            Our dedicated customer concierge team is available to help with questions about order status, material details, or custom inquiries.
          </p>
        </div>
        <Link href="/pages/contact" className="btn btn-primary faq-concierge-cta">
          <span>Contact concierge</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}
