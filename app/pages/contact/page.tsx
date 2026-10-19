"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Clock, MapPin, Send, ArrowRight, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [topic, setTopic] = useState("Order Status & Tracking");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!name.trim()) {
      setValidationError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setValidationError("Please provide at least 10 characters in your message.");
      return;
    }

    const mailtoUrl = `mailto:care@thirdshelf.store?subject=${encodeURIComponent(
      `[Third Shelf Inquiry] ${topic}${orderNumber ? ` - Order #${orderNumber}` : ""}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n${orderNumber ? `Order Number: ${orderNumber}\n` : ""}Topic: ${topic}\n\nMessage:\n${message}`
    )}`;

    // Open user's native email client with pre-filled fields
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <main className="container contact-page-container">
      {/* Header */}
      <div className="contact-header-section">
        <span className="eyebrow">Customer Concierge</span>
        <h1 className="contact-display-title">We&apos;re here to help.</h1>
        <p className="contact-subtitle">
          Questions regarding product specifications, current dispatches, or quiet returns? Our concierge team responds directly at <strong>care@thirdshelf.store</strong>.
        </p>
      </div>

      <div className="contact-layout-grid">
        {/* Left: Contact Form */}
        <div className="contact-form-card">
          {submitted ? (
            <div className="contact-success-state">
              <Mail size={36} className="contact-success-icon" style={{ color: "#6b5e4f" }} />
              <h2 className="contact-success-title">Inquiry Draft Prepared</h2>
              <p className="contact-success-desc">
                Direct automated form processing is pending launch configuration. To ensure your inquiry regarding &ldquo;{topic}&rdquo; is received immediately, we have prepared an email draft to <strong>care@thirdshelf.store</strong>.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
                <a
                  href={`mailto:care@thirdshelf.store?subject=${encodeURIComponent(
                    `[Third Shelf Inquiry] ${topic}${orderNumber ? ` - Order #${orderNumber}` : ""}`
                  )}&body=${encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\n${orderNumber ? `Order Number: ${orderNumber}\n` : ""}Topic: ${topic}\n\nMessage:\n${message}`
                  )}`}
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <Send size={14} /> Open in Email Client
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                  }}
                  className="btn btn-secondary"
                >
                  Edit inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required">*</span>
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
              </div>

              <div className="contact-form-row">
                <div className="form-group">
                  <label htmlFor="topic" className="form-label">
                    Subject Topic <span className="required">*</span>
                  </label>
                  <select
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="form-select"
                  >
                    <option value="Order Status & Tracking">Order Status & Tracking</option>
                    <option value="Product & Specifications">Product Specifications & Materials</option>
                    <option value="Returns & Exchanges">Returns & Exchanges (30-Day Window)</option>
                    <option value="Press & Curation">Press & Brand Collaborations</option>
                    <option value="General Inquiry">General Question</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="orderNumber" className="form-label">
                    Order Number <span className="optional">(optional)</span>
                  </label>
                  <input
                    id="orderNumber"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. #1001"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Your Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our concierge assist you today?"
                  className="form-textarea"
                />
              </div>

              {validationError && (
                <div style={{ color: "#b91c1c", fontSize: 13, marginBottom: 16, background: "#fef2f2", padding: "10px 14px", borderRadius: 6, border: "1px solid #fecaca" }}>
                  {validationError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary contact-submit-btn"
              >
                <Send size={15} />
                <span>Prepare concierge inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Operational Details & Direct Channels */}
        <aside className="contact-info-column">
          <div className="contact-info-card">
            <h3 className="contact-info-title">Concierge Channels</h3>

            <div className="contact-channel-list">
              <div className="contact-channel-item">
                <div className="channel-icon-wrap">
                  <Mail size={17} />
                </div>
                <div>
                  <div className="channel-label">Direct Correspondence</div>
                  <a href="mailto:care@thirdshelf.store" className="channel-val">
                    care@thirdshelf.store
                  </a>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="channel-icon-wrap">
                  <Clock size={17} />
                </div>
                <div>
                  <div className="channel-label">Response Guarantee</div>
                  <div className="channel-val-static">Within 24 hours · Mon – Fri</div>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="channel-icon-wrap">
                  <MapPin size={17} />
                </div>
                <div>
                  <div className="channel-label">Studio & Fulfillment Hub</div>
                  <div className="channel-val-static">
                    Third Shelf Online Operations<br />
                    Direct support via concierge form & email<br />
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>Official registered business address pending owner configuration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-faq-preview-card">
            <div className="faq-preview-header">
              <HelpCircle size={17} />
              <h4>Instant Answers</h4>
            </div>
            <p>
              Looking for immediate assistance? Our comprehensive guides cover the most common questions:
            </p>
            <div className="faq-quick-links">
              <Link href="/pages/shipping" className="faq-quick-link">
                <span>Shipping rates & carrier timelines</span>
                <ArrowRight size={13} />
              </Link>
              <Link href="/pages/returns" className="faq-quick-link">
                <span>30-day quiet returns policy</span>
                <ArrowRight size={13} />
              </Link>
              <Link href="/pages/faq" className="faq-quick-link">
                <span>Frequently asked questions</span>
                <ArrowRight size={13} />
              </Link>
              <Link href="/pages/track-order" className="faq-quick-link">
                <span>Live dispatch tracking</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
