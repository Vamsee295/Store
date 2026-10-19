import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { BrandStoryIllustration } from "@/components/brand-story-illustration";

export function DifferentiatorsSection() {
  const points = [
    "A curated assortment rather than endless browsing",
    "Clear, useful product details with honest specifications",
    "A calm, straightforward shopping experience from start to finish",
  ];

  return (
    <section className="section container">
      <div className="diff-layout">
        <div className="diff-image-wrapper">
          <BrandStoryIllustration />
        </div>
        <div className="diff-copy-wrapper">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            The Third Shelf Difference
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(38px, 4.8vw, 62px)",
              margin: "0 0 20px",
              lineHeight: 1.05,
            }}
          >
            Not more things.
            <br />
            <i style={{ color: "#8d806f" }}>Better</i> everyday things.
          </h2>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.85,
              color: "var(--muted)",
              marginBottom: 28,
              maxWidth: 480,
            }}
          >
            We believe shopping for everyday essentials should feel considered,
            not overwhelming. Third Shelf brings together useful finds across
            technology, home, travel, and everyday living—so you can spend less
            time searching and more time enjoying what you choose.
          </p>

          <div style={{ display: "grid", gap: 14, marginBottom: 32 }}>
            {points.map((pt, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 13,
                  color: "var(--ink)",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#ede8df",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--ink)",
                  }}
                >
                  <Check size={12} strokeWidth={2.2} />
                </div>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          <div>
            <Link href="/collections/all" className="btn btn-light">
              Explore the collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .diff-layout {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          align-items: center;
          gap: 7%;
        }
        .diff-image-wrapper {
          aspect-ratio: 4/5;
          overflow: hidden;
          background: #ece5dc;
          border-radius: 12px;
          border: 1px solid rgba(37,37,34,0.1);
          box-shadow: 0 16px 36px -12px rgba(45,38,28,0.12);
          position: relative;
        }
        .diff-copy-wrapper {
          padding-block: 20px;
        }
        @media(max-width: 900px) {
          .diff-layout {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .diff-image-wrapper {
            aspect-ratio: 16/11;
            max-width: 540px;
          }
        }
      `}</style>
    </section>
  );
}
