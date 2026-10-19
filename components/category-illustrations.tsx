"use client";

import React from "react";

interface IllustrationProps {
  className?: string;
}

/**
 * 1. TECHNOLOGY (Full-Bleed 2D Vector Illustration)
 * Stylized laptop, smartphone on stand, coiled woven cable, and alignment marks.
 */
export function TechnologyIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`category-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Warm stone gradient backdrop */}
        <linearGradient id="techBg" x1="150" y1="0" x2="150" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ede6db" />
          <stop offset="60%" stopColor="#e2d9cb" />
          <stop offset="100%" stopColor="#cfc4b3" />
        </linearGradient>
        <linearGradient id="techScreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfcf9" />
          <stop offset="100%" stopColor="#ede6dc" />
        </linearGradient>
        <radialGradient id="techSun" cx="60%" cy="30%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Background fill */}
      <rect width="300" height="400" fill="url(#techBg)" />
      <rect width="300" height="400" fill="url(#techSun)" />

      {/* Architectural Background Panel Arc */}
      <path
        d="M30 400L30 140C30 73.7 83.7 20 150 20C216.3 20 270 73.7 270 140L270 400Z"
        fill="#ded4c3"
        opacity="0.5"
      />

      {/* Alignment Guide Dashed Lines */}
      <g className="tech-guide-lines" stroke="#8d806f" strokeWidth="1" strokeDasharray="4 4" opacity="0.45">
        <line x1="20" y1="112" x2="280" y2="112" />
        <line x1="20" y1="242" x2="280" y2="242" />
        <line x1="150" y1="40" x2="150" y2="280" />
      </g>

      {/* Desk Surface Mat */}
      <rect
        x="20"
        y="218"
        width="260"
        height="84"
        rx="10"
        fill="#d3c7b5"
        stroke="#252522"
        strokeWidth="1.5"
      />

      {/* Laptop & Accessory Cast Shadow */}
      <ellipse cx="120" cy="242" rx="76" ry="10" fill="rgba(37,37,34,0.12)" />
      <ellipse cx="226" cy="246" rx="24" ry="6" fill="rgba(37,37,34,0.14)" />

      {/* Stylized Laptop Group (slides slightly upward into alignment) */}
      <g className="tech-laptop">
        {/* Open Laptop Screen Lid */}
        <path
          d="M52 118C52 114.7 54.7 112 58 112L182 112C185.3 112 188 114.7 188 118L188 226L52 226L52 118Z"
          fill="#252522"
        />
        {/* Screen Display */}
        <rect
          x="58"
          y="118"
          width="124"
          height="98"
          rx="4"
          fill="url(#techScreen)"
          stroke="#383632"
          strokeWidth="1.2"
        />
        {/* Minimal Wireframe Content on Screen */}
        <rect x="68" y="128" width="42" height="6" rx="2" fill="#b7a48a" />
        <rect x="68" y="142" width="104" height="3" rx="1.5" fill="#ded5c6" />
        <rect x="68" y="150" width="86" height="3" rx="1.5" fill="#ded5c6" />
        <rect x="68" y="158" width="94" height="3" rx="1.5" fill="#ded5c6" />
        <rect x="68" y="172" width="48" height="32" rx="3" fill="#e8dfd1" stroke="#d5cabb" strokeWidth="1" />
        <rect x="124" y="172" width="48" height="32" rx="3" fill="#e8dfd1" stroke="#d5cabb" strokeWidth="1" />
        <circle cx="120" cy="115" r="1.5" fill="#8d806f" />

        {/* Laptop Lower Deck / Base */}
        <path
          d="M38 226L202 226C205 226 207 228.5 205.5 231.5L199.5 241C198.5 243 196 244 193 244L47 244C44 244 41.5 243 40.5 241L34.5 231.5C33 228.5 35 226 38 226Z"
          fill="#dcd4c5"
          stroke="#252522"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Trackpad */}
        <rect x="104" y="231" width="32" height="9" rx="2" fill="#ebe4d7" stroke="rgba(37,37,34,0.25)" strokeWidth="1" />
        <path d="M112 227L128 227" stroke="#252522" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Stylized Smartphone on Angled Stand */}
      <g className="tech-phone">
        {/* Angled Stand Base */}
        <path d="M214 246L242 246L236 222L222 222Z" fill="#383632" stroke="#252522" strokeWidth="1.2" />
        {/* Smartphone Body */}
        <rect
          x="212"
          y="152"
          width="32"
          height="68"
          rx="6"
          fill="#252522"
          stroke="#252522"
          strokeWidth="1.5"
        />
        {/* Screen Display */}
        <rect x="215" y="156" width="26" height="60" rx="4" fill="#faf8f5" />
        {/* Screen Content Blocks */}
        <rect x="219" y="164" width="18" height="3" rx="1" fill="#b7a48a" />
        <rect x="219" y="172" width="12" height="2" rx="1" fill="#ded5c6" />
        <rect x="219" y="186" width="18" height="18" rx="3" fill="#e8dfd1" />
        <line x1="225" y1="158" x2="231" y2="158" stroke="#252522" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Coiled Woven Cable */}
      <g className="tech-cable">
        <path
          d="M198 232C212 232 216 254 196 256C176 258 174 245 160 245C148 245 146 254 136 254"
          fill="none"
          stroke="#252522"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <rect x="196" y="230" width="8" height="5" rx="1.5" fill="#b7a48a" stroke="#252522" strokeWidth="1" />
      </g>

      {/* Movement & Precision Alignment Indicators */}
      <g className="tech-ticks" stroke="#252522" strokeWidth="1.2" strokeLinecap="round">
        <line x1="46" y1="102" x2="46" y2="96" />
        <line x1="194" y1="102" x2="194" y2="96" />
        <line x1="250" y1="142" x2="250" y2="136" />
      </g>
    </svg>
  );
}

/**
 * 2. HOME ESSENTIALS (Full-Bleed 2D Vector Illustration)
 * Interior vignette: sculptural desk lamp, layered storage boxes, botanical potted plant.
 */
export function HomeIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`category-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="homeBg" x1="150" y1="0" x2="150" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ebe4d8" />
          <stop offset="60%" stopColor="#ded5c6" />
          <stop offset="100%" stopColor="#ccbfad" />
        </linearGradient>
        <linearGradient id="homeLampGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255, 238, 184, 0.6)" />
          <stop offset="100%" stopColor="rgba(255, 245, 219, 0.02)" />
        </linearGradient>
      </defs>

      {/* Background fill */}
      <rect width="300" height="400" fill="url(#homeBg)" />

      {/* Architectural Wall Niche Arch */}
      <path
        d="M25 400L25 150C25 81 81 25 150 25C219 25 275 81 275 150L275 400Z"
        fill="#ded4c3"
        opacity="0.45"
      />

      {/* Furniture Credenza Surface Ledge */}
      <rect x="20" y="246" width="260" height="8" rx="2" fill="#c4b7a4" stroke="#252522" strokeWidth="1.5" />
      <line x1="15" y1="246" x2="285" y2="246" stroke="#252522" strokeWidth="1.5" strokeLinecap="round" />

      {/* Cast Shadow on Shelf */}
      <ellipse cx="150" cy="248" rx="105" ry="8" fill="rgba(37,37,34,0.12)" />

      {/* Lamp Diffuse Light Cone (Glows & expands on hover) */}
      <polygon
        points="76,88 12,246 142,246"
        fill="url(#homeLampGlow)"
        className="home-lamp-glow"
        opacity="0.3"
      />

      {/* Sculptural Desk / Floor Lamp */}
      <g className="home-lamp">
        {/* Lamp Base */}
        <rect x="62" y="242" width="28" height="4.5" rx="2" fill="#252522" />
        {/* Elegant Curved Stem */}
        <path
          d="M76 242C76 172 58 116 74 84"
          fill="none"
          stroke="#252522"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Shade Dome */}
        <path
          d="M58 86C58 70 94 70 94 86C86 90 66 90 58 86Z"
          fill="#b7a48a"
          stroke="#252522"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Warm Bulb */}
        <circle cx="76" cy="88" r="3" fill="#fff5d6" />
      </g>

      {/* Layered Storage Boxes */}
      <g className="home-boxes">
        {/* Bottom Storage Trunk */}
        <rect
          x="112"
          y="186"
          width="76"
          height="60"
          rx="5"
          fill="#ebe4d8"
          stroke="#252522"
          strokeWidth="1.6"
        />
        <rect
          x="109"
          y="180"
          width="82"
          height="8"
          rx="2.5"
          fill="#ded5c4"
          stroke="#252522"
          strokeWidth="1.5"
        />
        {/* Fluted Vertical Texture */}
        <line x1="126" y1="196" x2="126" y2="236" stroke="rgba(37,37,34,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="138" y1="196" x2="138" y2="236" stroke="rgba(37,37,34,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="150" y1="196" x2="150" y2="236" stroke="rgba(37,37,34,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="162" y1="196" x2="162" y2="236" stroke="rgba(37,37,34,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="174" y1="196" x2="174" y2="236" stroke="rgba(37,37,34,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Leather Pull Tab */}
        <rect x="146" y="206" width="9" height="15" rx="2" fill="#8d806f" stroke="#252522" strokeWidth="1" />

        {/* Top Storage Box (lifts subtly on hover) */}
        <g className="home-top-box">
          <rect
            x="122"
            y="142"
            width="56"
            height="38"
            rx="4"
            fill="#faf7f2"
            stroke="#252522"
            strokeWidth="1.5"
          />
          <rect
            x="120"
            y="136"
            width="60"
            height="7"
            rx="2"
            fill="#d5c8b7"
            stroke="#252522"
            strokeWidth="1.5"
          />
          <rect x="140" y="154" width="20" height="11" rx="2" fill="#ede6db" stroke="rgba(37,37,34,0.3)" strokeWidth="1" />
        </g>
      </g>

      {/* Potted Botanical Plant (leaves sway gracefully on hover) */}
      <g className="home-plant">
        {/* Ceramic Planter */}
        <path
          d="M210 206L250 206L245 246L215 246Z"
          fill="#dcd4c6"
          stroke="#252522"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="212" y1="214" x2="248" y2="214" stroke="rgba(37,37,34,0.2)" strokeWidth="1" />

        {/* Stems */}
        <path d="M230 206C230 174 216 148 205 128" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M230 206C234 176 245 154 258 132" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M230 196C230 160 230 134 230 112" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

        {/* Muted Sage & Olive Leaves */}
        <path
          className="home-leaf home-leaf-1"
          d="M205 128C190 134 182 148 190 156C200 162 210 146 205 128Z"
          fill="#7d8c7c"
          stroke="#252522"
          strokeWidth="1.4"
        />
        <path
          className="home-leaf home-leaf-2"
          d="M258 132C272 138 278 156 270 164C260 170 252 154 258 132Z"
          fill="#8a9889"
          stroke="#252522"
          strokeWidth="1.4"
        />
        <path
          className="home-leaf home-leaf-3"
          d="M230 112C220 94 240 94 240 112C240 122 232 122 230 112Z"
          fill="#728271"
          stroke="#252522"
          strokeWidth="1.4"
        />
        <path
          className="home-leaf home-leaf-4"
          d="M220 162C208 164 204 180 212 186C222 188 228 174 220 162Z"
          fill="#8a9889"
          stroke="#252522"
          strokeWidth="1.4"
        />
      </g>
    </svg>
  );
}

