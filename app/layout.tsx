import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { DevPreviewBar } from "@/components/dev-preview-bar";

export const viewport: Viewport = {
  themeColor: "#252522",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Third Shelf — Better things. Better everyday.",
    template: "%s | Third Shelf",
  },
  description:
    "Thoughtfully selected technology, home and everyday essentials. Discover useful things, chosen with intention.",
  metadataBase: new URL("https://thirdshelf.store"),
  openGraph: {
    title: "Third Shelf — Better things. Better everyday.",
    description:
      "A considered edit of multi-category everyday essentials across technology, home, travel, and lifestyle.",
    url: "https://thirdshelf.store",
    siteName: "Third Shelf",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Third Shelf — Better things. Better everyday.",
    description:
      "Thoughtfully selected technology, home, and everyday essentials.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Third Shelf",
    url: "https://thirdshelf.store",
    logo: "https://thirdshelf.store/logo.svg",
    description:
      "Curated multi-category ecommerce storefront offering considered goods across technology, home, and travel.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "care@thirdshelf.store",
      contactType: "customer service",
      availableLanguage: "en",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Third Shelf",
    url: "https://thirdshelf.store",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://thirdshelf.store/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <DevPreviewBar />
            <SiteHeader />
            {children}
            <SiteFooter />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
