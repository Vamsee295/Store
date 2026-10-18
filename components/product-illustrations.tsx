"use client";

import React from "react";

interface ProductIllustrationProps {
  className?: string;
}

/**
 * 1. CABLE ORGANIZER SET (silicone-cable-organizer)
 * Stylized silicone desk cable dock and magnetic cable clips with braided cables.
 */
export function CableOrganizerIllustration({ className = "" }: ProductIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`product-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cableBg" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3ede3" />
          <stop offset="60%" stopColor="#e7dfd2" />
          <stop offset="100%" stopColor="#d8cdbd" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect width="400" height="400" fill="url(#cableBg)" />

      {/* Architectural Background Arc */}
      <circle cx="200" cy="200" r="130" fill="#ded5c4" opacity="0.45" />

      {/* Alignment Guideline Ticks */}
      <g stroke="#8d806f" strokeWidth="1" strokeDasharray="4 4" opacity="0.4">
        <line x1="40" y1="260" x2="360" y2="260" />
        <line x1="200" y1="60" x2="200" y2="340" />
      </g>

      {/* Desk Surface Ledge & Shadow */}
      <ellipse cx="200" cy="272" rx="140" ry="12" fill="rgba(37,37,34,0.12)" />
      <line x1="30" y1="268" x2="370" y2="268" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

      {/* Main Cable Organizer Dock & Clips Group */}
      <g className="prod-anim-group">
        {/* Long Weighted Silicone Cable Base */}
        <rect
          x="75"
          y="238"
          width="250"
          height="32"
          rx="10"
          fill="#ded4c4"
          stroke="#252522"
          strokeWidth="1.8"
        />

        {/* 5 Precision Cable Channels / Slots */}
        {[108, 154, 200, 246, 292].map((x, i) => (
          <g key={i}>
            <rect
              x={x - 10}
              y="232"
              width="20"
              height="20"
              rx="4"
              fill="#252522"
            />
            <line x1={x} y1="232" x2={x} y2="248" stroke="#f3ede3" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Braided Cables Running Through the Organizer */}
        {/* Cable 1: Taupe USB-C Cable */}
        <path
          d="M108 320 C108 270 108 240 108 210 C108 170 80 140 80 100"
          fill="none"
          stroke="#8d806f"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="prod-cable-1"
        />
        {/* Cable 1 Aluminum Plug Head */}
        <rect x="74" y="90" width="12" height="18" rx="2" fill="#252522" />
        <rect x="77" y="82" width="6" height="8" rx="1" fill="#b7a48a" stroke="#252522" strokeWidth="1" />

        {/* Cable 2: Charcoal Heavy-Duty Power Cable */}
        <path
          d="M200 330 C200 270 200 230 200 170 C200 130 190 110 190 80"
          fill="none"
          stroke="#252522"
          strokeWidth="4"
          strokeLinecap="round"
          className="prod-cable-2"
        />
        <rect x="183" y="72" width="14" height="20" rx="3" fill="#b7a48a" stroke="#252522" strokeWidth="1.4" />
        <rect x="187" y="62" width="6" height="10" rx="1" fill="#faf8f5" stroke="#252522" strokeWidth="1" />

        {/* Cable 3: Muted Sage Auxiliary Cable */}
        <path
          d="M292 320 C292 270 292 230 292 180 C292 140 320 120 320 95"
          fill="none"
          stroke="#6d7d6d"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="prod-cable-3"
        />
        <rect x="314" y="86" width="12" height="18" rx="2" fill="#252522" />
        <rect x="317" y="78" width="6" height="8" rx="1" fill="#b7a48a" stroke="#252522" strokeWidth="1" />

        {/* Two Individual Magnetic Cable Dots / Clips Resting on Table */}
        <g className="prod-clip-1">
          <circle cx="154" cy="204" r="14" fill="#252522" />
          <circle cx="154" cy="204" r="6" fill="#b7a48a" stroke="#252522" strokeWidth="1.2" />
          <ellipse cx="154" cy="216" rx="12" ry="3" fill="rgba(37,37,34,0.14)" />
        </g>

        <g className="prod-clip-2">
          <circle cx="246" cy="198" r="14" fill="#ebe4d8" stroke="#252522" strokeWidth="1.6" />
          <circle cx="246" cy="198" r="6" fill="#6d7d6d" />
          <ellipse cx="246" cy="210" rx="12" ry="3" fill="rgba(37,37,34,0.14)" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 2. MINIMAL DEVICE STAND (minimal-device-stand)
 * Architectural angled walnut/aluminum desk stand cradling a smartphone or tablet.
 */
export function DeviceStandIllustration({ className = "" }: ProductIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`product-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="standBg" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3eee5" />
          <stop offset="60%" stopColor="#e8dfd2" />
          <stop offset="100%" stopColor="#d5c8b5" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf8f5" />
          <stop offset="100%" stopColor="#ede6db" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect width="400" height="400" fill="url(#standBg)" />

      {/* Horizon Architectural Circle */}
      <circle cx="200" cy="195" r="125" fill="#ded5c4" opacity="0.45" />

      {/* Precision Guide Grid */}
      <g stroke="#8d806f" strokeWidth="1" strokeDasharray="4 4" opacity="0.35">
        <line x1="40" y1="280" x2="360" y2="280" />
        <line x1="200" y1="50" x2="200" y2="350" />
      </g>

      {/* Cast Shadow on Tabletop */}
      <ellipse cx="200" cy="284" rx="130" ry="12" fill="rgba(37,37,34,0.14)" />
      <line x1="40" y1="280" x2="360" y2="280" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

      {/* Stand & Resting Device */}
      <g className="prod-anim-group">
        {/* Sculptural Angled Wooden/Aluminum Stand Base */}
        <polygon
          points="130,280 270,280 255,235 145,235"
          fill="#383632"
          stroke="#252522"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Upright Angled Backplate */}
        <polygon
          points="145,235 255,235 240,110 160,110"
          fill="#c4b5a0"
          stroke="#252522"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Cable Pass-Through Port */}
        <rect x="186" y="165" width="28" height="44" rx="14" fill="#252522" />

        {/* Front Ledge Lip holding the device */}
        <path
          d="M135 280 L265 280 L265 264 C265 260 262 258 258 258 L142 258 C138 258 135 260 135 264 Z"
          fill="#252522"
          stroke="#252522"
          strokeWidth="1.6"
        />
        {/* Silicone Cushion Pad on Lip */}
        <line x1="145" y1="262" x2="255" y2="262" stroke="#b7a48a" strokeWidth="2" strokeLinecap="round" />

        {/* Smartphone / Tablet Resting on Stand */}
        <g className="prod-stand-device">
          {/* Shadow Behind Device */}
          <rect
            x="122"
            y="94"
            width="156"
            height="172"
            rx="12"
            fill="rgba(37,37,34,0.12)"
          />
          {/* Outer Bezel (Charcoal) */}
          <rect
            x="120"
            y="90"
            width="160"
            height="174"
            rx="10"
            fill="#252522"
            stroke="#252522"
            strokeWidth="1.8"
          />
          {/* Screen Display */}
          <rect
            x="126"
            y="96"
            width="148"
            height="162"
            rx="7"
            fill="url(#screenGrad)"
          />
          {/* Wireframe Editorial Content on Screen */}
          <rect x="140" y="112" width="56" height="8" rx="2" fill="#b7a48a" />
          <rect x="140" y="128" width="120" height="4" rx="2" fill="#ded5c6" />
          <rect x="140" y="138" width="96" height="4" rx="2" fill="#ded5c6" />
          {/* Two Clean Content Card Blocks */}
          <rect x="140" y="156" width="56" height="52" rx="4" fill="#ebe4d8" stroke="#ded5c6" strokeWidth="1" />
          <rect x="204" y="156" width="56" height="52" rx="4" fill="#ebe4d8" stroke="#ded5c6" strokeWidth="1" />
          <circle cx="200" cy="100" r="2" fill="#8d806f" />
        </g>

        {/* Woven Cable passing neatly through the rear channel */}
        <path
          d="M200 200 C200 240 220 280 220 320"
          fill="none"
          stroke="#8d806f"
          strokeWidth="3"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/**
 * 3. MODULAR DRAWER ORGANIZER (modular-drawer-organizer)
 * Interlocking 2D modular organizer trays with compartmental order.
 */
