"use client";

import Link from "next/link";
import { MoveUpRight, Clock } from "lucide-react";
import {
  TechnologyIllustration,
  HomeIllustration,
  TravelIllustration,
  EverydayIllustration,
} from "@/components/category-illustrations";

export interface CategoryCardData {
  title: string;
  handle: string;
  subtitle: string;
  itemCount?: number;
  available?: boolean;
}

interface CategoryCardsProps {
  categories: CategoryCardData[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <div className="category-grid">
      {categories.map((c) => {
        const isAvailable = (c.itemCount ?? 1) > 0;
        const href = isAvailable ? `/collections/${c.handle}` : "#";

        return (
          <Link
            key={c.handle}
            href={href}
            className={`category-editorial-card ${!isAvailable ? "is-coming-soon" : ""}`}
            aria-label={`${c.title} — ${c.subtitle}${!isAvailable ? " (Curating soon)" : ""}`}
            tabIndex={0}
          >
            {/* Full-Bleed 2D Vector Illustration Backdrop */}
            <div className="card-illustration-stage">
              {c.handle === "technology" && <TechnologyIllustration />}
              {c.handle === "home" && <HomeIllustration />}
              {c.handle === "travel" && <TravelIllustration />}
              {c.handle === "everyday" && <EverydayIllustration />}
            </div>

            {/* Charcoal Gradient Overlay to guarantee high text legibility without obscuring the artwork */}
            <div className="card-shade-overlay" />

            {/* Editorial Card Content with crisp white typography */}
            <div className="category-card-copy">
              <div className="category-eyebrow-row">
                <span className="card-subtitle">{c.subtitle}</span>
                {typeof c.itemCount === "number" && isAvailable && (
                  <span className="card-item-count">{c.itemCount} items</span>
                )}
              </div>

              <h3 className="card-title">{c.title}</h3>

              <div className="card-action-row">
                {isAvailable ? (
                  <span className="card-explore-btn">
                    Explore <MoveUpRight size={13} className="explore-arrow" />
                  </span>
                ) : (
                  <span className="card-coming-soon-badge">
                    <Clock size={11} /> Curating soon
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}

      <style jsx global>{`
        /* Category Grid Setup */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        /* Editorial Card Frame */
        .category-editorial-card {
          position: relative;
          display: flex;
          flex-direction: column;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #ebe5dc;
          border: 1px solid rgba(37, 37, 34, 0.1);
          border-radius: 12px;
          text-decoration: none;
          color: #ffffff;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 0.3s ease;
          outline: none;
        }

        .category-editorial-card:hover,
        .category-editorial-card:focus-visible {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px -12px rgba(35, 30, 24, 0.22),
            0 4px 14px rgba(35, 30, 24, 0.08);
          border-color: rgba(37, 37, 34, 0.25);
        }

        .category-editorial-card:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 3px;
        }

        .category-editorial-card.is-coming-soon {
          cursor: default;
        }

        /* Full-Bleed Illustration Stage */
        .card-illustration-stage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .category-vector-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Consistent Charcoal Gradient Overlay at base for text legibility */
        .card-shade-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(20, 20, 18, 0) 0%,
            rgba(20, 20, 18, 0) 38%,
            rgba(20, 20, 18, 0.44) 66%,
            rgba(20, 20, 18, 0.88) 98%
          );
          pointer-events: none;
          transition: background 0.35s ease;
        }

        .category-editorial-card:hover .card-shade-overlay,
        .category-editorial-card:focus-visible .card-shade-overlay {
          background: linear-gradient(
            180deg,
            rgba(20, 20, 18, 0) 0%,
            rgba(20, 20, 18, 0.06) 36%,
            rgba(20, 20, 18, 0.52) 66%,
            rgba(20, 20, 18, 0.92) 98%
          );
        }

        /* Editorial Card Copy */
        .category-card-copy {
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 20px;
          z-index: 2;
          display: flex;
          flex-direction: column;
        }

        .category-eyebrow-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
        }

        .card-subtitle {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .card-item-count {
          font-size: 9px;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.75);
          font-weight: 600;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.14);
          padding: 2px 7px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }

        .card-title {
          font-family: var(--serif);
          font-size: clamp(23px, 2.1vw, 29px);
          font-weight: 400;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin: 0 0 10px;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .card-action-row {
          display: flex;
          align-items: center;
        }

        .card-explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: #ffffff;
          transition: gap 0.25s ease, opacity 0.25s ease;
        }

        .category-editorial-card:hover .card-explore-btn,
        .category-editorial-card:focus-visible .card-explore-btn {
          color: #ffffff;
          gap: 9px;
        }

        .explore-arrow {
          color: #ffffff;
          transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .category-editorial-card:hover .explore-arrow,
        .category-editorial-card:focus-visible .explore-arrow {
          transform: translate(2px, -2px);
        }

        .card-coming-soon-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.18);
          padding: 3px 8px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        /* =========================================================
           MICRO-ANIMATIONS (Tasteful, brief, performance-friendly)
           ========================================================= */

        /* 1. Technology: Devices slide into crisp alignment */
        .tech-laptop,
        .tech-phone,
        .tech-cable {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: center bottom;
        }

        .tech-guide-lines {
          transition: opacity 0.35s ease, stroke 0.35s ease;
        }

        .category-editorial-card:hover .tech-laptop,
        .category-editorial-card:focus-visible .tech-laptop {
          transform: translateY(-4px) scale(1.015);
        }

        .category-editorial-card:hover .tech-phone,
        .category-editorial-card:focus-visible .tech-phone {
          transform: translate(-3px, -2px);
        }

        .category-editorial-card:hover .tech-cable,
        .category-editorial-card:focus-visible .tech-cable {
          transform: scale(1.02);
        }

        .category-editorial-card:hover .tech-guide-lines,
        .category-editorial-card:focus-visible .tech-guide-lines {
          opacity: 0.9;
          stroke: #8d806f;
        }

        /* 2. Home Essentials: Lamp soft warm glow and swaying leaves */
        .home-lamp-glow {
          transition: opacity 0.45s ease, transform 0.45s ease;
          transform-origin: 88px 68px;
        }

        .home-lamp {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: 88px 164px;
        }

        .home-top-box {
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: center bottom;
        }

        .home-leaf {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 215px 138px;
        }

        .category-editorial-card:hover .home-lamp-glow,
        .category-editorial-card:focus-visible .home-lamp-glow {
          opacity: 0.75;
          transform: scale(1.04);
        }

        .category-editorial-card:hover .home-top-box,
        .category-editorial-card:focus-visible .home-top-box {
          transform: translateY(-3px);
        }

        .category-editorial-card:hover .home-leaf-1,
        .category-editorial-card:focus-visible .home-leaf-1 {
          transform: rotate(-4deg);
        }

        .category-editorial-card:hover .home-leaf-2,
        .category-editorial-card:focus-visible .home-leaf-2 {
          transform: rotate(4deg);
        }

        .category-editorial-card:hover .home-leaf-3,
        .category-editorial-card:focus-visible .home-leaf-3 {
          transform: rotate(-2deg);
        }

        /* 3. Travel: Route line draws forward, luggage stays steady, passport subtly settles */
        .travel-backpack {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: center bottom;
        }

        .travel-passport {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: 145px 246px;
        }

        .travel-tag {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 138px 112px;
        }

        .travel-route-line {
          stroke-dasharray: 6 6;
          transition: stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .category-editorial-card:hover .travel-backpack,
        .category-editorial-card:focus-visible .travel-backpack {
          transform: translateY(-4px);
        }

        .category-editorial-card:hover .travel-passport,
        .category-editorial-card:focus-visible .travel-passport {
          transform: translateY(-3px) rotate(1.5deg);
        }

        .category-editorial-card:hover .travel-tag,
        .category-editorial-card:focus-visible .travel-tag {
          transform: rotate(-6deg);
        }

        .category-editorial-card:hover .travel-route-line,
        .category-editorial-card:focus-visible .travel-route-line {
          stroke-dashoffset: -28;
          stroke: #8d806f;
        }

        /* 4. Everyday Finds: Reusable bottle and notebook float & settle */
        .everyday-bottle {
          transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: center bottom;
        }

        .everyday-notebook {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: center bottom;
        }

        .everyday-ribbon {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 166px 94px;
        }

        .category-editorial-card:hover .everyday-bottle,
        .category-editorial-card:focus-visible .everyday-bottle {
          transform: translateY(-4px);
        }

        .category-editorial-card:hover .everyday-notebook,
        .category-editorial-card:focus-visible .everyday-notebook {
          transform: translateY(-2px);
        }

        .category-editorial-card:hover .everyday-ribbon,
        .category-editorial-card:focus-visible .everyday-ribbon {
          transform: rotate(3deg);
        }

        /* =========================================================
           RESPONSIVE BREAKPOINTS
           ========================================================= */
        @media (max-width: 900px) {
          .category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 14px !important;
          }
        }

        @media (max-width: 520px) {
          .category-grid {
            gap: 10px !important;
          }
          .card-title {
            font-size: 20px !important;
            margin-bottom: 6px !important;
          }
          .category-card-copy {
            left: 14px !important;
            right: 14px !important;
            bottom: 14px !important;
          }
          .category-eyebrow-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 2px !important;
            margin-bottom: 4px !important;
          }
          .card-subtitle {
            font-size: 8.5px !important;
            letter-spacing: 0.1em !important;
          }
          .card-item-count {
            font-size: 8px !important;
            opacity: 0.85;
          }
        }

        /* Accessibility: prefers-reduced-motion fallback */
        @media (prefers-reduced-motion: reduce) {
          .category-editorial-card,
          .tech-laptop,
          .tech-phone,
          .tech-cable,
          .home-lamp-glow,
          .home-top-box,
          .home-leaf,
          .travel-backpack,
          .travel-passport,
          .travel-tag,
          .travel-route-line,
          .everyday-bottle,
          .everyday-notebook,
          .everyday-ribbon,
          .card-explore-btn,
          .explore-arrow {
            transition: none !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
