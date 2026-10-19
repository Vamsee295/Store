import type { Metadata } from "next";
import { getProducts, shopifyConfigured } from "@/lib/shopify/client";
import { categories } from "@/lib/products";
import { ProductCatalogView } from "@/components/product-catalog-view";

export const metadata: Metadata = {
  title: "Shop All — The Complete Collection | Third Shelf",
  description:
    "Explore our full considered collection of everyday essentials across technology, home, travel, and lifestyle.",
};

export default async function ProductsIndexPage() {
  const allProducts = await getProducts();

  return (
    <main className="container catalog-page-container">
      <ProductCatalogView
        initialProducts={allProducts}
        categories={categories}
        initialCategoryHandle="all"
        isShopAll={true}
        pageTitle="The complete collection."
        pageDescription="Thoughtfully selected finds across technology, home, travel, and everyday living. Built to earn their place."
        shopifyConfigured={shopifyConfigured}
      />
    </main>
  );
}
