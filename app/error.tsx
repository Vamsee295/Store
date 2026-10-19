"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Application Error:", error);
  }, [error]);

  return (
    <main
      className="container"
      style={{
        paddingTop: 80,
        paddingBottom: 120,
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(180, 40, 40, 0.08)",
          border: "1px solid rgba(180, 40, 40, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          color: "#a83232",
        }}
      >
        <AlertCircle size={24} />
      </div>

      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 12,
        }}
      >
        Storefront Service Notice
      </span>

      <h1
        className="display"
        style={{
          fontSize: "clamp(38px, 4.5vw, 56px)",
          letterSpacing: "-0.04em",
          margin: "0 0 16px",
          color: "var(--foreground)",
        }}
      >
        Something took an unexpected pause.
      </h1>

      <p
        style={{
          maxWidth: 480,
          fontSize: 14,
          lineHeight: 1.65,
          color: "var(--muted)",
          margin: "0 auto 32px",
        }}
      >
        A temporary service glitch occurred while loading this view. You can safely try refreshing the request or return to the main storefront.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-primary"
          style={{ minWidth: 160 }}
        >
          <RotateCcw size={14} />
          <span>Try again</span>
        </button>
        <Link href="/" className="btn btn-light" style={{ minWidth: 150 }}>
          <Home size={14} />
          <span>Return home</span>
        </Link>
      </div>
    </main>
  );
}
