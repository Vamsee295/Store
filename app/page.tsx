import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { ProductCard } from "@/components/product-card";
import { CategoryCards } from "@/components/category-cards";
import { WhyThirdShelf } from "@/components/why-third-shelf";
import { DifferentiatorsSection } from "@/components/differentiators-section";
import { SelectionPhilosophy } from "@/components/selection-philosophy";
import { EditorialDiscovery } from "@/components/editorial-discovery";
import { SocialProofSection } from "@/components/social-proof-section";
import { ShoppingConfidence } from "@/components/shopping-confidence";
import { NewsletterSection } from "@/components/newsletter-section";
import { categories } from "@/lib/products";
import { getProducts, shopifyConfigured } from "@/lib/shopify/client";

export default async function HomePage() {
  const allProducts = await getProducts();
  const products = allProducts.slice(0, 4);

  const heroProducts = {
    tech:
      allProducts.find((p) => p.categoryHandle === "technology") ||
      allProducts.find((p) => p.categoryHandle === "cable-management") ||
      allProducts.find((p) => p.collections?.some((c) => c.handle === "desk-workspace-essentials")),
    travel: allProducts.find((p) => p.categoryHandle === "travel"),
    home: allProducts.find((p) => p.categoryHandle === "home" || p.categoryHandle === "home-essentials"),
    everyday: allProducts.find((p) => p.categoryHandle === "everyday" || p.categoryHandle === "everyday-finds"),
  };

  const categoriesWithCounts = categories.map((c) => {
    const isTech = c.handle === "technology";
    const isHome = c.handle === "home-essentials";
    const isTravel = c.handle === "travel";
    const isEveryday = c.handle === "everyday-finds";

    const itemCount = allProducts.filter((p) => {
      if (isTech) {
        return (
          p.categoryHandle === "technology" ||
          p.categoryHandle === "cable-management" ||
          p.collections?.some((col) => col.handle === "desk-workspace-essentials")
        );
      }
      if (isHome) {
        return p.categoryHandle === "home" || p.categoryHandle === "home-essentials";
      }
      if (isTravel) {
        return p.categoryHandle === "travel";
      }
      if (isEveryday) {
        return p.categoryHandle === "everyday" || p.categoryHandle === "everyday-finds";
      }
      return p.categoryHandle === c.handle;
    }).length;

    return {
      title: c.title,
      handle: c.handle,
      subtitle: c.subtitle,
      itemCount,
      available: itemCount > 0,
    };
  });

  return (
    <main>
      {!shopifyConfigured && (
        <div
          style={{
            background: "#f1e8da",
            padding: "9px 16px",
            textAlign: "center",
            fontSize: 10,
            color: "#5d4b35",
            letterSpacing: ".04em",
          }}
        >
          PREVIEW MODE — Connect your Shopify Storefront API to replace sample products with your live catalog.
        </div>
      )}

      {/* 1. Editorial Hero */}
      <HomeHero featuredProducts={heroProducts} />

      {/* 2. Category Discovery */}
      <section className="section container">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 13 }}>
              Find your kind of better
            </div>
            <h2 className="section-title">Explore the edit.</h2>
          </div>
          <Link
            href="/collections/all"
            style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 7 }}
          >
            Shop everything <ArrowRight size={15} />
          </Link>
        </div>
        <CategoryCards categories={categoriesWithCounts} />
      </section>

      {/* 3. Featured Products Grid */}
      <section className="section" style={{ background: "#eeebe4" }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 13 }}>
                The considered edit
              </div>
              <h2 className="section-title">Useful things, chosen well.</h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  maxWidth: 420,
                  margin: 0,
                }}
              >
                A rotating selection of everyday essentials with a clear purpose and a place in your life.
              </p>
            </div>
            <Link href="/collections/all" className="btn btn-light">
              View all products <ArrowRight size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Third Shelf */}
      <WhyThirdShelf />

      {/* 5. What Makes Us Different */}
      <DifferentiatorsSection />

      {/* 6. Product Quality & Selection Philosophy */}
      <SelectionPhilosophy />

      {/* 7. Editorial Product Discovery */}
      <EditorialDiscovery />

      {/* 8. Customer Feedback / Honest Social Proof */}
      <SocialProofSection />

      {/* 9. Shopping Confidence & Support Strip */}
      <ShoppingConfidence />

      {/* 10. Refined Newsletter */}
      <NewsletterSection />
    </main>
  );
}
