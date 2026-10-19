import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomer, shopifyConfigured } from "@/lib/shopify/client";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("third_shelf_customer_token")?.value;

    // 1. If live Shopify Storefront API is configured and a customer session token is present
    if (shopifyConfigured && token) {
      const res = await getCustomer(token);
      if (res?.customer) {
        return NextResponse.json({
          authenticated: true,
          configured: true,
          customer: res.customer,
        });
      }

      // If token was rejected or expired by Shopify, clear the cookie
      cookieStore.delete("third_shelf_customer_token");
      return NextResponse.json({
        authenticated: false,
        configured: true,
        customer: null,
        sessionExpired: true,
      });
    }

    // 2. If unauthenticated (no token)
    // Strictly per business rules: Never invent products, customer accounts, orders or addresses.
    return NextResponse.json({
      authenticated: false,
      configured: shopifyConfigured,
      customer: null,
      message: shopifyConfigured
        ? "Please sign in to view your verified account."
        : "Shopify customer account integration is pending configuration in .env.local.",
    });
  } catch (err) {
    console.error("Account API route error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve account details" },
      { status: 500 }
    );
  }
}
