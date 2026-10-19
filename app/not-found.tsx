import Link from "next/link";
import { ArrowRight, Compass, Home } from "lucide-react";

export default function NotFound() {
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
          background: "rgba(37, 37, 34, 0.05)",
          border: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          color: "var(--foreground)",
        }}
      >
        <Compass size={24} />
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
        Page Not Found · Error 404
      </span>

      <h1
        className="display"
        style={{
          fontSize: "clamp(42px, 5vw, 64px)",
          letterSpacing: "-0.04em",
          margin: "0 0 16px",
          color: "var(--foreground)",
        }}
      >
        Nothing on this shelf.
      </h1>

      <p
        style={{
          maxWidth: 460,
          fontSize: 14.5,
          lineHeight: 1.65,
          color: "var(--muted)",
          margin: "0 auto 36px",
        }}
      >
        The page, collection, or product you requested may have moved, been archived, or is no longer stocked in our catalog.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Link href="/collections/all" className="btn btn-primary" style={{ minWidth: 180 }}>
          <span>Explore all products</span>
          <ArrowRight size={14} />
        </Link>
        <Link href="/" className="btn btn-light" style={{ minWidth: 150 }}>
          <Home size={14} />
          <span>Return home</span>
        </Link>
      </div>
    </main>
  );
}