/**
 * 3. TRAVEL (Full-Bleed 2D Vector Illustration)
 * Technical daypack, ribbed carry-on suitcase, passport booklet, and animated itinerary route line.
 */
export function TravelIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`category-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="travelBg" x1="150" y1="0" x2="150" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ebe5db" />
          <stop offset="60%" stopColor="#ded7cb" />
          <stop offset="100%" stopColor="#cdc2b0" />
        </linearGradient>
      </defs>

      {/* Background fill */}
      <rect width="300" height="400" fill="url(#travelBg)" />

      {/* Horizon Architectural Arch */}
      <circle cx="150" cy="220" r="110" fill="#ded5c4" opacity="0.45" />

      {/* Ground Plane line */}
      <line x1="20" y1="248" x2="280" y2="248" stroke="rgba(37,37,34,0.22)" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="150" cy="248" rx="100" ry="8" fill="rgba(37,37,34,0.12)" />

      {/* Animated Curving Itinerary Route Line */}
      <g className="travel-route-group">
        <path
          d="M45 128 C85 72, 175 62, 206 112 C228 148, 260 132, 272 98"
          fill="none"
          stroke="#8d806f"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          className="travel-route-line"
        />
        {/* Route waypoint dots */}
        <circle cx="45" cy="128" r="3.5" fill="#252522" />
        <circle cx="206" cy="112" r="3" fill="#b7a48a" />
        <circle cx="272" cy="98" r="4" fill="#252522" />
        {/* Directional arrow */}
        <path d="M268 92L276 98L270 106" stroke="#252522" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Ribbed Suitcase (Midground) */}
      <g className="travel-suitcase">
        {/* Telescopic Handle */}
        <path d="M174 114L174 84L214 84L214 114" fill="none" stroke="#252522" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="168" y="78" width="52" height="7" rx="2.5" fill="#252522" />

        {/* Suitcase Body */}
        <rect
          x="156"
          y="114"
          width="74"
          height="126"
          rx="10"
          fill="#ded6c7"
          stroke="#252522"
          strokeWidth="1.8"
        />
        {/* Ribbed grooves */}
        <line x1="170" y1="134" x2="170" y2="220" stroke="rgba(37,37,34,0.2)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="184" y1="134" x2="184" y2="220" stroke="rgba(37,37,34,0.2)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="198" y1="134" x2="198" y2="220" stroke="rgba(37,37,34,0.2)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="212" y1="134" x2="212" y2="220" stroke="rgba(37,37,34,0.2)" strokeWidth="1.8" strokeLinecap="round" />

        {/* Corner Reinforcements */}
        <path d="M156 126C156 119.4 161.4 114 168 114" stroke="#252522" strokeWidth="2.4" />
        <path d="M230 126C230 119.4 224.6 114 218 114" stroke="#252522" strokeWidth="2.4" />

        {/* Spinner Wheels */}
        <circle cx="170" cy="244" r="4.5" fill="#252522" />
        <circle cx="216" cy="244" r="4.5" fill="#252522" />
      </g>

      {/* Technical Daypack / Backpack (Foreground, lifts gently on hover) */}
      <g className="travel-backpack">
        {/* Grab Handle */}
        <path d="M88 138C88 126 112 126 112 138" fill="none" stroke="#252522" strokeWidth="2.2" strokeLinecap="round" />

        {/* Backpack Body */}
        <path
          d="M70 242C64 242 60 236 60 228L62 164C62 146 78 136 100 136C122 136 138 146 138 164L140 228C140 236 136 242 130 242Z"
          fill="#2f2e2b"
          stroke="#252522"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Front Zip Pocket */}
        <path
          d="M68 190C68 184 72 182 78 182L122 182C128 182 132 184 132 190L130 238C130 240 128 242 126 242L74 242C72 242 70 240 70 238Z"
          fill="#3c3b37"
          stroke="#252522"
          strokeWidth="1.5"
        />
        {/* Horizontal Zip Line */}
        <line x1="72" y1="192" x2="128" y2="192" stroke="#b7a48a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M116 192L118 204" stroke="#8d806f" strokeWidth="1.8" strokeLinecap="round" />

        {/* Diamond Leather Lash Patch */}
        <rect x="93" y="154" width="16" height="16" rx="3" fill="#8d806f" stroke="#252522" strokeWidth="1" />
        <line x1="97" y1="162" x2="105" y2="162" stroke="#ede7dd" strokeWidth="1.2" strokeLinecap="round" />

        {/* Water bottle side pouch */}
        <path d="M60 196C56 198 55 216 60 228" fill="none" stroke="#252522" strokeWidth="1.5" />
      </g>

      {/* Stylized Passport Booklet (Foreground accent between backpack & suitcase) */}
      <g className="travel-passport">
        {/* Soft cast shadow */}
        <polygon points="124,246 166,246 170,212 128,212" fill="rgba(37,37,34,0.18)" />
        {/* Inner cream page edge */}
        <polygon points="127,209 164,205 167,245 130,245" fill="#faf8f5" stroke="#252522" strokeWidth="1" />
        {/* Passport Booklet Cover (Deep charcoal with gold foil emblem) */}
        <polygon
          points="125,210 162,206 165,246 128,246"
          fill="#252522"
          stroke="#252522"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Gold Emblem Crest and Typography Line */}
        <circle cx="145" cy="223" r="5" fill="none" stroke="#b7a48a" strokeWidth="1" />
        <circle cx="145" cy="223" r="2" fill="#b7a48a" />
        <line x1="135" y1="215" x2="155" y2="213" stroke="#b7a48a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="138" y1="233" x2="152" y2="232" stroke="#b7a48a" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Luggage Tag / Clip Accent */}
      <g className="travel-tag">
        <line x1="140" y1="170" x2="150" y2="182" stroke="#252522" strokeWidth="1.4" />
        <polygon points="148,180 160,192 153,199 141,187" fill="#b7a48a" stroke="#252522" strokeWidth="1.4" />
        <circle cx="147" cy="183" r="1.5" fill="#faf8f5" />
      </g>
    </svg>
  );
}

/**
 * 4. EVERYDAY FINDS (Full-Bleed 2D Vector Illustration)
 * Reusable thermal bottle, bound notebook with ribbon, brass EDC keys on tabletop.
 */
export function EverydayIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`category-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="everydayBg" x1="150" y1="0" x2="150" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ece5dc" />
          <stop offset="60%" stopColor="#dfd7cb" />
          <stop offset="100%" stopColor="#cdbfac" />
        </linearGradient>
      </defs>

      {/* Background fill */}
      <rect width="300" height="400" fill="url(#everydayBg)" />

      {/* Composition Circles in Background */}
      <circle cx="150" cy="190" r="105" fill="#dfd6c5" opacity="0.45" />

      {/* Tabletop Surface Line */}
      <line x1="20" y1="248" x2="280" y2="248" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="150" cy="248" rx="100" ry="8" fill="rgba(37,37,34,0.12)" />

      {/* Subtle Ambient Sparkles / Editorial Ticks */}
      <g className="everyday-sparkles" stroke="#8d806f" strokeWidth="1.2" strokeLinecap="round" opacity="0.6">
        <line x1="52" y1="120" x2="52" y2="132" />
        <line x1="46" y1="126" x2="58" y2="126" />
        <circle cx="254" cy="132" r="2" fill="#8d806f" />
      </g>

      {/* Bound Hardcover Journal / Notebook */}
      <g className="everyday-notebook">
        {/* Shadow under tilted book */}
        <path d="M142 246L228 246L242 160L156 160Z" fill="rgba(37,37,34,0.14)" />
        {/* Cover */}
        <path
          d="M148 246L226 246C230 246 233 243 234 239L244 153C245 149 242 146 238 146L160 146C156 146 153 149 152 153L142 239C141 243 144 246 148 246Z"
          fill="#ebe4d8"
          stroke="#252522"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Page Block */}
        <path d="M162 152L236 152L226 240L152 240Z" fill="#faf8f5" />
        {/* Elastic Retention Band */}
        <line x1="216" y1="148" x2="206" y2="244" stroke="#252522" strokeWidth="2.5" />

        {/* Bookmark Ribbon (drifts on hover) */}
        <path
          d="M190 148L190 258L185 252L180 258L180 148"
          fill="#8d806f"
          className="everyday-ribbon"
        />
      </g>

      {/* Reusable Thermal Water Bottle (floats gently on hover) */}
      <g className="everyday-bottle">
        {/* Bottle shadow */}
        <ellipse cx="98" cy="246" rx="24" ry="6" fill="rgba(37,37,34,0.18)" />

        {/* Bottle Body */}
        <rect
          x="74"
          y="142"
          width="48"
          height="100"
          rx="12"
          fill="#6d7d6d"
          stroke="#252522"
          strokeWidth="1.8"
        />
        {/* Shoulder / Neck */}
        <path
          d="M80 142C80 128 88 124 88 118L108 118C108 124 116 128 116 142Z"
          fill="#5f6e5f"
          stroke="#252522"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Cap */}
        <rect
          x="86"
          y="104"
          width="24"
          height="14"
          rx="3"
          fill="#252522"
          stroke="#252522"
          strokeWidth="1.4"
        />
        {/* Carry Loop Handle */}
        <path
          d="M92 104C92 92 104 92 104 104"
          fill="none"
          stroke="#b7a48a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Matte reflection accent */}
        <line x1="84" y1="154" x2="84" y2="228" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Everyday Carry Brass Keyring & Keys */}
      <g className="everyday-keys">
        {/* Key Ring */}
        <circle cx="146" cy="238" r="10" fill="none" stroke="#252522" strokeWidth="1.8" />
        {/* Primary Brass Key */}
        <path
          d="M154 240L186 240L186 244L181 244L181 248L176 248L176 240"
          fill="#b7a48a"
          stroke="#252522"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Secondary Key */}
        <line x1="150" y1="244" x2="172" y2="252" stroke="#8d806f" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function CategoryIllustration({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const norm = (category || "").toLowerCase();
  if (norm.includes("tech")) return <TechnologyIllustration className={className} />;
  if (norm.includes("home")) return <HomeIllustration className={className} />;
  if (norm.includes("travel")) return <TravelIllustration className={className} />;
  return <EverydayIllustration className={className} />;
}

