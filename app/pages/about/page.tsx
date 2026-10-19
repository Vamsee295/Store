"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Sparkles, Feather, Layers } from "lucide-react";
import { CategoryIllustration } from "@/components/category-illustrations";

export default function AboutPage() {
  const pillars = [
    {
      num: "01",
      title: "Purpose-led Utility",
      desc: "Every product must solve a genuine problem in daily life. If an object only creates clutter, it has no place on our shelf.",
      icon: Compass,
    },
    {
      num: "02",
      title: "Material Integrity",
      desc: "We favor aerospace aluminum, dense canvas, weighted silicone, and stone composites that age gracefully under daily use.",
      icon: Layers,
    },
    {
      num: "03",
      title: "Visual Restraint",
      desc: "Thoughtful geometry and warm, neutral palettes that blend harmoniously into your home, desk, and travel bag.",
      icon: Feather,
    },
    {
      num: "04",
      title: "Quiet Confidence",
      desc: "No loud logos, fake countdown timers, or manufactured urgency. Just dependable design at transparent prices.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="about-page">
      {/* Editorial Hero */}
      <section className="about-hero container">
        <div className="about-hero-inner">
          <span className="eyebrow">Our Philosophy · Third Shelf</span>
          <h1 className="about-hero-title">
            Better things.<br />Better everyday.
          </h1>
          <p className="about-hero-lead">
            The modern marketplace is overflowing with noise. We founded Third Shelf on a simple premise: everyday tools should be chosen with the same discernment as the architecture they inhabit.
          </p>
        </div>
      </section>

      {/* Manifesto Statement Banner */}
      <section className="about-statement-band">
        <div className="container about-statement-container">
          <div className="about-statement-quote">
            &ldquo;We don&apos;t believe in endless novelty. We believe in finding the one object that quietly does its job so well, you never need to think about replacing it.&rdquo;
          </div>
          <div className="about-statement-author">
            — The Third Shelf Curation Team
          </div>
        </div>
      </section>

      {/* The 4 Pillars */}
      <section className="about-pillars container">
        <div className="about-pillars-header">
          <span className="eyebrow">The Standard</span>
          <h2 className="about-section-heading">The Curation Creed</h2>
          <p className="about-section-sub">
            Before any item is stocked, it undergoes rigorous inspection across four core benchmarks.
          </p>
        </div>

        <div className="about-pillars-grid">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.num} className="about-pillar-card">
                <div className="about-pillar-top">
                  <span className="about-pillar-num">{p.num}</span>
                  <Icon size={20} strokeWidth={1.5} className="about-pillar-icon" />
                </div>
                <h3 className="about-pillar-title">{p.title}</h3>
                <p className="about-pillar-desc">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category Edit Gallery */}
      <section className="about-categories container">
        <div className="about-categories-header">
          <span className="eyebrow">Our Focus</span>
          <h2 className="about-section-heading">Four Pillars of Daily Life</h2>
          <p className="about-section-sub">
            From your workspace to your transit bag, our collections are organized around human rituals.
          </p>
        </div>

        <div className="about-categories-grid">
          {[
            {
              title: "Technology",
              category: "Technology",
              desc: "Tactile charging stations, magnetic cable organizers, and workspace tools built for focus.",
              href: "/collections/technology",
            },
            {
              title: "Home Essentials",
              category: "Home",
              desc: "Stone catchalls, sculptural lighting, and tabletop vessels that anchor living spaces.",
              href: "/collections/home-essentials",
            },
            {
              title: "Travel",
              category: "Travel",
              desc: "Featherlight packing organizers, durable toiletry kits, and transit essentials.",
              href: "/collections/travel",
            },
            {
              title: "Everyday Finds",
              category: "Everyday",
              desc: "Considered carry accessories, minimalist notebooks, and thermal vessels for transit.",
              href: "/collections/everyday-finds",
            },
          ].map((cat) => (
            <div key={cat.title} className="about-cat-card">
              <div className="about-cat-art">
                <CategoryIllustration category={cat.category} />
              </div>
              <div className="about-cat-body">
                <h3 className="about-cat-title">{cat.title}</h3>
                <p className="about-cat-desc">{cat.desc}</p>
                <Link href={cat.href} className="about-cat-link">
                  <span>Explore {cat.title}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="about-cta-section container">
        <div className="about-cta-card">
          <span className="eyebrow">Discover</span>
          <h2 className="about-cta-heading">Ready to refine your everyday?</h2>
          <p className="about-cta-desc">
            Explore our curated catalog of considered essentials, backed by transparent policies and 30-day quiet returns.
          </p>
          <Link href="/collections/all" className="btn btn-primary about-cta-btn">
            <span>Explore the complete edit</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
