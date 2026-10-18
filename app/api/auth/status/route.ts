import { NextResponse } from "next/server";
import { shopifyConfigured } from "@/lib/shopify/client";

export async function GET() {
  return NextResponse.json({
    shopifyConfigured,
    message: shopifyConfigured
      ? "Shopify Storefront API is configured for customer authentication."
      : "Storefront is running in Preview Mode. Configure SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local for live customer authentication."
  });
}