export function DrawerOrganizerIllustration({ className = "" }: ProductIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`product-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="orgBg" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f2ece2" />
          <stop offset="60%" stopColor="#e7dfd1" />
          <stop offset="100%" stopColor="#d5c7b3" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect width="400" height="400" fill="url(#orgBg)" />

      {/* Background Architectural Niche */}
      <path
        d="M60 400 L60 160 C60 82 122 20 200 20 C278 20 340 82 340 160 L340 400 Z"
        fill="#ded4c3"
        opacity="0.45"
      />

      {/* Surface Base Line & Shadow */}
      <ellipse cx="200" cy="316" rx="150" ry="14" fill="rgba(37,37,34,0.14)" />
      <line x1="30" y1="312" x2="370" y2="312" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

      {/* Modular Interlocking Organizer Trays */}
      <g className="prod-anim-group">
        {/* Outer Master Tray Shell */}
        <rect
          x="65"
          y="100"
          width="270"
          height="204"
          rx="12"
          fill="#ebe4d8"
          stroke="#252522"
          strokeWidth="2"
        />
        {/* Inner Tray Floor */}
        <rect
          x="73"
          y="108"
          width="254"
          height="188"
          rx="8"
          fill="#ded4c4"
          stroke="#252522"
          strokeWidth="1.2"
        />

        {/* Compartment 1: Long Pen / Stylus Tray (Left) */}
        <g className="prod-tray-1">
          <rect
            x="81"
            y="116"
            width="68"
            height="172"
            rx="6"
            fill="#faf8f5"
            stroke="#252522"
            strokeWidth="1.5"
          />
          {/* Solid Brass Pen resting in tray */}
          <rect x="108" y="132" width="10" height="136" rx="3" fill="#b7a48a" stroke="#252522" strokeWidth="1.2" />
          <line x1="113" y1="136" x2="113" y2="260" stroke="#faf8f5" strokeWidth="1" strokeLinecap="round" />
          <polygon points="108,268 118,268 113,276" fill="#252522" />
          <rect x="106" y="142" width="14" height="4" rx="1" fill="#252522" />
        </g>

        {/* Compartment 2: Medium Top Storage (Right Top) */}
        <g className="prod-tray-2">
          <rect
            x="157"
            y="116"
            width="162"
            height="82"
            rx="6"
            fill="#faf8f5"
            stroke="#252522"
            strokeWidth="1.5"
          />
          {/* Neatly Coiled Cable in compartment */}
          <ellipse cx="238" cy="157" rx="48" ry="24" fill="none" stroke="#6d7d6d" strokeWidth="3" />
          <ellipse cx="238" cy="157" rx="36" ry="18" fill="none" stroke="#252522" strokeWidth="2.5" />
          <rect x="254" y="140" width="10" height="14" rx="2" fill="#b7a48a" stroke="#252522" strokeWidth="1" />
        </g>

        {/* Compartment 3: Bottom Left Small Square (Keys / EDC) */}
        <g className="prod-tray-3">
          <rect
            x="157"
            y="206"
            width="78"
            height="82"
            rx="6"
            fill="#faf8f5"
            stroke="#252522"
            strokeWidth="1.5"
          />
          {/* Brass Key and Split Ring */}
          <circle cx="196" cy="236" r="10" fill="none" stroke="#252522" strokeWidth="1.6" />
          <path d="M196 246 L196 272 L191 272 L191 267 L187 267 L187 262 L196 262" fill="#b7a48a" stroke="#252522" strokeWidth="1.2" />
        </g>

        {/* Compartment 4: Bottom Right Small Square (Small Tech / Earbuds) */}
        <g className="prod-tray-4">
          <rect
            x="241"
            y="206"
            width="78"
            height="82"
            rx="6"
            fill="#faf8f5"
            stroke="#252522"
            strokeWidth="1.5"
          />
          {/* Rounded Minimalist Wireless Earbud Case */}
          <rect
            x="256"
            y="222"
            width="48"
            height="46"
            rx="12"
            fill="#383632"
            stroke="#252522"
            strokeWidth="1.4"
          />
          <line x1="256" y1="242" x2="304" y2="242" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <circle cx="280" cy="254" r="1.5" fill="#b7a48a" />
        </g>

        {/* Front Wooden Drawer Face Cutaway Ledge */}
        <rect x="55" y="300" width="290" height="12" rx="3" fill="#c4b5a0" stroke="#252522" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

/**
 * 4. TRAVEL PACKING CUBES (travel-packing-cubes)
 * Stylized layered/nested travel packing cubes with breathable micro-mesh windows and zips.
 */
export function PackingCubesIllustration({ className = "" }: ProductIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`product-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cubeBg" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3ede5" />
          <stop offset="60%" stopColor="#e7ded0" />
          <stop offset="100%" stopColor="#d3c5b2" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect width="400" height="400" fill="url(#cubeBg)" />

      {/* Curved Horizon Arch */}
      <circle cx="200" cy="200" r="125" fill="#ded5c4" opacity="0.45" />

      {/* Itinerary Dashed Route Line in Background */}
      <g stroke="#8d806f" strokeWidth="1.6" strokeDasharray="5 5" opacity="0.5">
        <path d="M50 120 C110 60, 240 60, 340 100" fill="none" />
        <circle cx="50" cy="120" r="3" fill="#252522" />
        <circle cx="340" cy="100" r="3" fill="#252522" />
      </g>

      {/* Floor Line & Cast Shadow */}
      <ellipse cx="200" cy="316" rx="145" ry="14" fill="rgba(37,37,34,0.14)" />
      <line x1="30" y1="312" x2="370" y2="312" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

      {/* Nested / Stacked Packing Cubes */}
      <g className="prod-anim-group">
        {/* Cube 1: Large Base Cube (Deep Charcoal) */}
        <g className="prod-cube-large">
          {/* Main Body */}
          <rect
            x="85"
            y="170"
            width="230"
            height="136"
            rx="12"
            fill="#2f2e2b"
            stroke="#252522"
            strokeWidth="1.8"
          />
          {/* Webbing Carry Handle */}
          <path d="M165 170 C165 156 235 156 235 170" fill="none" stroke="#252522" strokeWidth="3" strokeLinecap="round" />

          {/* Breathable Mesh Window Panel */}
          <rect
            x="105"
            y="190"
            width="190"
            height="96"
            rx="8"
            fill="#3a3834"
            stroke="#252522"
            strokeWidth="1.4"
          />
          {/* Mesh Grid Lines */}
          <g stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3">
            <line x1="105" y1="214" x2="295" y2="214" />
            <line x1="105" y1="238" x2="295" y2="238" />
            <line x1="105" y1="262" x2="295" y2="262" />
            <line x1="152" y1="190" x2="152" y2="286" />
            <line x1="200" y1="190" x2="200" y2="286" />
            <line x1="248" y1="190" x2="248" y2="286" />
          </g>

          {/* Double Zip Line */}
          <rect x="95" y="178" width="210" height="2" fill="#b7a48a" />
          {/* Zip Pulls */}
          <circle cx="194" cy="179" r="3" fill="#faf8f5" stroke="#252522" strokeWidth="1" />
          <circle cx="206" cy="179" r="3" fill="#faf8f5" stroke="#252522" strokeWidth="1" />
        </g>

        {/* Cube 2: Medium Cube (Warm Limestone / Stone) Stacked at Angle */}
        <g className="prod-cube-medium" transform="rotate(-3 200 150)">
          <rect
            x="110"
            y="110"
            width="170"
            height="96"
            rx="10"
            fill="#ebe4d8"
            stroke="#252522"
            strokeWidth="1.8"
          />
          {/* Webbing handle */}
          <path d="M165 110 C165 98 225 98 225 110" fill="none" stroke="#252522" strokeWidth="2.5" strokeLinecap="round" />
          {/* Mesh Panel */}
          <rect
            x="126"
            y="126"
            width="138"
            height="64"
            rx="6"
            fill="#ded5c4"
            stroke="#252522"
            strokeWidth="1.2"
          />
          <line x1="126" y1="158" x2="264" y2="158" stroke="rgba(37,37,34,0.18)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="195" y1="126" x2="195" y2="190" stroke="rgba(37,37,34,0.18)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Horizontal Zip */}
          <line x1="118" y1="118" x2="272" y2="118" stroke="#8d806f" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="200" cy="118" r="2.5" fill="#252522" />
        </g>

        {/* Cube 3: Small Slim Compression Tube / Pouch (Muted Sage) */}
        <g className="prod-cube-small" transform="rotate(4 240 90)">
          <rect
            x="180"
            y="65"
            width="130"
            height="58"
            rx="8"
            fill="#6d7d6d"
            stroke="#252522"
            strokeWidth="1.6"
          />
          <line x1="188" y1="73" x2="302" y2="73" stroke="#b7a48a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="245" cy="73" r="2.5" fill="#faf8f5" stroke="#252522" strokeWidth="1" />
          {/* Label Tag */}
          <rect x="188" y="90" width="22" height="10" rx="2" fill="#faf8f5" stroke="#252522" strokeWidth="0.8" />
          <line x1="192" y1="95" x2="206" y2="95" stroke="#252522" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 5. EVERYDAY WATER BOTTLE (everyday-water-bottle)
 */
