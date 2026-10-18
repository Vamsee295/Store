"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HeroStillLife, type HeroProducts } from "@/components/hero-still-life";

interface HomeHeroProps {
  featuredProducts?: HeroProducts;
}

export function HomeHero({ featuredProducts }: HomeHeroProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-reveal", {
        y: 22,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="hero-section"
      style={{
        overflow: "hidden",
        position: "relative",
        background: "var(--paper)",
      }}
    >
      <div className="container hero-layout">
        {/* Left Desktop Column / Mobile Flow Wrapper */}
        <div className="hero-copy-column">
          {/* Header Block: Eyebrow, Headline, Subtitle */}
          <div className="hero-header-block">
            <div className="eyebrow hero-reveal" style={{ marginBottom: 24 }}>
              A considered edit for everyday living
            </div>
            <h1
              className="display hero-reveal"
              style={{
                fontSize: "clamp(54px, 7vw, 98px)",
                maxWidth: 570,
                margin: "0 0 24px",
                lineHeight: 0.94,
              }}
            >
              Better things.
              <br />
              <i style={{ fontWeight: 400, color: "#8d806f" }}>Better</i> everyday.
            </h1>
            <p
              className="hero-reveal"
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: "var(--muted)",
                maxWidth: 380,
                margin: "0 0 28px",
              }}
            >
              Thoughtfully selected finds for the spaces you live in, the places you go, and
              the everyday in between.
            </p>
          </div>

          {/* Actions Block: CTAs and Trust Badges */}
          <div className="hero-actions-block hero-reveal">
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/collections/all" className="btn">
                Explore the collection <ArrowRight size={15} />
              </Link>
              <Link
                href="/collections/technology"
                style={{
                  fontSize: 11,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--ink)",
                  letterSpacing: ".02em",
                }}
              >
                Start with tech <ArrowDownRight size={14} />
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                gap: 22,
                marginTop: 40,
                color: "var(--muted)",
                fontSize: 10,
                letterSpacing: ".06em",
              }}
            >
              <span>USEFUL BY DESIGN</span>
              <span>·</span>
              <span>CHOSEN WITH INTENTION</span>
            </div>
          </div>
        </div>

        {/* Right Desktop Column: The Curated Still Life */}
        <div className="hero-visual-column">
          <HeroStillLife products={featuredProducts} />
        </div>
      </div>

      <style jsx>{`
        .hero-layout {
          min-height: 610px;
          display: grid;
          grid-template-columns: 1fr 1.08fr;
          align-items: center;
          gap: 40px;
          padding-top: 32px;
          padding-bottom: 48px;
        }
        .hero-copy-column {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          padding-block: 28px;
        }
        .hero-visual-column {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        /* Responsive Breakpoint for Tablet & Mobile */
        @media (max-width: 850px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: 28px;
            padding-top: 24px;
            padding-bottom: 36px;
            min-height: auto;
          }
          /* Unwrap copy column so mobile orders: Headline -> Visual -> CTA */
          .hero-copy-column {
            display: contents;
          }
          .hero-header-block {
            order: 1;
            padding-bottom: 4px;
          }
          .hero-visual-column {
            order: 2;
            margin-top: 4px;
            margin-bottom: 8px;
          }
          .hero-actions-block {
            order: 3;
            padding-top: 4px;
          }
        }
      `}</style>
    </section>
  );
}
