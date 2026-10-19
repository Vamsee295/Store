import Link from "next/link";
import { ArrowRight, HelpCircle, CheckCircle, Scale } from "lucide-react";

export interface VerifiedReview {
  id: string;
  author: string;
  location?: string;
  date: string;
  productTitle: string;
  productHandle?: string;
  rating: number;
  content: string;
}

export function SocialProofSection({ reviews = [] }: { reviews?: VerifiedReview[] }) {
  // If genuine verified reviews exist from connected Shopify review app, render them
  if (reviews.length > 0) {
    return (
      <section className="section container">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Customer Perspectives
            </div>
            <h2 className="section-title">Good things are better shared.</h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                lineHeight: 1.7,
                maxWidth: 480,
                margin: 0,
              }}
            >
              Feedback from customers who have brought Third Shelf essentials into
              their everyday routines.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="verified-reviews-grid"
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                padding: "28px 24px",
                background: "#ffffff",
                border: "1px solid rgba(37,37,34,0.08)",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    fontSize: 12,
                    color: "var(--accent)",
                  }}
                >
                  <span>{"?".repeat(rev.rating)}</span>
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>{rev.date}</span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.8,
                    color: "var(--ink)",
                    margin: "0 0 16px",
                  }}
                >
                  —{rev.content}—
                </p>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(37,37,34,0.06)",
                  paddingTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>{rev.author}</span>
                {rev.productHandle ? (
                  <Link href={`/products/${rev.productHandle}`} style={{ textDecoration: "underline" }}>
                    {rev.productTitle}
                  </Link>
                ) : (
                  <span>{rev.productTitle}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Pre-launch honest alternative when no verified reviews exist yet
  return (
    <section
      className="section"
      style={{
        background: "#faf8f5",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="container">
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Honest Commerce
          </div>
          <h2
            className="section-title"
            style={{
              fontSize: "clamp(34px, 4.4vw, 52px)",
              margin: "0 0 16px",
              lineHeight: 1.1,
            }}
          >
            Thoughtful choices start with honest details.
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 14,
              lineHeight: 1.85,
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            We want you to know exactly what you are choosing. Explore our full product
            specifications, compare your options, and reach out to our concierge if you
            need guidance before placing an order.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              textAlign: "left",
              marginBottom: 40,
            }}
            className="honest-pillars-grid"
          >
            <div
              style={{
                padding: "24px 20px",
                background: "#ffffff",
                borderRadius: 8,
                border: "1px solid rgba(37,37,34,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <CheckCircle size={15} color="#74634d" />
                <span>Real Specifications</span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.65,
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                Exact dimensions, materials, and weight disclosures on every item.
              </p>
            </div>

            <div
              style={{
                padding: "24px 20px",
                background: "#ffffff",
                borderRadius: 8,
                border: "1px solid rgba(37,37,34,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <HelpCircle size={15} color="#74634d" />
                <span>Direct Concierge</span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.65,
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                Human support via email to help you decide before you spend.
              </p>
            </div>

            <div
              style={{
                padding: "24px 20px",
                background: "#ffffff",
                borderRadius: 8,
                border: "1px solid rgba(37,37,34,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <Scale size={15} color="#74634d" />
                <span>Zero Pressure</span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.65,
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                No artificial countdown timers, fake stock counters, or pressure tactics.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link href="/collections/all" className="btn">
              Shop all products <ArrowRight size={14} />
            </Link>
            <Link href="/pages/contact" className="btn btn-light">
              Contact concierge <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width: 768px) {
          .honest-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
