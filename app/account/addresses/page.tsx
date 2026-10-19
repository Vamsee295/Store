"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Plus, ShieldCheck, CheckCircle2, Trash2, Edit2, X, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { AccountNav } from "../account-nav";

export default function AccountAddressesPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("Member");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");

  useEffect(() => {
    async function loadAddress() {
      try {
        const res = await fetch("/api/account");
        const json = await res.json();
        if (!json.authenticated || !json.customer) {
          router.replace("/login?redirectTo=/account/addresses");
          return;
        }
        setCustomerName(`${json.customer.firstName || ""} ${json.customer.lastName || ""}`.trim() || "Member");
        setCustomerEmail(json.customer.email || "");
        const addr = json.customer.defaultAddress;
        setAddress(addr);
        if (addr) {
          setAddress1(addr.address1 || "");
          setAddress2(addr.address2 || "");
          setCity(addr.city || "");
          setProvince(addr.province || "");
          setZip(addr.zip || "");
          setCountry(addr.country || "United States");
        }
      } catch (err) {
        console.error("Failed to load address:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAddress();
  }, [router]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        action: address?.id ? "UPDATE" : "CREATE",
        id: address?.id,
        address: { address1, address2, city, province, zip, country },
      };
      const res = await fetch("/api/account/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAddress({ address1, address2, city, province, zip, country });
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setEditing(false);
        }, 1200);
      }
    } catch {
      alert("Could not update address. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="container account-page-container">
        <div className="account-loading-state">
          <div className="account-spinner" />
          <p>Loading addresses…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container account-page-container">
      <div className="account-header-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="account-eyebrow">Customer Sanctuary</div>
          <h1 className="account-display-title">Shipping Addresses</h1>
          <p className="account-header-subtitle">
            Manage your verified delivery addresses for rapid, seamless checkout.
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
          <div className="account-section-header">
            <div>
              <h2 className="account-section-title">Saved Delivery Addresses</h2>
              <p className="account-section-desc">Default shipping address applied automatically at checkout.</p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-secondary"
                style={{ padding: "8px 14px", fontSize: 11.5 }}
              >
                {address ? "Edit address" : "Add address"}
              </button>
            )}
          </div>

          {editing ? (
            <div className="preferences-card" style={{ maxWidth: 600 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 className="account-section-title" style={{ fontSize: 18 }}>
                  {address ? "Edit Shipping Address" : "Add Shipping Address"}
                </h3>
                <button
                  onClick={() => setEditing(false)}
                  style={{ background: "none", border: 0, cursor: "pointer", color: "var(--muted)" }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} style={{ display: "grid", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="e.g. 100 Main Street"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Apartment, Suite, Unit (optional)</label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="e.g. Apt 4B"
                    className="form-input"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Seattle"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State / Province *</label>
                    <input
                      type="text"
                      required
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="e.g. WA"
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Postal / ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="e.g. 98101"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ padding: "10px 20px", fontSize: 12 }}
                  >
                    {saving ? "Saving…" : "Save address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn btn-secondary"
                    style={{ padding: "10px 16px", fontSize: 12 }}
                  >
                    Cancel
                  </button>
                  {saveSuccess && (
                    <span style={{ color: "#2b7336", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                      <Check size={14} /> Saved successfully
                    </span>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="account-addresses-grid">
              {address ? (
                <div className="account-address-card default-active">
                  <div className="address-card-badge">
                    <CheckCircle2 size={13} />
                    <span>Default Shipping Address</span>
                  </div>
                  <div className="address-card-body">
                    <div className="address-card-name">{customerName}</div>
                    <div className="address-card-line">{address.address1}</div>
                    {address.address2 && <div className="address-card-line">{address.address2}</div>}
                    <div className="address-card-line">
                      {address.city}, {address.province} {address.zip}
                    </div>
                    <div className="address-card-line">{address.country}</div>
                  </div>
                  <div className="address-card-actions">
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="btn btn-secondary address-btn"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="account-empty-state">
                  <MapPin size={32} strokeWidth={1.5} className="account-empty-icon" />
                  <h3 className="account-empty-title">No addresses saved</h3>
                  <p className="account-empty-desc">Save your primary delivery destination for quicker purchasing.</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-primary"
                  >
                    Add address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
