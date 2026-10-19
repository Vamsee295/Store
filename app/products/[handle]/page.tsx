import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, shopifyConfigured } from "@/lib/shopify/client";
import { ProductDetailView } from "@/components/product-detail-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) {
    return {
      title: "Product Not Found — Third Shelf",
    };
  }

  return {
    title: `${p.title} — Third Shelf`,
    description: p.description?.slice(0, 160) || "Thoughtfully selected everyday essential.",
    openGraph: {
      title: `${p.title} — Third Shelf`,
      description: p.description,
      images: p.image ? [{ url: p.image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} — Third Shelf`,
      description: p.description,
      images: p.image ? [p.image] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => {
      if (p.id === product.id) return false;
      const sameCategory = p.categoryHandle === product.categoryHandle;
      const sharedCollection = p.collections?.some((col) =>
        product.collections?.some((pCol) => pCol.id === col.id || pCol.handle === col.handle)
      );
      return sameCategory || sharedCollection;
    })
    .slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Third Shelf",
      },
    },
  };

  return (
    <main className="container pdp-page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailView
        product={product}
        relatedProducts={related}
        demoMode={!shopifyConfigured}
      />
    </main>
  );
}
