"use client";

import { useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "unavailable">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");
    // Honest status: no automated marketing email service (e.g. Klaviyo) is configured in environment
    setStatus("unavailable");
  };

  return (
    <section className="newsletter" style={{ background: "#252522", color: "#f7f5f0", textAlign: "center", padding: "84px 0" }}>
      <div className="container newsletter-inner">
        <div className="eyebrow" style={{ color: "#c7b9a7", marginBottom: 16 }}>
          A little more considered
        </div>
        <h2 className="display" style={{ fontSize: "clamp(44px, 5.5vw, 68px)", margin: "0 0 16px" }}>
          Good finds,
          <br />
          occasionally.
        </h2>
        <p style={{ fontSize: 14, color: "#c0bcb3", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Occasional notes on useful finds, everyday inspiration, and considered living. Nothing unnecessary.
        </p>

        {status === "unavailable" ? (
          <div
            style={{
              maxWidth: 460,
              margin: "0 auto",
              padding: "20px 24px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", marginBottom: 6 }}>
              Subscriptions Opening at Launch
            </div>
            <div style={{ fontSize: 12, color: "#c0bcb3", lineHeight: 1.6 }}>
              Our editorial newsletter platform is currently being prepared for catalog launch. Signups will open once the store goes live. For immediate inquiries, contact us at{" "}
              <a href="mailto:care@thirdshelf.store" style={{ color: "#ded4c4", textDecoration: "underline" }}>
                care@thirdshelf.store
              </a>
              .
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: 420,
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                borderBottom: status === "error" ? "1px solid #e57373" : "1px solid #77746d",
                paddingBottom: 4,
                alignItems: "center",
                transition: "border-color 0.2s ease",
              }}
            >
              <input
                aria-label="Email address"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                required
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 0,
                  background: "transparent",
                  color: "white",
                  height: 44,
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <button
                aria-label="Subscribe to newsletter"
                type="submit"
                style={{
                  border: 0,
                  background: "transparent",
                  color: "white",
                  padding: "0 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {status === "error" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#ef9a9a",
                  fontSize: 11,
                  marginTop: 8,
                }}
              >
                <AlertCircle size={13} />
                <span>{errorMessage}</span>
              </div>
            )}

            <small
              style={{
                display: "block",
                color: "#918d83",
                fontSize: 10,
                marginTop: 14,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              By subscribing, you agree to receive occasional editorial notes. You may quietly unsubscribe at any time.
            </small>
          </form>
        )}
      </div>
    </section>
  );
}
