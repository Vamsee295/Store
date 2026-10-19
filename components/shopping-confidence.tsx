import Link from "next/link";
import { Info, Truck, MessageSquare, RotateCcw, ArrowRight } from "lucide-react";

export function ShoppingConfidence() {
  const points = [
    {
      title: "Clear product details",
      caption: "Real specifications, dimensions & materials",
      href: "/pages/faq",
      linkText: "Read FAQs",
      icon: Info,
    },
    {
      title: "Transparent shipping",
      caption: "Tracked courier dispatch within 24–48 hours",
      href: "/pages/shipping",
      linkText: "Shipping details",
      icon: Truck,
    },
    {
      title: "Accessible concierge",
      caption: "Attentive email support for every order",
      href: "/pages/contact",
      linkText: "Get in touch",
      icon: MessageSquare,
    },
    {
      title: "Quiet returns",
      caption: "Straightforward 30-day return window",
      href: "/pages/returns",
      linkText: "Return policy",
      icon: RotateCcw,
    },
  ];

  return (
    <section
      style={{
        background: "#f4f0e8",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        padding: "48px 0",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 28,
          }}
          className="confidence-strip-grid"
        >
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: "#ffffff",
                    border: "1px solid rgba(37,37,34,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--ink)",
                  }}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {pt.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      lineHeight: 1.55,
                      marginBottom: 8,
                    }}
                  >
                    {pt.caption}
                  </div>
                  <Link
                    href={pt.href}
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--accent)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    <span>{pt.linkText}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media(max-width: 960px) {
          .confidence-strip-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px 20px !important;
          }
        }
        @media(max-width: 560px) {
          .confidence-strip-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
