"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { AuthIllustration } from "@/components/auth-illustration";

function safeRedirectPath(target: string | null): string {
  if (!target) return "/";
  if (target.startsWith("/") && !target.startsWith("//") && !target.includes("://") && !target.includes("\\")) {
    return target;
  }
  return "/";
}

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo");
  const redirectTo = safeRedirectPath(rawRedirect);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = () => {
    const errs: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!firstName.trim()) {
      errs.firstName = "Please enter your first name.";
    }

    if (!lastName.trim()) {
      errs.lastName = "Please enter your last name.";
    }

    if (!email.trim()) {
      errs.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    if (!password) {
      errs.password = "Please enter a password.";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (!termsAccepted) {
      errs.terms = "You must agree to the Terms of Service and Privacy Policy.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewNotice(null);
    setSuccessMessage(null);
    setErrors({});

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          termsAccepted,
          acceptsMarketing
        })
      });

      const data = await res.json();

      if (res.status === 503 || data.configured === false) {
        // Storefront running in Preview Mode
        setPreviewNotice(
          data.error ||
            "Preview Mode · Shopify Storefront API credentials are pending configuration. Live customer registration will create records directly in your Shopify customer database once credentials are added in .env.local."
        );
      } else if (!res.ok || data.error) {
        setErrors({ general: data.error || "Unable to create your account. Please try again." });
      } else if (data.success) {
        setSuccessMessage("Your account has been created successfully. Redirecting you to sign in...");
        setTimeout(() => {
          router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
        }, 1800);
      }
    } catch {
      setErrors({ general: "Network error occurred. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  const loginHref = rawRedirect ? `/login?redirectTo=${encodeURIComponent(rawRedirect)}` : "/login";

  return (
    <div className="auth-page-container">
      {/* Return to shop navigation */}
      <div className="auth-back-nav">
        <Link href="/" className="auth-back-link">
          <ArrowLeft size={15} strokeWidth={1.5} />
          <span>Continue shopping</span>
        </Link>
      </div>

      <div className="auth-split-grid">
        {/* Left Column: Brand Editorial Artwork */}
        <div className="auth-illustration-col">
          <AuthIllustration variant="signup" />
        </div>

        {/* Right Column: Clean, Spacious Sign Up Form */}
        <div className="auth-form-col">
          <div className="auth-form-card">
            {/* Header Titles */}
            <div className="auth-header">
              <span className="eyebrow" style={{ display: "block", marginBottom: 8, color: "var(--muted)" }}>
                Third Shelf · Membership
              </span>
              <h1 className="display auth-heading">Make room for better.</h1>
              <p className="auth-subheading">
                Create your Third Shelf account and make your next discovery a little easier.
              </p>
            </div>

            {/* Preview notice banner */}
            <div className="auth-preview-banner">
              <Info size={15} className="auth-preview-icon" />
              <div>
                <strong>Preview Mode:</strong> Customer accounts will be registered directly into Shopify when{" "}
                <code>.env.local</code> credentials are provided. Form validation and interactions are active.
              </div>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div className="auth-alert-error" role="alert">
                <AlertCircle size={16} />
                <span>{errors.general}</span>
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

            {/* Success Message Banner */}
            {successMessage && (
              <div className="auth-alert-success" role="status">
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {/* First & Last Name Dual Columns */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label htmlFor="signup-firstname" className="field-label">
                    First name
                  </label>
                  <input
                    id="signup-firstname"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className={`auth-input ${errors.firstName ? "has-error" : ""}`}
                    aria-invalid={Boolean(errors.firstName)}
                    aria-describedby={errors.firstName ? "fname-error" : undefined}
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p id="fname-error" className="field-error">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="signup-lastname" className="field-label">
                    Last name
                  </label>
                  <input
                    id="signup-lastname"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={`auth-input ${errors.lastName ? "has-error" : ""}`}
                    aria-invalid={Boolean(errors.lastName)}
                    aria-describedby={errors.lastName ? "lname-error" : undefined}
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p id="lname-error" className="field-error">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="form-field">
                <label htmlFor="signup-email" className="field-label">
                  Email address
                </label>
                <input
                  id="signup-email"
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
                <label htmlFor="signup-password" className="field-label">
                  Password <span className="field-hint">(min. 8 characters)</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
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

              {/* Confirm Password */}
              <div className="form-field">
                <label htmlFor="signup-confirm-password" className="field-label">
                  Confirm password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={`auth-input password-input ${errors.confirmPassword ? "has-error" : ""}`}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle-btn"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-error" className="field-error">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Consent Checkboxes */}
              <div className="consent-group">
                {/* Required Terms & Privacy Checkbox */}
                <div className="checkbox-field">
                  <input
                    id="signup-terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="custom-checkbox"
                    disabled={loading}
                  />
                  <label htmlFor="signup-terms" className="checkbox-label">
                    I agree to the{" "}
                    <Link href="/pages/terms" target="_blank" className="policy-link">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/pages/privacy" target="_blank" className="policy-link">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
                {errors.terms && <p className="field-error">{errors.terms}</p>}

                {/* Optional Marketing Checkbox (Never pre-checked) */}
                <div className="checkbox-field">
                  <input
                    id="signup-marketing"
                    type="checkbox"
                    checked={acceptsMarketing}
                    onChange={(e) => setAcceptsMarketing(e.target.checked)}
                    className="custom-checkbox"
                    disabled={loading}
                  />
                  <label htmlFor="signup-marketing" className="checkbox-label text-muted">
                    Optional: Receive occasional, considered edits and new arrival announcements. You can unsubscribe at any time.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="btn auth-submit-btn">
                {loading ? (
                  <>
                    <Loader2 size={16} className="spinner" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create account</span>
                )}
              </button>
            </form>

            {/* Footer Navigation Links */}
            <div className="auth-footer-links">
              <p className="auth-switch-text">
                Already have an account?{" "}
                <Link href={loginHref} className="auth-action-link">
                  Sign in
                </Link>
              </p>
              <div className="auth-legal-note">
                Third Shelf respects your privacy. We never share customer information with unauthorized third parties.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loader2 className="spinner" size={24} style={{ color: "var(--muted)" }} />
          </div>
        }
      >
        <SignupFormContent />
      </Suspense>
    </main>
  );
}
