import Link from "next/link";

export function SiteFooter() {
  const exploreLinks = [
    { label: "Shop all", href: "/collections/all" },
    { label: "Technology", href: "/collections/technology" },
    { label: "Home essentials", href: "/collections/home-essentials" },
    { label: "Travel", href: "/collections/travel" },
    { label: "Everyday finds", href: "/collections/everyday-finds" },
    { label: "Customer Sanctuary", href: "/account" },
  ];

  const customerCareLinks = [
    { label: "Customer concierge", href: "/pages/contact" },
    { label: "Shipping information", href: "/pages/shipping" },
    { label: "Returns and refunds", href: "/pages/returns" },
    { label: "Track your dispatch", href: "/pages/track-order" },
    { label: "Frequently asked questions", href: "/pages/faq" },
  ];

  const aboutLinks = [
    { label: "About our ethos", href: "/pages/about" },
    { label: "Privacy policy", href: "/pages/privacy" },
    { label: "Terms of service", href: "/pages/terms" },
  ];

  return (
    <footer
      style={{
        background: "#252522",
        color: "#f7f5f0",
        padding: "64px 0 24px",
        marginTop: 0,
        borderTop: "1px solid #383632",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
            gap: 36,
            paddingBottom: 52,
          }}
          className="footer-columns-grid"
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
              >
                <rect x="5" y="6.5" width="14" height="1.6" rx="0.4" fill="#f7f5f0" />
                <rect x="3" y="11" width="18" height="1.6" rx="0.4" fill="#f7f5f0" />
                <rect x="5" y="15.5" width="14" height="1.6" rx="0.4" fill="#f7f5f0" />
              </svg>
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 28,
                  letterSpacing: "-.04em",
                  color: "#f7f5f0",
                }}
              >
                Third shelf
              </span>
            </div>
            <p
              style={{
                maxWidth: 290,
                color: "#c0bcb3",
                fontSize: 13,
                lineHeight: 1.8,
                margin: "0 0 16px",
              }}
            >
              Useful things, chosen with intention. A considered edit for better everyday living.
            </p>
            <div style={{ fontSize: 11, color: "#8d8980" }}>
              Better things. Better everyday.
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ color: "#c0bcb3", marginBottom: 18 }}>
              Explore
            </div>
            {exploreLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  fontSize: 12,
                  marginBottom: 12,
                  color: "#dcd8ce",
                  transition: "color 0.2s ease",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <div className="eyebrow" style={{ color: "#c0bcb3", marginBottom: 18 }}>
              Customer Care
            </div>
            {customerCareLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  fontSize: 12,
                  marginBottom: 12,
                  color: "#dcd8ce",
                  transition: "color 0.2s ease",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <div className="eyebrow" style={{ color: "#c0bcb3", marginBottom: 18 }}>
              About Third Shelf
            </div>
            {aboutLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  fontSize: 12,
                  marginBottom: 12,
                  color: "#dcd8ce",
                  transition: "color 0.2s ease",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #4b4943",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            color: "#c0bcb3",
            fontSize: 11,
          }}
        >
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} Third Shelf. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 18 }}>
            <Link href="/pages/privacy" style={{ color: "#c0bcb3" }}>Privacy</Link>
            <Link href="/pages/terms" style={{ color: "#c0bcb3" }}>Terms</Link>
            <Link href="/pages/shipping" style={{ color: "#c0bcb3" }}>Shipping</Link>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width: 900px) {
          .footer-columns-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 36px 24px !important;
          }
        }
        @media(max-width: 540px) {
          .footer-columns-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </footer>
  );
}
