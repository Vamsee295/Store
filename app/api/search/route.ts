import { NextRequest, NextResponse } from "next/server";
import { getProducts, shopifyConfigured } from "@/lib/shopify/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const products = await getProducts({
      query: query.trim() || undefined,
      first: 24,
    });

    // If query was provided, ensure client-side filter fallback in preview mode
    let filtered = products;
    if (query.trim() && !shopifyConfigured) {
      const q = query.toLowerCase().trim();
      filtered = products.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const tagsMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || tagsMatch;
      });
    }

    return NextResponse.json({
      query,
      count: filtered.length,
      shopifyConfigured,
      products: filtered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Search request failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
