import { NextResponse } from "next/server";
import { customerRecover, shopifyConfigured } from "@/lib/shopify/client";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim() || "";

    if (!email) {
      return NextResponse.json({ error: "Please enter your email address." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!shopifyConfigured) {
      return NextResponse.json(
        {
          configured: false,
          error:
            "Preview mode · Shopify Storefront API is not configured. Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local to enable live password reset emails."
        },
        { status: 503 }
      );
    }

    const result = await customerRecover(email);
    const payload = result?.customerRecover;

    if (!payload) {
      return NextResponse.json(
        { error: "Unable to connect to Shopify password recovery service. Please try again." },
        { status: 502 }
      );
    }

    // Even if Shopify returns userErrors for privacy in customer-facing flows or errors,
    // we return a generic message unless there's a technical error.
    return NextResponse.json({
      success: true,
      message:
        "If an account exists for this email address, you will receive password reset instructions shortly. Please check your inbox and spam folder."
    });
  } catch (err) {
    console.error("Forgot password API route error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
