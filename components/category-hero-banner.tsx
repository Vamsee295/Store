"use client";

import React from "react";
import {
  TechnologyIllustration,
  HomeIllustration,
  TravelIllustration,
  EverydayIllustration
} from "@/components/category-illustrations";
import { Sparkles, Compass } from "lucide-react";

interface CategoryHeroBannerProps {
  handle: string;
  title: string;
  subtitle: string;
  itemCount: number;
}

const categoryNarratives: Record<
  string,
  {
    tagline: string;
    quote: string;
    curatorNote: string;
    focusAreas: string[];
  }
> = {
  technology: {
    tagline: "WORKSPACE & FOCUS",
    quote: "“A calm desk is a calm mind. We focus on cables that stay put, stands that elevate, and light that softens the evening.”",
    curatorNote: "Every device accessory in this collection is tested for weighted stability, tactile feel, and clutter reduction.",
    focusAreas: ["Cable Management", "Device Elevation", "Ambient Light", "Desk Organization"]
  },
  home: {
    tagline: "SANCTUARY & ORDER",
    quote: "“Objects that make room for living. Quiet storage, stoneware catchalls, and tactile organizers that bring order without cold minimalism.”",
    curatorNote: "Materials include molded acoustic felt, composite stoneware, and unglazed ceramic.",
    focusAreas: ["Drawer Storage", "Entryway Catchalls", "Desk Trays", "Everyday Organizers"]
  },
  travel: {
    tagline: "TRANSIT & EXPLORATION",
    quote: "“Considered carry for journeys near and far. Packing systems that compress, and pouches that keep essentials in reach.”",
    curatorNote: "Built with post-consumer recycled ripstop, beeswaxed cotton canvas, and durable YKK hardware.",
    focusAreas: ["Packing Cubes", "Carry Pouches", "Cable Organizers", "Commuter Essentials"]
  },
  everyday: {
    tagline: "LIFESTYLE FINDS",
    quote: "“Small things, considered well. The objects you reach for morning, noon, and evening—crafted to earn their place.”",
    curatorNote: "Double-walled vacuum drinkware, pocket notebooks, and durable daily companions.",
    focusAreas: ["Hydration", "Pocket Carry", "Stationery", "Personal Organizers"]
  }
};

export function CategoryHeroBanner({
  handle,
  title,
  subtitle,
  itemCount
}: CategoryHeroBannerProps) {
  const meta = categoryNarratives[handle] || {
    tagline: "CONSIDERED EDIT",
    quote: "“Thoughtfully selected finds, crafted to earn their place in your everyday spaces.”",
    curatorNote: "Curated with attention to materials, durability, and daily usefulness.",
    focusAreas: ["Design", "Utility", "Materials"]
  };

  const renderArtwork = () => {
    switch (handle) {
      case "technology":
        return <TechnologyIllustration />;
      case "home":
        return <HomeIllustration />;
      case "travel":
        return <TravelIllustration />;
      case "everyday":
      default:
        return <EverydayIllustration />;
    }
  };

  return (
    <div className="cat-hero-banner">
      <div className="cat-hero-grid">
        {/* Left Column: Text & Editorial Quote */}
        <div className="cat-hero-text">
          <div className="cat-hero-tagline-row">
            <span className="eyebrow cat-tagline">{meta.tagline}</span>
            <span className="cat-count-badge">{itemCount} items curated</span>
          </div>

          <h1 className="display cat-hero-title">{title}</h1>
          <p className="cat-hero-subtitle">{subtitle}</p>

          <blockquote className="cat-hero-quote">
            <p>{meta.quote}</p>
          </blockquote>

          <div className="cat-curator-note">
            <Compass size={14} className="cat-curator-icon" />
            <span>{meta.curatorNote}</span>
          </div>

          {/* Focus Areas Pills */}
          <div className="cat-focus-pills">
            {meta.focusAreas.map((area) => (
              <span key={area} className="cat-focus-pill">
                <Sparkles size={11} />
                <span>{area}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Framed 2D Category Artwork */}
        <div className="cat-hero-artwork-frame">
          <div className="cat-artwork-viewport">
            {renderArtwork()}
            <div className="cat-artwork-overlay-caption">
              <span>Third Shelf · {title} Series</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
