import { Target, Compass, FileSearch, Coins } from "lucide-react";

export function SelectionPhilosophy() {
  const criteria = [
    {
      title: "Function",
      question: "What purpose does the product serve?",
      explanation:
        "Every item must address a real daily need with clear intention, avoiding unnecessary complexity or novelty gimmicks.",
      icon: Target,
    },
    {
      title: "Practicality",
      question: "Does it make an everyday task simpler?",
      explanation:
        "Designed to integrate naturally into your routine, workspace, or home from day one without complicated setup.",
      icon: Compass,
    },
    {
      title: "Clarity",
      question: "Can you understand what you are buying?",
      explanation:
        "We prioritize exact dimensions, verified materials, honest weights, and realistic shipping details on every single page.",
      icon: FileSearch,
    },
    {
      title: "Value",
      question: "Is the price and intended use clear?",
      explanation:
        "Fair, transparent pricing that reflects dependable utility and durable everyday materials without artificial markups.",
      icon: Coins,
    },
  ];

  return (
    <section className="section" style={{ background: "#eeebe4" }}>
      <div className="container">
        <div style={{ maxWidth: 660, marginBottom: 52 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Chosen with Intention
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(34px, 4.4vw, 54px)", margin: "0 0 16px" }}
          >
            Everyday usefulness comes first.
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 14,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            We curate our catalog using a structured selection philosophy. Rather than
            accumulating endless items, every piece on our shelves must satisfy four
            essential standards.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
          className="criteria-grid"
        >
          {criteria.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                style={{
                  background: "#f7f5f0",
                  padding: "32px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(37,37,34,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, background 0.25s ease",
                }}
                className="criteria-card"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      fontWeight: 700,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: "rgba(37,37,34,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--ink)",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 22,
                    fontWeight: 400,
                    margin: "0 0 8px",
                  }}
                >
                  {c.title}
                </h3>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {c.question}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    lineHeight: 1.7,
                    color: "var(--muted)",
                    margin: 0,
                  }}
                >
                  {c.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .criteria-card:hover {
          transform: translateY(-2px);
          background: #ffffff;
        }
        @media(max-width: 980px) {
          .criteria-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media(max-width: 600px) {
          .criteria-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
