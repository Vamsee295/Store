import { Layers, Sparkles, ShieldCheck } from "lucide-react";

export function WhyThirdShelf() {
  const pillars = [
    {
      num: "01",
      title: "Considered Selection",
      description:
        "A focused assortment of useful products, chosen for their purpose and everyday practicality.",
      icon: Layers,
    },
    {
      num: "02",
      title: "Designed for Everyday",
      description:
        "Products that make ordinary routines feel simpler, more organized, and more enjoyable.",
      icon: Sparkles,
    },
    {
      num: "03",
      title: "Quality Over Noise",
      description:
        "Clear product information and a thoughtful shopping experience that help customers make informed decisions.",
      icon: ShieldCheck,
    },
  ];

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
        <div style={{ maxWidth: 640, marginBottom: 54 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Why Third Shelf
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(34px, 4.2vw, 54px)", margin: "0 0 16px" }}
          >
            Less clutter. Better choices.
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 14,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            We focus on useful everyday essentials that earn their place in your home,
            your workspace, and your routine.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
          }}
          className="why-pillars-grid"
        >
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "32px 28px",
                  background: "#ffffff",
                  border: "1px solid rgba(37,37,34,0.08)",
                  borderRadius: 10,
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                className="why-pillar-card"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 18,
                      color: "var(--accent)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {p.num}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      background: "#f7f5f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--ink)",
                    }}
                  >
                    <Icon size={17} strokeWidth={1.5} />
                  </div>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 20,
                    fontWeight: 400,
                    margin: "0 0 10px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.75,
                    color: "var(--muted)",
                    margin: 0,
                  }}
                >
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .why-pillar-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -10px rgba(37,37,34,0.08);
        }
        @media (max-width: 860px) {
          .why-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}
