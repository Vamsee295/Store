import Link from "next/link";
import { ArrowRight, Laptop, Home, Compass, Sparkles } from "lucide-react";

export function EditorialDiscovery() {
  const edits = [
    {
      handle: "technology",
      title: "Technology",
      tagline: "A calmer, focused desk",
      description: "Cable managers, device stands, and cord organizers designed to reduce workspace distraction.",
      href: "/collections/technology",
      icon: Laptop,
    },
    {
      handle: "home-essentials",
      title: "Home essentials",
      tagline: "Quiet everyday order",
      description: "Modular catchalls, drawer dividers, and functional objects that keep personal spaces composed.",
      href: "/collections/home-essentials",
      icon: Home,
    },
    {
      handle: "travel",
      title: "Travel",
      tagline: "Effortless movement",
      description: "Water-resistant carry pouches and compression packing cubes engineered for seamless transitions.",
      href: "/collections/travel",
      icon: Compass,
    },
    {
      handle: "everyday-finds",
      title: "Everyday finds",
      tagline: "Useful daily rituals",
      description: "Insulated drinkware, pocket companions, and considered objects you reach for every morning.",
      href: "/collections/everyday-finds",
      icon: Sparkles,
    },
  ];

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Curated Pathways
          </div>
          <h2 className="section-title">Find your everyday essential.</h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 13,
              lineHeight: 1.7,
              maxWidth: 480,
              margin: 0,
            }}
          >
            Explore our collection by daily context. Each category brings together
            practical items designed to make daily routines simpler.
          </p>
        </div>
        <div>
          <Link
            href="/collections/all"
            style={{
              fontSize: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--ink)",
              fontWeight: 500,
            }}
          >
            Browse all categories <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
        }}
        className="editorial-discovery-grid"
      >
        {edits.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.handle}
              href={item.href}
              className="editorial-discovery-card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "28px 22px",
                background: "#faf8f5",
                borderRadius: 10,
                border: "1px solid rgba(37,37,34,0.08)",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.25s ease, background 0.25s ease, border-color 0.25s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: "rgba(37,37,34,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink)",
                  }}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 20,
                  fontWeight: 400,
                  margin: "0 0 6px",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.title}
              </h3>

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--accent)",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {item.tagline}
              </div>

              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "var(--muted)",
                  margin: "0 0 20px",
                  flex: 1,
                }}
              >
                {item.description}
              </p>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--ink)",
                }}
              >
                <span>Explore edit</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .editorial-discovery-card:hover {
          transform: translateY(-2px);
          background: #ffffff;
          border-color: rgba(37,37,34,0.18);
        }
        @media(max-width: 900px) {
          .editorial-discovery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media(max-width: 550px) {
          .editorial-discovery-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
