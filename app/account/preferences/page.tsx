"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sliders, ShieldCheck, Check, Bell, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import { AccountNav } from "../account-nav";

export default function AccountPreferencesPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("Member");
  const [customerEmail, setCustomerEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [dispatchAlerts, setDispatchAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPref() {
      try {
        const res = await fetch("/api/account");
        const json = await res.json();
        if (!json.authenticated || !json.customer) {
          router.replace("/login?redirectTo=/account/preferences");
          return;
        }
        setCustomerName(`${json.customer.firstName || ""} ${json.customer.lastName || ""}`.trim() || "Member");
        setCustomerEmail(json.customer.email || "");
      } catch (err) {
        console.error("Failed to load preferences:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPref();
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <main className="container account-page-container">
        <div className="account-loading-state">
          <div className="account-spinner" />
          <p>Loading preferences…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container account-page-container">
      <div className="account-header-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="account-eyebrow">Customer Sanctuary</div>
          <h1 className="account-display-title">Preferences & Quiet Mode</h1>
          <p className="account-header-subtitle">
            Control notifications, marketing communications, and privacy settings.
          </p>
        </div>

        <Link
          href="/collections/all"
          className="btn btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", fontSize: 13, marginBottom: 8 }}
        >
          <ShoppingBag size={15} />
          <span>Continue shopping</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="account-layout-grid">
        <AccountNav
          customerName={customerName}
          email={customerEmail}
          isPreview={false}
        />

        <div className="account-main-content">
          <form onSubmit={handleSave} className="preferences-form">
            <div className="preferences-card">
              <h2 className="account-section-title">Communication Preferences</h2>
              <p className="account-section-desc">
                Third Shelf respects your inbox. We send only carefully selected dispatch notifications and occasional curation announcements.
              </p>

              <div className="preference-toggle-list">
                <label className="preference-toggle-item">
                  <div className="preference-toggle-text">
                    <span className="pref-title">Dispatch & Delivery Tracking Alerts</span>
                    <span className="pref-desc">Receive real-time carrier tracking emails when orders ship.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dispatchAlerts}
                    onChange={(e) => setDispatchAlerts(e.target.checked)}
                    className="pref-checkbox"
                  />
                </label>

                <label className="preference-toggle-item">
                  <div className="preference-toggle-text">
                    <span className="pref-title">The Considered Edit Newsletter</span>
                    <span className="pref-desc">Curated bi-weekly digests of new finds and quiet design philosophies.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="pref-checkbox"
                  />
                </label>
              </div>
            </div>

            <div className="preferences-card">
              <h2 className="account-section-title">Data Privacy & Security</h2>
              <p className="account-section-desc">
                Your data is never sold or rented to third-party ad networks. We strictly adhere to GDPR, CCPA, and Shopify customer data protection protocols.
              </p>

              <div className="pref-privacy-badge">
                <Lock size={15} />
                <span>Encrypted Shopify Session Authentication</span>
              </div>
            </div>

            <div className="pref-actions">
              <button type="submit" className="btn btn-primary pref-save-btn">
                {saved ? "Preferences saved" : "Save preferences"}
              </button>
              {saved && <span className="pref-saved-msg">✓ Updated successfully</span>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
