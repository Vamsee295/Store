import { NextResponse } from "next/server";
import { shopifyConfigured, shopifyFetch, getCollections } from "@/lib/shopify/client";
import { getSanitizedDiagnosticsSummary } from "@/lib/env";

export async function GET() {
  const summary = getSanitizedDiagnosticsSummary();
  const isProd = summary.environment === "production";

  if (!shopifyConfigured) {
    return NextResponse.json({
      configured: false,
      status: "PREVIEW_MODE",
      message: summary.isPlaceholderToken
        ? "Storefront access token is set to placeholder value in .env.local. Add your valid Shopify public token to activate live catalog synchronization."
        : "Storefront API credentials are not yet configured. The storefront is running in editorial preview mode with local verified fixtures.",
      apiVersion: summary.apiVersion,
      ...(isProd
        ? {}
        : {
            details: {
              domainConfigured: Boolean(summary.domain),
              tokenConfigured: summary.hasStorefrontToken,
              isPlaceholderToken: summary.isPlaceholderToken,
            },
          }),
    });
  }

  const startTime = Date.now();
  try {
    const testResult = await shopifyFetch<{
      shop: {
        name: string;
        paymentSettings: { currencyCode: string };
      };
      products: { nodes: { id: string }[] };
    }>(
      `query ShopStatus {
        shop {
          name
          paymentSettings { currencyCode }
        }
        products(first: 5) {
          nodes { id }
        }
      }`
    );

    const latencyMs = Date.now() - startTime;

    if (!testResult?.shop) {
      return NextResponse.json(
        {
          configured: true,
          connected: false,
          status: "CREDENTIALS_INVALID",
          message: "Shopify Storefront API rejected the credentials. Verify token permissions in Shopify Admin.",
          latencyMs: isProd ? undefined : latencyMs,
        },
        { status: 401 }
      );
    }

    const collections = await getCollections();

    return NextResponse.json({
      configured: true,
      connected: true,
      status: "ACTIVE",
      apiVersion: summary.apiVersion,
      productsCount: testResult.products?.nodes?.length ?? 0,
      collectionsCount: collections.length,
      shop: {
        name: testResult.shop.name,
        currency: testResult.shop.paymentSettings?.currencyCode || "USD",
      },
      latencyMs: isProd ? undefined : latencyMs,
      message: "Shopify Storefront API synchronized successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        configured: true,
        connected: false,
        status: "UPSTREAM_UNAVAILABLE",
        message: "Unable to complete request to Shopify Storefront API endpoint.",
        latencyMs: isProd ? undefined : Date.now() - startTime,
      },
      { status: 502 }
    );
  }
}
