import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCollectionWithProducts,
  getCandidateCollectionHandles,
  shopifyConfigured,
} from "@/lib/shopify/client";
import { categories } from "@/lib/products";
import { ProductCatalogView } from "@/components/product-catalog-view";
import { CategoryHeroBanner } from "@/components/category-hero-banner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const isAll = handle === "all";
  if (isAll) {
    return {
      title: "Shop All — The Complete Collection | Third Shelf",
      description:
        "Explore our full considered collection of everyday essentials across technology, home, travel, and lifestyle.",
    };
  }

  const { collection } = await getCollectionWithProducts(handle);
  const candidateHandles = getCandidateCollectionHandles(handle);
  const staticCategory = categories.find((x) => candidateHandles.includes(x.handle));
  const title = collection?.title || staticCategory?.title || handle.replace(/-/g, " ");
  const description =
    collection?.description ||
    staticCategory?.subtitle ||
    "Thoughtfully selected for everyday life.";

  return {
    title: `${title} — Third Shelf`,
    description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const isAll = handle === "all";

  const { collection, products: collectionProducts } = await getCollectionWithProducts(handle);
  const candidateHandles = getCandidateCollectionHandles(handle);
  const staticCategory = categories.find((c) => candidateHandles.includes(c.handle));

  if (!isAll && !collection && !staticCategory && shopifyConfigured) {
    notFound();
  }

  const title = isAll
    ? "The complete collection."
    : collection?.title || staticCategory?.title || handle.replace(/-/g, " ");
  const desc = isAll
    ? "Thoughtfully selected finds across technology, home, travel, and everyday living. Built to earn their place."
    : collection?.description || staticCategory?.subtitle || "Thoughtfully selected for everyday life.";

  return (
    <main className="container catalog-page-container">
      {!isAll && (
        <CategoryHeroBanner
          handle={handle}
          title={title}
          subtitle={desc}
          itemCount={collectionProducts.length}
        />
      )}
      <ProductCatalogView
        initialProducts={collectionProducts}
        categories={categories}
        initialCategoryHandle={isAll ? "all" : handle}
        isShopAll={isAll}
        pageTitle={title}
        pageDescription={desc}
        shopifyConfigured={shopifyConfigured}
        hideHeader={!isAll}
      />
    </main>
  );
}


