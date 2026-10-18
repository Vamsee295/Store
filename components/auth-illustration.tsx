"use client";

import React from "react";

interface AuthIllustrationProps {
  variant?: "login" | "signup" | "forgot-password";
  className?: string;
}

export function AuthIllustration({ variant = "login", className = "" }: AuthIllustrationProps) {
  const meta = {
    login: {
      badge: "CUSTOMER SANCTUARY",
      quote: "Pick up where you left off. Your considered edit and saved discoveries, in one calm place.",
      caption: "THIRD SHELF · MEMBER ARCHIVE"
    },
    signup: {
      badge: "JOIN THE CURATION",
      quote: "Make room for better. Thoughtfully selected finds across technology, home, and travel.",
      caption: "THIRD SHELF · A CONSIDERED EDIT"
    },
    "forgot-password": {
      badge: "ACCOUNT ACCESS",
      quote: "A quiet, dependable place. We'll help you regain access to your account with ease.",
      caption: "THIRD SHELF · RECOVERY PORTAL"
    }
  }[variant];

  return (
    <div className={`auth-illustration-container ${className}`}>
      {/* Background editorial panel */}
      <div className="auth-illustration-editorial">
        <div className="auth-eyebrow-chip">{meta.badge}</div>
        <p className="auth-editorial-quote">&ldquo;{meta.quote}&rdquo;</p>
      </div>

      {/* 2D Vector Illustration Artwork */}
      <div className="auth-svg-wrapper">
        <svg
          viewBox="0 0 460 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="auth-vector-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Architectural stone background gradient */}
            <linearGradient id="authWallBg" x1="230" y1="0" x2="230" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f3ede3" />
              <stop offset="60%" stopColor="#e8dfd2" />
              <stop offset="100%" stopColor="#dad0c0" />
            </linearGradient>

            {/* Warm lamp glow cone */}
            <linearGradient id="authLampGlow" x1="165" y1="90" x2="165" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255, 238, 190, 0.55)" />
              <stop offset="50%" stopColor="rgba(255, 243, 215, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 248, 230, 0)" />
            </linearGradient>

            {/* Niche inner gradient */}
            <linearGradient id="authNiche" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dfd5c4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#cfc4b0" stopOpacity="0.5" />
            </linearGradient>

            {/* Journal paper gradient */}
            <linearGradient id="authPaper" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fcfbf9" />
              <stop offset="100%" stopColor="#f2ede4" />
            </linearGradient>
          </defs>

          {/* 1. Backdrop */}
          <rect width="460" height="480" rx="16" fill="url(#authWallBg)" />

          {/* 2. Architectural Wall Niche Arch */}
          <path
            d="M80 480 L80 180 C80 95 147 28 230 28 C313 28 380 95 380 180 L380 480 Z"
            fill="url(#authNiche)"
          />

          {/* 3. Subtle Technical Grid Lines */}
          <g stroke="#918472" strokeWidth="1" strokeDasharray="3 4" opacity="0.32">
            <line x1="50" y1="120" x2="410" y2="120" />
            <line x1="50" y1="340" x2="410" y2="340" />
            <line x1="230" y1="40" x2="230" y2="440" />
            <circle cx="230" cy="180" r="95" fill="none" strokeWidth="0.8" />
          </g>

          {/* 4. Leaning Architectural Print Frame */}
          <g className="auth-leaning-art">
            <rect
              x="268"
              y="126"
              width="96"
              height="136"
              rx="3"
              fill="#252522"
              opacity="0.14"
              transform="rotate(3 268 126)"
            />
            <rect
              x="264"
              y="122"
              width="96"
              height="136"
              rx="3"
              fill="#f8f5ee"
              stroke="#252522"
              strokeWidth="1.6"
              transform="rotate(3 264 122)"
            />
            {/* Minimalist Bauhaus Geometry */}
            <circle cx="312" cy="172" r="22" fill="#ded5c6" transform="rotate(3 264 122)" />
            <rect x="296" y="196" width="34" height="2" fill="#b7a48a" transform="rotate(3 264 122)" />
            <path
              d="M280 232 C280 205 304 195 328 195 L348 232 Z"
              fill="#c4b6a4"
              opacity="0.75"
              transform="rotate(3 264 122)"
            />
          </g>

          {/* 5. Minimal Solid Wood Console Shelf */}
          <g className="auth-shelf">
            {/* Deep shelf shadow */}
            <ellipse cx="230" cy="354" rx="190" ry="14" fill="rgba(37,37,34,0.16)" />
            {/* Shelf Plank */}
            <rect x="40" y="340" width="380" height="14" rx="3" fill="#c3b4a0" stroke="#252522" strokeWidth="1.7" />
            <line x1="42" y1="341.5" x2="418" y2="341.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
          </g>

          {/* 6. Ambient Lamp Glow Cone */}
          <polygon
            points="164,88 64,340 264,340"
            fill="url(#authLampGlow)"
            className="auth-lamp-glow"
            opacity="0.65"
          />

          {/* 7. Turned Stem Desk Lamp */}
          <g className="auth-lamp">
            {/* Heavy Base */}
            <rect x="146" y="334" width="36" height="7" rx="2" fill="#252522" />
            {/* Curved Stem */}
            <path
              d="M164 334 C164 235 152 145 164 88"
              fill="none"
              stroke="#252522"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Lamp Shade Dome */}
            <path
              d="M142 88 C142 68 186 68 186 88 C176 93 152 93 142 88 Z"
              fill="#b7a48a"
              stroke="#252522"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Warm Filament Glow Bulb */}
            <circle cx="164" cy="90" r="3.5" fill="#fff5d2" />
            <circle cx="164" cy="90" r="10" fill="none" stroke="rgba(255,245,210,0.5)" strokeWidth="1" />
          </g>

          {/* 8. Ceramic Plant Vessel */}
          <g className="auth-plant">
            <ellipse cx="104" cy="340" rx="18" ry="5" fill="rgba(37,37,34,0.2)" />
            <path
              d="M90 288 L118 288 L114 340 L94 340 Z"
              fill="#e4dbcc"
              stroke="#252522"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Stems */}
            <path d="M104 288 C104 250 94 220 84 196" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M104 288 C112 254 126 232 138 212" stroke="#252522" strokeWidth="1.6" strokeLinecap="round" />
            {/* Olive/Sage Botanical Leaves */}
            <path
              d="M84 196 C70 204 64 220 74 228 C84 234 94 216 84 196 Z"
              fill="#7d8c7c"
              stroke="#252522"
              strokeWidth="1.4"
            />
            <path
              d="M138 212 C152 220 158 238 148 246 C138 252 130 236 138 212 Z"
              fill="#8d9b8c"
              stroke="#252522"
              strokeWidth="1.4"
            />
          </g>

          {/* 9. Open Leather Journal & Brass Fountain Pen (Symbolizing personal notes, wishlist, membership) */}
          <g className="auth-journal">
            {/* Shadow under notebook */}
            <rect x="188" y="336" width="124" height="6" rx="2" fill="rgba(37,37,34,0.22)" />

            {/* Left Page */}
            <path
              d="M192 284 C210 286 244 286 248 288 L248 338 C244 336 210 336 192 334 Z"
              fill="url(#authPaper)"
              stroke="#252522"
              strokeWidth="1.6"
            />
            {/* Right Page */}
            <path
              d="M248 288 C252 286 286 286 304 284 L304 334 C286 336 252 336 248 338 Z"
              fill="url(#authPaper)"
              stroke="#252522"
              strokeWidth="1.6"
            />
            {/* Spine Line */}
            <line x1="248" y1="288" x2="248" y2="338" stroke="#252522" strokeWidth="2" strokeLinecap="round" />
            {/* Ribbon Bookmark */}
            <path
              d="M248 338 C248 350 256 354 254 362 L250 358 L246 362 L246 338"
              fill="#8d806f"
            />
            {/* Subtle Text Lines on Left Page */}
            <line x1="202" y1="298" x2="238" y2="298" stroke="#77746d" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <line x1="202" y1="307" x2="236" y2="307" stroke="#77746d" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <line x1="202" y1="316" x2="230" y2="316" stroke="#77746d" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <line x1="202" y1="325" x2="224" y2="325" stroke="#77746d" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

            {/* Subtle Text Lines on Right Page */}
            <line x1="258" y1="298" x2="294" y2="298" stroke="#77746d" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <line x1="258" y1="307" x2="290" y2="307" stroke="#77746d" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <line x1="258" y1="316" x2="284" y2="316" stroke="#77746d" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

            {/* Brass Fountain Pen resting on right page */}
            <g className="auth-pen">
              <path
                d="M292 278 L296 280 L274 330 L270 328 Z"
                fill="#b7a48a"
                stroke="#252522"
                strokeWidth="1.2"
              />
              <path d="M270 328 L267 334 L274 330 Z" fill="#252522" />
              <rect x="290" y="278" width="6" height="3" fill="#252522" transform="rotate(-24 290 278)" />
            </g>
          </g>

          {/* 10. Everyday Catchall Dish with Heirloom Brass Key (Sanctuary / Access / Security) */}
          <g className="auth-dish">
            <ellipse cx="352" cy="336" rx="36" ry="11" fill="rgba(37,37,34,0.18)" />
            <ellipse cx="352" cy="332" rx="34" ry="10" fill="#ded5c4" stroke="#252522" strokeWidth="1.6" />
            <ellipse cx="352" cy="330" rx="29" ry="8" fill="#ebe4d8" />

            {/* Heirloom Brass Key */}
            <g className="auth-key">
              {/* Bow / Head */}
              <circle cx="342" cy="329" r="6" fill="#b7a48a" stroke="#252522" strokeWidth="1.3" />
              <circle cx="342" cy="329" r="2.5" fill="#ebe4d8" stroke="#252522" strokeWidth="1" />
              {/* Shank / Stem */}
              <rect x="348" y="327.5" width="20" height="3" fill="#b7a48a" stroke="#252522" strokeWidth="1.2" />
              {/* Bit / Teeth */}
              <path d="M362 330.5 L362 334.5 L365 334.5 L365 330.5" fill="#b7a48a" stroke="#252522" strokeWidth="1.2" />
              <path d="M366 330.5 L366 333.5 L368 333.5 L368 330.5" fill="#b7a48a" stroke="#252522" strokeWidth="1.2" />
            </g>
          </g>

          {/* 11. Editorial Bottom Tagline */}
          <g opacity="0.6">
            <text
              x="50"
              y="445"
              fontFamily="var(--sans)"
              fontSize="8.5"
              fontWeight="600"
              letterSpacing="0.14em"
              fill="#7a6e5e"
            >
              {meta.caption}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
