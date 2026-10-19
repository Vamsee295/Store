import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account/", "/forgot-password"],
    },
    sitemap: "https://thirdshelf.store/sitemap.xml",
  };
}
