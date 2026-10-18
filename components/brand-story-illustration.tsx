"use client";

import React from "react";

interface BrandStoryIllustrationProps {
  className?: string;
}

/**
 * BRAND STORY 2D EDITORIAL ILLUSTRATION
 *
 * Replaces the photographic glass-walled office with a custom, cohesive 2D vector artwork
 * representing "Less noise. More considered choices."
 *
 * Features:
 * - Architectural wall niche arch and morning sunlight gradient
 * - Sculptural floating credenza shelf with oak texture
 * - Tall minimalist curved stem lamp with warm ambient glow cone
 * - Botanical potted plant with architectural sage/olive leaves
 * - Stack of linen-bound hardcover volumes and notebooks with ribbon bookmark
 * - Reusable thermal bottle and brass everyday-carry tray
 * - Exact same line weights, 2D vector language, and brand palette as category cards
 */
export function BrandStoryIllustration({ className = "" }: BrandStoryIllustrationProps) {
  return (
    <div className={`brand-story-illustration-wrapper ${className}`}>
      <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-story-svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Architectural stone background gradient */}
          <linearGradient id="storyBg" x1="200" y1="0" x2="200" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0eae0" />
            <stop offset="55%" stopColor="#e5dccf" />
            <stop offset="100%" stopColor="#d3c5b2" />
          </linearGradient>

          {/* Ambient sunlight wash */}
          <radialGradient id="storySunlight" cx="30%" cy="25%" r="65%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
            <stop offset="60%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>

          {/* Warm lamp glow cone */}
          <linearGradient id="storyLampGlow" x1="240" y1="95" x2="240" y2="310" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255, 238, 185, 0.65)" />
            <stop offset="45%" stopColor="rgba(255, 242, 205, 0.25)" />
            <stop offset="100%" stopColor="rgba(255, 246, 225, 0.02)" />
          </linearGradient>

          {/* Leaning art gradient */}
          <linearGradient id="artBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#faf8f5" />
            <stop offset="100%" stopColor="#ece5dc" />
          </linearGradient>
        </defs>

        {/* 1. Base Wall Background */}
        <rect width="400" height="500" fill="url(#storyBg)" />
        <rect width="400" height="500" fill="url(#storySunlight)" />

        {/* 2. Architectural Wall Niche Arch */}
        <path
          d="M45 500 L45 190 C45 102 114 32 200 32 C286 32 355 102 355 190 L355 500 Z"
          fill="#ded4c3"
          opacity="0.5"
        />

        {/* 3. Subtle Technical Grid Lines */}
        <g className="story-grid-lines" stroke="#8d806f" strokeWidth="1" strokeDasharray="4 4" opacity="0.35">
          <line x1="30" y1="130" x2="370" y2="130" />
          <line x1="30" y1="310" x2="370" y2="310" />
          <line x1="200" y1="50" x2="200" y2="450" />
          <circle cx="200" cy="180" r="110" fill="none" stroke="#8d806f" strokeWidth="1" strokeDasharray="3 5" opacity="0.25" />
        </g>

        {/* 4. Leaning Minimalist Art Print (Background accent) */}
        <g className="story-framed-art">
          <rect
            x="68"
            y="148"
            width="92"
            height="124"
            rx="4"
            fill="rgba(37,37,34,0.12)"
            transform="rotate(-2 68 148)"
          />
          <rect
            x="66"
            y="144"
            width="92"
            height="124"
            rx="3"
            fill="url(#artBg)"
            stroke="#252522"
            strokeWidth="1.6"
            transform="rotate(-2 66 144)"
          />
          {/* Abstract Art Composition */}
          <path
            d="M80 236 C80 200 110 180 138 180 C146 180 148 184 148 190 L148 236 Z"
            fill="#d8ccbb"
            transform="rotate(-2 66 144)"
          />
          <circle cx="106" cy="184" r="14" fill="#b7a48a" transform="rotate(-2 66 144)" />
          <line x1="84" y1="210" x2="140" y2="210" stroke="#7d8c7c" strokeWidth="1.8" strokeLinecap="round" transform="rotate(-2 66 144)" />
        </g>

        {/* 5. Minimal Wall Baseboard Line */}
        <line x1="20" y1="440" x2="380" y2="440" stroke="rgba(37,37,34,0.18)" strokeWidth="1.2" strokeLinecap="round" />

        {/* 6. Solid Oak Floating Credenza / Shelf Ledge */}
        <g className="story-shelf">
          {/* Deep Cast Shadow under shelf */}
          <ellipse cx="200" cy="316" rx="165" ry="12" fill="rgba(37,37,34,0.15)" />
          {/* Shelf Plank */}
          <rect
            x="25"
            y="306"
            width="350"
            height="12"
            rx="3"
            fill="#c9bcab"
            stroke="#252522"
            strokeWidth="1.6"
          />
          {/* Front Bevel Highlight */}
          <line x1="27" y1="307" x2="373" y2="307" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* 7. Radiant Lamp Light Cone (Soft warm ambient pool) */}
        <polygon
          points="242,98 128,306 352,306"
          fill="url(#storyLampGlow)"
          className="story-lamp-glow"
          opacity="0.4"
        />

        {/* 8. Sculptural Curved Stem Lamp */}
        <g className="story-lamp">
          {/* Heavy Turned Lamp Base */}
          <rect x="256" y="300" width="34" height="6" rx="2" fill="#252522" />
          {/* Minimal Stem rising and curving left over the desk */}
          <path
            d="M273 300 C273 205 258 140 242 96"
            fill="none"
            stroke="#252522"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Turned Shade Dome */}
          <path
            d="M222 96 C222 78 262 78 262 96 C252 101 232 101 222 96 Z"
            fill="#b7a48a"
            stroke="#252522"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Warm Filament Glow Bulb */}
          <circle cx="242" cy="98" r="3.5" fill="#fff5d2" />
          {/* Subtle Ambient Rings */}
          <circle cx="242" cy="98" r="9" fill="none" stroke="rgba(255,245,210,0.4)" strokeWidth="1" />
        </g>

        {/* 9. Minimalist Reusable Thermal Bottle (Midground) */}
        <g className="story-bottle">
          {/* Bottle Shadow */}
          <ellipse cx="206" cy="306" rx="16" ry="4" fill="rgba(37,37,34,0.18)" />
          {/* Body */}
          <rect
            x="192"
            y="196"
            width="28"
            height="76"
            rx="8"
            fill="#6d7d6d"
            stroke="#252522"
            strokeWidth="1.6"
          />
          {/* Tapered Shoulder */}
          <path
            d="M196 196 C196 186 200 184 200 178 L212 178 C212 184 216 186 216 196 Z"
            fill="#5e6d5e"
            stroke="#252522"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Cap & Loop */}
          <rect x="201" y="168" width="10" height="10" rx="2" fill="#252522" />
          <path d="M203 168 C203 160 209 160 209 168" fill="none" stroke="#b7a48a" strokeWidth="2" strokeLinecap="round" />
          {/* Vertical reflection */}
          <line x1="198" y1="204" x2="198" y2="264" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* 10. Stack of Linen-Bound Volumes & Notebooks */}
        <g className="story-books">
          {/* Cast shadow under books */}
          <rect x="136" y="304" width="86" height="4" rx="2" fill="rgba(37,37,34,0.22)" />

          {/* Book 1: Large Base Volume (Deep Charcoal) */}
          <g className="story-book-1">
            <rect x="134" y="286" width="90" height="18" rx="2.5" fill="#252522" stroke="#252522" strokeWidth="1.5" />
            <rect x="142" y="289" width="80" height="12" fill="#faf8f5" />
            <line x1="138" y1="289" x2="138" y2="301" stroke="#b7a48a" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Book 2: Middle Volume (Warm Limestone Linen) */}
          <g className="story-book-2">
            <rect x="142" y="268" width="76" height="17" rx="2.5" fill="#ebe4d8" stroke="#252522" strokeWidth="1.5" />
            <rect x="148" y="271" width="68" height="11" fill="#faf8f5" />
            <rect x="156" y="274" width="22" height="5" rx="1" fill="#b7a48a" />
          </g>

          {/* Book 3: Top Notebook with Elastic Band & Bookmark Ribbon */}
          <g className="story-book-3">
            <rect x="148" y="252" width="64" height="15" rx="2.5" fill="#ded5c6" stroke="#252522" strokeWidth="1.5" />
            <line x1="196" y1="252" x2="196" y2="267" stroke="#252522" strokeWidth="2" />
            {/* Dangling Ribbon Bookmark */}
            <path
              d="M174 267 L174 294 L171 290 L168 294 L168 267"
              fill="#8d806f"
              className="story-ribbon"
            />
          </g>
        </g>

        {/* 11. Botanical Ceramic Planter with Architectural Leaves */}
        <g className="story-plant">
          {/* Ceramic Planter Shadow */}
          <ellipse cx="98" cy="306" rx="20" ry="5" fill="rgba(37,37,34,0.18)" />

          {/* Tapered Ceramic Planter Pot */}
          <path
            d="M82 254 L114 254 L109 306 L87 306 Z"
            fill="#ded5c6"
            stroke="#252522"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <line x1="84" y1="262" x2="112" y2="262" stroke="rgba(37,37,34,0.18)" strokeWidth="1" />

          {/* Architectural Plant Stems */}
          <path d="M98 254 C98 214 84 178 72 152" stroke="#252522" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M98 254 C104 218 118 190 134 164" stroke="#252522" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M98 244 C98 200 98 168 98 140" stroke="#252522" strokeWidth="1.8" strokeLinecap="round" />

          {/* Stylized Muted Sage/Olive Botanical Leaves */}
          <path
            className="story-leaf story-leaf-1"
            d="M72 152 C56 160 48 178 58 188 C70 196 82 176 72 152 Z"
            fill="#7d8c7c"
            stroke="#252522"
            strokeWidth="1.5"
          />
          <path
            className="story-leaf story-leaf-2"
            d="M134 164 C150 172 158 192 148 202 C136 210 126 190 134 164 Z"
            fill="#8a9889"
            stroke="#252522"
            strokeWidth="1.5"
          />
          <path
            className="story-leaf story-leaf-3"
            d="M98 140 C86 118 110 118 110 140 C110 152 100 152 98 140 Z"
            fill="#6d7d6d"
            stroke="#252522"
            strokeWidth="1.5"
          />
          <path
            className="story-leaf story-leaf-4"
            d="M86 200 C72 204 68 222 78 230 C90 232 96 216 86 200 Z"
            fill="#8a9889"
            stroke="#252522"
            strokeWidth="1.5"
          />
        </g>

        {/* 12. Everyday Carry Brass Tray & Accessories */}
        <g className="story-tray">
          {/* Shallow Catchall Dish */}
          <ellipse cx="320" cy="298" rx="34" ry="9" fill="#ded5c4" stroke="#252522" strokeWidth="1.5" />
          <ellipse cx="320" cy="296" rx="30" ry="7" fill="#ece5dc" />
          {/* Brass Split Keyring */}
          <circle cx="314" cy="296" r="6" fill="none" stroke="#252522" strokeWidth="1.4" />
          <path d="M318 296 L334 294 L334 297 L330 297 L330 300 L327 300 L327 296" fill="#b7a48a" stroke="#252522" strokeWidth="1.2" />
        </g>

        {/* 13. Minimalist Editorial Label / Badge at Bottom Left */}
        <g className="story-editorial-badge" opacity="0.6">
          <text
            x="36"
            y="476"
            fontFamily="var(--sans)"
            fontSize="8.5"
            fontWeight="600"
            letterSpacing="0.14em"
            fill="#8d806f"
          >
            THIRD SHELF · CONSIDERED LIVING · EDITORIAL STILL LIFE
          </text>
        </g>
      </svg>

      <style jsx>{`
        .brand-story-illustration-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #ebe5dc;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-story-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Subtle Micro-Animations */
        .story-lamp-glow {
          transition: opacity 0.5s ease, transform 0.5s ease;
          transform-origin: 242px 98px;
        }

        .story-lamp {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: 273px 300px;
        }

        .story-bottle {
          transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: center bottom;
        }

        .story-books {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: center bottom;
        }

        .story-ribbon {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 171px 267px;
        }

        .story-leaf {
          transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 98px 254px;
        }

        /* Interactive Hover Accents */
        .brand-story-illustration-wrapper:hover .story-lamp-glow {
          opacity: 0.7;
          transform: scale(1.04);
        }

        .brand-story-illustration-wrapper:hover .story-bottle {
          transform: translateY(-3px);
        }

        .brand-story-illustration-wrapper:hover .story-book-3 {
          transform: translateY(-2px);
        }

        .brand-story-illustration-wrapper:hover .story-ribbon {
          transform: rotate(4deg);
        }

        .brand-story-illustration-wrapper:hover .story-leaf-1 {
          transform: rotate(-3deg);
        }

        .brand-story-illustration-wrapper:hover .story-leaf-2 {
          transform: rotate(3deg);
        }

        .brand-story-illustration-wrapper:hover .story-leaf-3 {
          transform: rotate(-2deg);
        }

        /* prefers-reduced-motion fallback */
        @media (prefers-reduced-motion: reduce) {
          .story-lamp-glow,
          .story-lamp,
          .story-bottle,
          .story-books,
          .story-book-3,
          .story-ribbon,
          .story-leaf {
            transition: none !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
