import { MetadataRoute } from "next";
import { getProducts, getCollections } from "@/lib/shopify/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thirdshelf.store";
  const now = new Date();

  // 1. Static Core Pages
  const staticRoutes = [
    "",
    "/collections/all",
    "/pages/about",
    "/pages/contact",
    "/pages/shipping",
    "/pages/returns",
    "/pages/privacy",
    "/pages/terms",
    "/pages/faq",
    "/pages/track-order",
    "/cart",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : route.startsWith("/collections") ? 0.8 : 0.6,
  }));

  // 2. Dynamic Collections
  const collections = await getCollections();
  const collectionRoutes = collections.map((col) => ({
    url: `${baseUrl}/collections/${col.handle}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Dynamic Products
  const products = await getProducts();
  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.handle}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