export function WaterBottleIllustration({ className = "" }: ProductIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`product-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="botBg" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3eee6" />
          <stop offset="60%" stopColor="#e7dfd2" />
          <stop offset="100%" stopColor="#d5c7b3" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#botBg)" />
      <circle cx="200" cy="200" r="125" fill="#ded5c4" opacity="0.45" />
      <ellipse cx="200" cy="324" rx="100" ry="12" fill="rgba(37,37,34,0.14)" />
      <line x1="50" y1="320" x2="350" y2="320" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

      <g className="prod-anim-group">
        {/* Thermal Bottle Silhouette */}
        <ellipse cx="200" cy="316" rx="42" ry="10" fill="rgba(37,37,34,0.18)" />
        <rect x="158" y="150" width="84" height="166" rx="20" fill="#6d7d6d" stroke="#252522" strokeWidth="2" />
        <path d="M168 150 C168 126 182 120 182 110 L218 110 C218 120 232 126 232 150 Z" fill="#5e6d5e" stroke="#252522" strokeWidth="2" />
        <rect x="180" y="86" width="40" height="24" rx="4" fill="#252522" />
        <path d="M190 86 C190 66 210 66 210 86" fill="none" stroke="#b7a48a" strokeWidth="3" strokeLinecap="round" />
        <line x1="174" y1="168" x2="174" y2="294" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="200" cy="230" r="16" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

/**
 * 6. DAILY CARRY POUCH (daily-carry-pouch)
 */
export function CarryPouchIllustration({ className = "" }: ProductIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`product-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pouchBg" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3ede5" />
          <stop offset="60%" stopColor="#e7dfd2" />
          <stop offset="100%" stopColor="#d5c8b5" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#pouchBg)" />
      <circle cx="200" cy="200" r="125" fill="#ded5c4" opacity="0.45" />
      <ellipse cx="200" cy="306" rx="120" ry="12" fill="rgba(37,37,34,0.14)" />
      <line x1="50" y1="302" x2="350" y2="302" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

      <g className="prod-anim-group">
        <rect x="100" y="140" width="200" height="154" rx="16" fill="#2f2e2b" stroke="#252522" strokeWidth="2" />
        <line x1="110" y1="160" x2="290" y2="160" stroke="#b7a48a" strokeWidth="2" strokeLinecap="round" />
        <rect x="250" y="156" width="16" height="8" rx="2" fill="#faf8f5" stroke="#252522" strokeWidth="1" />
        <path d="M266 160 L286 160 L288 172" stroke="#8d806f" strokeWidth="2" strokeLinecap="round" />
        <rect x="175" y="210" width="50" height="20" rx="3" fill="#3c3b37" stroke="#252522" strokeWidth="1" />
        <line x1="185" y1="220" x2="215" y2="220" stroke="#b7a48a" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 7. AMBIENT DESK LIGHT (ambient-desk-light)
 */
export function DeskLightIllustration({ className = "" }: ProductIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`product-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lightBg" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3eee5" />
          <stop offset="60%" stopColor="#e8dfd2" />
          <stop offset="100%" stopColor="#d5c8b5" />
        </linearGradient>
        <radialGradient id="lampGlowHalo" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="rgba(255, 238, 185, 0.7)" />
          <stop offset="60%" stopColor="rgba(255, 245, 220, 0.2)" />
          <stop offset="100%" stopColor="rgba(255, 245, 220, 0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#lightBg)" />
      <circle cx="200" cy="180" r="120" fill="url(#lampGlowHalo)" />
      <ellipse cx="200" cy="316" rx="110" ry="12" fill="rgba(37,37,34,0.14)" />
      <line x1="50" y1="312" x2="350" y2="312" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

      <g className="prod-anim-group">
        <rect x="160" y="304" width="80" height="10" rx="3" fill="#252522" />
        <path d="M200 304 C200 230 180 180 190 140" fill="none" stroke="#252522" strokeWidth="3" strokeLinecap="round" />
        <path d="M150 144 C150 110 250 110 250 144 C236 150 164 150 150 144 Z" fill="#b7a48a" stroke="#252522" strokeWidth="2" />
        <circle cx="200" cy="148" r="5" fill="#fff5d2" />
      </g>
    </svg>
  );
}

/**
 * 8. EVERYDAY CATCHALL TRAY (everyday-catchall-tray)
 */
export function CatchallTrayIllustration({ className = "" }: ProductIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`product-vector-svg ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="trayBg" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3ede3" />
          <stop offset="60%" stopColor="#e7dfd1" />
          <stop offset="100%" stopColor="#d5c7b3" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#trayBg)" />
      <circle cx="200" cy="200" r="125" fill="#ded5c4" opacity="0.45" />
      <ellipse cx="200" cy="296" rx="140" ry="16" fill="rgba(37,37,34,0.14)" />
      <line x1="40" y1="290" x2="360" y2="290" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />

      <g className="prod-anim-group">
        <ellipse cx="200" cy="260" rx="120" ry="34" fill="#ebe4d8" stroke="#252522" strokeWidth="2" />
        <ellipse cx="200" cy="256" rx="110" ry="28" fill="#ded5c6" />
        {/* Brass Key in tray */}
        <circle cx="180" cy="254" r="10" fill="none" stroke="#252522" strokeWidth="1.6" />
        <path d="M190 254 L230 254 L230 260 L224 260 L224 264 L218 264 L218 254" fill="#b7a48a" stroke="#252522" strokeWidth="1.2" />
        {/* Earbuds */}
        <ellipse cx="140" cy="254" rx="14" ry="8" fill="#252522" />
      </g>
    </svg>
  );
}

/**
 * Registry of illustrations keyed by product handle
 */
export const ProductIllustrationsMap: Record<string, React.FC<ProductIllustrationProps>> = {
  "silicone-cable-organizer": CableOrganizerIllustration,
  "minimal-device-stand": DeviceStandIllustration,
  "modular-drawer-organizer": DrawerOrganizerIllustration,
  "travel-packing-cubes": PackingCubesIllustration,
  "everyday-water-bottle": WaterBottleIllustration,
  "daily-carry-pouch": CarryPouchIllustration,
  "ambient-desk-light": DeskLightIllustration,
  "everyday-catchall-tray": CatchallTrayIllustration,
};

/**
 * Universal component that safely renders the product's 2D illustration
 * with an optional fallback.
 */
export function ProductIllustration({
  handle,
  fallback,
  className = "",
}: {
  handle: string;
  fallback?: React.ReactNode;
  className?: string;
}) {
  const Comp = ProductIllustrationsMap[handle];
  if (Comp) {
    return <Comp className={className} />;
  }
  return fallback ? <>{fallback}</> : null;
}

