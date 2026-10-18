import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";

export const metadata: Metadata = {
  title: { default: "Third Shelf — Better things. Better everyday.", template: "%s | Third Shelf" },
  description: "Thoughtfully selected technology, home and everyday essentials. Discover useful things, chosen with intention.",
  metadataBase: new URL("https://thirdshelf.example")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><SiteHeader />{children}<SiteFooter /></CartProvider></body></html>;
}
