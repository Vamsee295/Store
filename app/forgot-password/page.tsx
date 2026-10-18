"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Info, Mail } from "lucide-react";
import { AuthIllustration } from "@/components/auth-illustration";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo");

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const validate = () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewNotice(null);
    setError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();

      if (res.status === 503 || data.configured === false) {
        // Storefront in preview mode
        setPreviewNotice(
          data.error ||
            "Preview Mode · Shopify Storefront API credentials are pending configuration. Live recovery emails are dispatched via Shopify once configured in .env.local."
        );
      } else if (!res.ok && res.status !== 200) {
        setError(data.error || "Unable to process password reset request. Please try again.");
      } else {
        // Always show generic confirmation per requirement 5 & 6:
        // "Generic confirmation wording that does not reveal whether an email address has an account."
        setSubmittedEmail(email.trim());
      }
    } catch {
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginHref = rawRedirect ? `/login?redirectTo=${encodeURIComponent(rawRedirect)}` : "/login";

  return (
    <div className="auth-page-container">
      {/* Return to login navigation */}
      <div className="auth-back-nav">
        <Link href={loginHref} className="auth-back-link">
          <ArrowLeft size={15} strokeWidth={1.5} />
          <span>Back to sign in</span>
        </Link>
      </div>

      <div className="auth-split-grid">
        {/* Left Column: Brand Editorial Artwork */}
        <div className="auth-illustration-col">
          <AuthIllustration variant="forgot-password" />
        </div>

        {/* Right Column: Clean, Spacious Forgot Password Form / Confirmation */}
        <div className="auth-form-col">
          <div className="auth-form-card">
            {submittedEmail ? (
              /* Success / Confirmation State */
              <div className="confirmation-card">
                <div className="confirmation-icon-circle">
                  <Mail size={24} className="confirmation-icon" />
                </div>
                <span className="eyebrow" style={{ display: "block", marginBottom: 8, color: "var(--muted)" }}>
                  Instructions sent
                </span>
                <h1 className="display confirmation-heading">Check your inbox.</h1>
                <p className="confirmation-body">
                  If an account exists for <strong>{submittedEmail}</strong>, you will receive password reset
                  instructions shortly. Please check your inbox and spam folder.
                </p>
                <div className="confirmation-actions">
                  <Link href={loginHref} className="btn confirmation-primary-btn">
                    Return to sign in
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedEmail(null);
                      setEmail("");
                    }}
                    className="btn-light confirmation-secondary-btn"
                  >
                    Try another email address
                  </button>
                </div>
              </div>
            ) : (
              /* Default Input State */
              <>
                <div className="auth-header">
                  <span className="eyebrow" style={{ display: "block", marginBottom: 8, color: "var(--muted)" }}>
                    Third Shelf · Security
                  </span>
                  <h1 className="display auth-heading">Forgot your password?</h1>
                  <p className="auth-subheading">
                    It happens. Enter the email address associated with your account and we&apos;ll help you reset it.
                  </p>
                </div>

                {/* Preview notice banner */}
                <div className="auth-preview-banner">
                  <Info size={15} className="auth-preview-icon" />
                  <div>
                    <strong>Preview Mode:</strong> In production, reset instructions are dispatched directly via Shopify
                    Storefront API once configured in <code>.env.local</code>.
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="auth-alert-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Preview Notice Banner */}
                {previewNotice && (
                  <div className="auth-alert-notice" role="status">
                    <Info size={16} />
                    <div>
                      <strong>Validation passed.</strong> {previewNotice}
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="auth-form">
                  <div className="form-field">
                    <label htmlFor="forgot-email" className="field-label">
                      Email address
                    </label>
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`auth-input ${error ? "has-error" : ""}`}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "email-error" : undefined}
                      disabled={loading}
                    />
                    {error && (
                      <p id="email-error" className="field-error">
                        {error}
                      </p>
                    )}
                  </div>

                  <button type="submit" disabled={loading} className="btn auth-submit-btn">
                    {loading ? (
                      <>
                        <Loader2 size={16} className="spinner" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <span>Send reset link</span>
                    )}
                  </button>
                </form>

                {/* Footer Navigation */}
                <div className="auth-footer-links">
                  <p className="auth-switch-text">
                    Remembered your password?{" "}
                    <Link href={loginHref} className="auth-action-link">
                      Back to sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loader2 className="spinner" size={24} style={{ color: "var(--muted)" }} />
          </div>
        }
      >
        <ForgotPasswordContent />
      </Suspense>
    </main>
  );
}
