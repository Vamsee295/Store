/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import type { Product } from "@/lib/products";

export type HeroProducts = {
  tech?: Product;
  travel?: Product;
  home?: Product;
  everyday?: Product;
};

interface HeroStillLifeProps {
  products?: HeroProducts;
}

interface HotspotConfig {
  id: string;
  categoryKey: keyof HeroProducts;
  num: string;
  categoryLabel: string;
  defaultTitle: string;
  categoryHref: string;
  defaultPrice?: number;
  x: number; // percentage from left
  y: number; // percentage from top
  cardPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const HOTSPOTS: HotspotConfig[] = [
  {
    id: "tech-stand",
    categoryKey: "tech",
    num: "01",
    categoryLabel: "TECHNOLOGY",
    defaultTitle: "Technology & Desk",
    categoryHref: "/collections/technology",
    x: 39,
    y: 52,
    cardPosition: "top-right",
  },
  {
    id: "travel-pouch",
    categoryKey: "travel",
    num: "02",
    categoryLabel: "TRAVEL",
    defaultTitle: "Travel Essentials",
    categoryHref: "/collections/travel",
    x: 62,
    y: 57,
    cardPosition: "top-left",
  },
  {
    id: "home-tray",
    categoryKey: "home",
    num: "03",
    categoryLabel: "HOME ESSENTIALS",
    defaultTitle: "Home Essentials",
    categoryHref: "/collections/home-essentials",
    x: 67,
    y: 77,
    cardPosition: "top-left",
  },
  {
    id: "everyday-bottle",
    categoryKey: "everyday",
    num: "04",
    categoryLabel: "EVERYDAY FINDS",
    defaultTitle: "Everyday Finds",
    categoryHref: "/collections/everyday-finds",
    x: 87,
    y: 47,
    cardPosition: "top-left",
  },
];

export function HeroStillLife({ products }: HeroStillLifeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardStageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pinsGroupRef = useRef<HTMLDivElement>(null);
  const [activePin, setActivePin] = useState<string | null>(null);

  // Parallax state refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafRef = useRef<number | null>(null);

  // GSAP Entrance
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Main stage reveal
      gsap.fromTo(
        cardStageRef.current,
        { opacity: 0, scale: 0.96, y: 16 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.1,
        }
      );

      // Product pins stagger in
      gsap.fromTo(
        ".hero-pin-item",
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.6)",
          delay: 0.3,
        }
      );

      // Editorial badge slide in
      gsap.fromTo(
        ".hero-signature-badge",
        { opacity: 0, x: 8 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.45,
        }
      );

      // Bottom index strip reveal
      gsap.fromTo(
        ".hero-index-strip",
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.4,
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  // Restrained, lerped cursor parallax on desktop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth <= 850;
    if (prefersReducedMotion || isTouch) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = Math.max(-0.5, Math.min(0.5, relX));
      mouseRef.current.targetY = Math.max(-0.5, Math.min(0.5, relY));
    };

    const handlePointerLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const loop = () => {
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.075;
      m.y += (m.targetY - m.y) * 0.075;

      if (cardStageRef.current && imageRef.current) {
        const rotX = -m.y * 3.0;
        const rotY = m.x * 3.8;
        cardStageRef.current.style.transform = `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

        const imgX = -m.x * 10;
        const imgY = -m.y * 8;
        imageRef.current.style.transform = `scale(1.04) translate3d(${imgX.toFixed(1)}px, ${imgY.toFixed(1)}px, 0)`;

        if (pinsGroupRef.current) {
          const pinX = m.x * 7;
          const pinY = m.y * 5;
          pinsGroupRef.current.style.transform = `translate3d(${pinX.toFixed(1)}px, ${pinY.toFixed(1)}px, 20px)`;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-still-life-wrapper"
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* 3D Editorial Stage Frame */}
      <div
        ref={cardStageRef}
        className="hero-stage-card"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3.05",
          borderRadius: 14,
          overflow: "visible",
          transformStyle: "preserve-3d",
          boxShadow: "0 28px 64px -22px rgba(45, 38, 28, 0.16), 0 12px 28px -12px rgba(45, 38, 28, 0.08)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        {/* Overflow hidden inner wrapper for the photograph */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 14,
            overflow: "hidden",
            background: "#ede7dd",
          }}
        >
          {/* Master Curated Still Life Photograph */}
          <img
            ref={imageRef}
            src="/images/hero-still-life.jpg"
            alt="Third Shelf curated still life featuring minimal device stand, canvas carry pouch, ceramic catchall tray, and everyday bottle"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scale(1.04)",
              transition: "transform 0.1s ease-out",
              willChange: "transform",
            }}
          />

          {/* Warm Studio Ambient Light Vignette Layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 75% 25%, rgba(255,255,255,0.18) 0%, rgba(247,245,240,0) 65%), linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(37,37,34,0.06) 100%)",
            }}
          />

          {/* Subtle Studio Contact Shadow Layer at base */}
          <div
            style={{
              position: "absolute",
              left: "5%",
              right: "5%",
              bottom: 0,
              height: "22%",
              pointerEvents: "none",
              background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(37,37,34,0.09) 100%)",
            }}
          />
        </div>

        {/* Floating Pins & Hotspots Layer (in 3D depth) */}
        <div
          ref={pinsGroupRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "auto",
            transformStyle: "preserve-3d",
            zIndex: 10,
          }}
        >
          {HOTSPOTS.map((spot) => {
            const product = products?.[spot.categoryKey];
            const title = product?.title || spot.defaultTitle;
            const destinationHref = product?.handle ? `/products/${product.handle}` : spot.categoryHref;
            const isHovered = activePin === spot.id;

            return (
              <div
                key={spot.id}
                className="hero-pin-item"
                style={{
                  position: "absolute",
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isHovered ? 30 : 15,
                }}
                onMouseEnter={() => setActivePin(spot.id)}
                onMouseLeave={() => setActivePin(null)}
              >
                {/* Hotspot Target Button */}
                <Link
                  href={destinationHref}
                  aria-label={
                    product
                      ? `View ${title}, ${spot.categoryLabel}, $${product.price.toFixed(2)}`
                      : `Explore ${title} (${spot.categoryLabel})`
                  }
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onFocus={() => setActivePin(spot.id)}
                  onBlur={() => setActivePin(null)}
                >
                  {/* Subtle Pulse Ring */}
                  <span
                    style={{
                      position: "absolute",
                      inset: -3,
                      borderRadius: "50%",
                      border: isHovered
                        ? "2px solid #252522"
                        : "1.5px solid rgba(255, 255, 255, 0.8)",
                      backgroundColor: isHovered
                        ? "rgba(37, 37, 34, 0.15)"
                        : "rgba(255, 255, 255, 0.22)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                      animation: isHovered ? "none" : "heroPinPulse 3.2s ease-in-out infinite",
                      transform: isHovered ? "scale(1.2)" : "scale(1)",
                      transition: "transform 0.25s ease, border-color 0.25s ease, background-color 0.25s ease",
                    }}
                  />

                  {/* Core Charcoal Dot with Numeral */}
                  <span
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: isHovered ? "#252522" : "rgba(37, 37, 34, 0.88)",
                      color: "#f7f5f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                      transition: "background-color 0.25s ease, transform 0.25s ease",
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {spot.num}
                  </span>
                </Link>

                {/* Editorial Micro-Card Popover */}
                <div
                  className="hero-pin-card"
                  style={{
                    position: "absolute",
                    ...(spot.cardPosition === "top-right"
                      ? { left: "100%", bottom: "100%", transform: "translate(8px, 8px)" }
                      : spot.cardPosition === "bottom-left"
                      ? { right: "100%", top: "100%", transform: "translate(-8px, -8px)" }
                      : { right: "100%", bottom: "100%", transform: "translate(-8px, 8px)" }),
                    width: 200,
                    pointerEvents: isHovered ? "auto" : "none",
                    opacity: isHovered ? 1 : 0,
                    visibility: isHovered ? "visible" : "hidden",
                    transition: "opacity 0.22s ease, transform 0.22s ease, visibility 0.22s",
                    zIndex: 40,
                  }}
                >
                  <Link
                    href={destinationHref}
                    style={{
                      display: "block",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(37, 37, 34, 0.12)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      boxShadow: "0 14px 34px -10px rgba(45, 38, 28, 0.22), 0 4px 12px rgba(45, 38, 28, 0.08)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 0.2s ease, background 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          fontWeight: 700,
                        }}
                      >
                        {spot.num} · {spot.categoryLabel}
                      </span>
                      <ArrowUpRight size={13} style={{ color: "var(--muted)" }} />
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--ink)",
                        lineHeight: 1.3,
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6b5e4f",
                        fontWeight: 500,
                      }}
                    >
                      {product?.price != null ? `$${product.price.toFixed(2)}` : "Explore collection →"}
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Editorial Signature Brand Caption */}
        <div
          className="hero-signature-badge"
          style={{
            position: "absolute",
            right: -24,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 9,
            letterSpacing: ".18em",
            writingMode: "vertical-rl",
            color: "var(--muted)",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>THE EVERYDAY EDIT · VOL. 01</span>
        </div>
      </div>

      {/* Editorial Mini-Index Strip (Multi-Category Discovery) */}
      <div
        className="hero-index-strip"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          paddingInline: 2,
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--muted)",
            fontWeight: 700,
            marginRight: 2,
          }}
        >
          Featured:
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {HOTSPOTS.map((spot) => {
            const product = products?.[spot.categoryKey];
            const title = product?.title || spot.defaultTitle;
            const destinationHref = product?.handle ? `/products/${product.handle}` : spot.categoryHref;
            const isHovered = activePin === spot.id;

            return (
              <Link
                key={spot.id}
                href={destinationHref}
                className="hero-chip-item"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 11px",
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: ".01em",
                  border: isHovered
                    ? "1px solid var(--ink)"
                    : "1px solid rgba(37, 37, 34, 0.16)",
                  backgroundColor: isHovered ? "var(--ink)" : "rgba(255, 255, 255, 0.8)",
                  color: isHovered ? "#fff" : "var(--ink)",
                  boxShadow: isHovered
                    ? "0 4px 12px rgba(37,37,34,0.18)"
                    : "0 1px 3px rgba(37,37,34,0.04)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={() => setActivePin(spot.id)}
                onMouseLeave={() => setActivePin(null)}
              >
                <span
                  style={{
                    color: isHovered ? "#ded8ce" : "var(--muted)",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {spot.num}
                </span>
                <span>{title}</span>
                {product?.price != null ? (
                  <span style={{ opacity: 0.65, fontSize: 10 }}>${product.price.toFixed(0)}</span>
                ) : (
                  <ArrowUpRight size={11} style={{ opacity: 0.65 }} />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes heroPinPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.92);
            opacity: 0.65;
          }
        }
        @media (max-width: 950px) {
          .hero-signature-badge {
            display: none !important;
          }
        }
        @media (max-width: 850px) {
          .hero-index-strip {
            gap: 6px !important;
            margin-top: 2px !important;
          }
        }
      `}</style>
    </div>
  );
}
