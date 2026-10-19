"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, Info, Compass, ArrowRight, ShoppingBag, Heart, ShieldCheck } from "lucide-react";
import { AuthIllustration } from "@/components/auth-illustration";
import { useAuth } from "@/components/auth-provider";

function safeRedirectPath(target: string | null): string {
  if (!target) return "/";
  // Protect against open redirects: must start with / and not // or contain a protocol
  if (target.startsWith("/") && !target.startsWith("//") && !target.includes("://") && !target.includes("\\")) {
    return target;
  }
  return "/";
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const rawRedirect = searchParams.get("redirectTo");
  const reason = searchParams.get("reason");
  const redirectTo = safeRedirectPath(rawRedirect);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [enteringPreview, setEnteringPreview] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    if (!password) {
      errs.password = "Please enter your password.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewNotice(null);
    setErrors({});

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();

      if (res.status === 503 || data.configured === false) {
        // Storefront is running in Preview Mode without live Shopify credentials
        setPreviewNotice(
          data.error ||
            "Preview Mode · Shopify Storefront API credentials are pending configuration. Live customer authentication will verify with your Shopify store once configured in .env.local."
        );
      } else if (!res.ok || data.error) {
        setErrors({ general: data.error || "Unable to sign in. Please verify your credentials." });
      } else if (data.success) {
        // Successful login with live Shopify customer token in httpOnly cookie
        await refresh();
        router.push(redirectTo);
      }
    } catch {
      setErrors({ general: "Network error occurred. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleEnterPreview = async () => {
    setEnteringPreview(true);
    try {
      const res = await fetch("/api/auth/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        await refresh();
        // Redirect to homepage or Shop All per requirement 1:
        // "Redirect me to the homepage or Shop All page after entering preview mode."
        const target = redirectTo && redirectTo !== "/login" && redirectTo !== "/" ? redirectTo : "/collections/all";
        router.push(target);
      } else {
        router.push("/collections/all");
      }
    } catch {
      router.push("/collections/all");
    } finally {
      setEnteringPreview(false);
    }
  };

  const signupParams = new URLSearchParams();
  if (rawRedirect) signupParams.set("redirectTo", rawRedirect);
  if (reason) signupParams.set("reason", reason);
  const signupHref = signupParams.toString() ? `/signup?${signupParams.toString()}` : "/signup";
  const forgotHref = rawRedirect ? `/forgot-password?redirectTo=${encodeURIComponent(rawRedirect)}` : "/forgot-password";

  return (
    <div className="auth-page-container">
      {/* Return to shop navigation */}
      <div className="auth-back-nav">
        <Link href="/collections/all" className="auth-back-link">
          <ArrowLeft size={15} strokeWidth={1.5} />
          <span>Continue shopping</span>
        </Link>
      </div>

      <div className="auth-split-grid">
        {/* Left Column: Brand Editorial Artwork */}
        <div className="auth-illustration-col">
          <AuthIllustration variant="login" />
        </div>

        {/* Right Column: Clean, Spacious Login Form */}
        <div className="auth-form-col">
          <div className="auth-form-card">
            {/* Header Titles */}
            <div className="auth-header">
              <span className="eyebrow" style={{ display: "block", marginBottom: 8, color: "var(--muted)" }}>
                Third Shelf · Account
              </span>
              <h1 className="display auth-heading">Good to see you again.</h1>
              <p className="auth-subheading">Sign in to pick up where you left off.</p>
            </div>

            {/* Contextual Action Gate Banner */}
            {reason === "cart" && (
              <div className="auth-alert-notice" role="status" style={{ marginBottom: 16 }}>
                <ShoppingBag size={16} />
                <div>
                  <strong>Account required to shop.</strong> Please sign in or create an account to add items to your shopping bag. We&apos;ll return you right back to your item.
                </div>
              </div>
            )}
            {reason === "favourites" && (
              <div className="auth-alert-notice" role="status" style={{ marginBottom: 16 }}>
                <Heart size={16} />
                <div>
                  <strong>Save to favourites.</strong> Please sign in or create an account to save pieces to your personal sanctuary.
                </div>
              </div>
            )}
            {reason === "checkout" && (
              <div className="auth-alert-notice" role="status" style={{ marginBottom: 16 }}>
                <ShieldCheck size={16} />
                <div>
                  <strong>Secure checkout.</strong> Please sign in to your account before proceeding to Shopify checkout.
                </div>
              </div>
            )}
            {reason === "account" && (
              <div className="auth-alert-notice" role="status" style={{ marginBottom: 16 }}>
                <Info size={16} />
                <div>
                  <strong>Customer sanctuary.</strong> Please sign in to view your verified orders, dispatches, and saved delivery addresses.
                </div>
              </div>
            )}

            {/* Preview notice banner */}
            <div className="auth-preview-banner">
              <Info size={15} className="auth-preview-icon" />
              <div>
                <strong>Preview Mode:</strong> Live customer authentication will connect with your Shopify Storefront API
                once credentials are added to <code>.env.local</code>. Form validation and interactions are active.
              </div>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div className="auth-alert-error" role="alert">
                <AlertCircle size={16} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Preview Submit Notice */}
            {previewNotice && (
              <div className="auth-alert-notice" role="status">
                <Info size={16} />
                <div>
                  <strong>Validation passed.</strong> {previewNotice}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {/* Email Address */}
              <div className="form-field">
                <label htmlFor="login-email" className="field-label">
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`auth-input ${errors.email ? "has-error" : ""}`}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  disabled={loading}
                />
                {errors.email && (
                  <p id="email-error" className="field-error">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="form-field">
                <div className="field-label-row">
                  <label htmlFor="login-password" className="field-label">
                    Password
                  </label>
                  <Link href={forgotHref} className="forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="password-input-wrapper">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`auth-input password-input ${errors.password ? "has-error" : ""}`}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="field-error">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="btn auth-submit-btn">
                {loading ? (
                  <>
                    <Loader2 size={16} className="spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>

              {/* Temporary Development Preview Mode Bypass */}
              {isDev && (
                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
                    <span style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>
                      Dev inspection
                    </span>
                    <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
                  </div>

                  <button
                    type="button"
                    onClick={handleEnterPreview}
                    disabled={enteringPreview}
                    className="btn btn-secondary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "12px 18px",
                      fontSize: 12.5,
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(238, 232, 220, 0.45)",
                      borderColor: "var(--line)",
                      color: "#252522",
                    }}
                  >
                    {enteringPreview ? (
                      <>
                        <Loader2 size={15} className="spinner" />
                        <span>Entering preview…</span>
                      </>
                    ) : (
                      <>
                        <Compass size={15} strokeWidth={1.5} />
                        <span>Enter Preview Store</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                    Temporary development access to inspect catalog & shopping flow without Shopify customer login.
                  </p>
                </div>
              )}
            </form>

            {/* Footer Navigation Links */}
            <div className="auth-footer-links">
              <p className="auth-switch-text">
                New to Third Shelf?{" "}
                <Link href={signupHref} className="auth-action-link">
                  Create an account
                </Link>
              </p>
              <div className="auth-legal-note">
                Protected by Shopify Storefront API customer authentication standards.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loader2 className="spinner" size={24} style={{ color: "var(--muted)" }} />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
