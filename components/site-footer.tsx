import Link from "next/link";

export function SiteFooter() {
  return (
    <footer style={{ background: "#252522", color: "#f7f5f0", padding: "64px 0 24px", marginTop: 0, borderTop: "1px solid #383632" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, paddingBottom: 54 }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 36, letterSpacing: "-.06em" }}>third shelf</div>
            <p style={{ maxWidth: 300, color: "#c0bcb3", fontSize: 13, lineHeight: 1.8 }}>
              Useful things, chosen with intention. A considered edit for better everyday living.
            </p>
          </div>
          <div>
            <div className="eyebrow" style={{ color: "#c0bcb3", marginBottom: 18 }}>Explore</div>
            {[
              ["Shop all", "/collections/all"],
              ["Technology", "/collections/technology"],
              ["Home", "/collections/home"],
              ["Travel", "/collections/travel"],
              ["My account", "/login"]
            ].map(([t, h]) => (
              <Link key={h} href={h} style={{ display: "block", fontSize: 12, marginBottom: 12 }}>{t}</Link>
            ))}
          </div>
          <div>
            <div className="eyebrow" style={{ color: "#c0bcb3", marginBottom: 18 }}>Help & info</div>
            {[
              ["Contact", "/pages/contact"],
              ["Shipping", "/pages/shipping"],
              ["Returns", "/pages/returns"],
              ["Privacy", "/pages/privacy"],
              ["Terms", "/pages/terms"]
            ].map(([t, h]) => (
              <Link key={h} href={h} style={{ display: "block", fontSize: 12, marginBottom: 12 }}>{t}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #4b4943", paddingTop: 18, display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", color: "#c0bcb3", fontSize: 10 }}>
          <span>© {new Date().getFullYear()} Third Shelf. All rights reserved.</span>
          <span>Better things. Better everyday.</span>
        </div>
      </div>
    </footer>
  );
}

