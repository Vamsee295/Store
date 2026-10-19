"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, LogOut, X } from "lucide-react";

export function DevPreviewBar() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Only query in development
    if (process.env.NODE_ENV !== "development") return;
    setIsDev(true);

    async function checkPreview() {
      try {
        const res = await fetch("/api/auth/preview");
        const data = await res.json();
        setIsPreview(Boolean(data.isPreviewStore));
      } catch {
        // ignore
      }
    }
    checkPreview();
  }, []);

  const handleExitPreview = async () => {
    setExiting(true);
    try {
      await fetch("/api/auth/preview", { method: "DELETE" });
      setIsPreview(false);
      router.push("/login");
    } catch {
      router.push("/login");
    } finally {
      setExiting(false);
    }
  };

  if (!isDev || !isPreview || dismissed) return null;

  return (
    <div
      role="status"
      style={{
        background: "#252522",
        color: "#f7f5f0",
        padding: "7px 16px",
        fontSize: 11,
        letterSpacing: "-0.01em",
        borderBottom: "1px solid #383632",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        position: "relative",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Compass size={14} strokeWidth={1.5} style={{ color: "#d5c9b6" }} />
        <span>
          <strong style={{ color: "#d5c9b6" }}>Dev Preview Store Active:</strong> You are inspecting the catalog without live Shopify customer authentication.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          href="/collections/all"
          style={{
            color: "#ded4c4",
            textDecoration: "underline",
            textUnderlineOffset: 3,
            fontSize: 11,
          }}
        >
          Browse Shop All
        </Link>

        <button
          type="button"
          onClick={handleExitPreview}
          disabled={exiting}
          style={{
            background: "rgba(247, 245, 240, 0.12)",
            color: "#f7f5f0",
            border: "1px solid rgba(247, 245, 240, 0.25)",
            borderRadius: 4,
            padding: "4px 10px",
            fontSize: 10.5,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <LogOut size={12} strokeWidth={1.5} />
          <span>{exiting ? "Exiting…" : "Exit Preview Store"}</span>
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          style={{
            background: "transparent",
            border: 0,
            color: "#a09c93",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
