import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerAccessTokenCreate, shopifyConfigured } from "@/lib/shopify/client";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = body.email?.trim() || "";
    const password = body.password || "";

    if (!email) {
      return NextResponse.json({ error: "Please enter your email address." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Please enter your password." }, { status: 400 });
    }

    if (!shopifyConfigured) {
      return NextResponse.json(
        {
          configured: false,
          error:
            "Preview mode · Shopify Storefront API is not configured. Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local to enable live customer authentication."
        },
        { status: 503 }
      );
    }

    const result = await customerAccessTokenCreate({ email, password });
    const payload = result?.customerAccessTokenCreate;

    if (!payload) {
      return NextResponse.json(
        { error: "Unable to connect to Shopify authentication service. Please try again." },
        { status: 502 }
      );
    }

    if (payload.customerUserErrors && payload.customerUserErrors.length > 0) {
      const message = payload.customerUserErrors.map((e) => e.message).join("; ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!payload.customerAccessToken?.accessToken) {
      return NextResponse.json(
        { error: "Invalid email address or password. Please verify and try again." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const expiresAt = payload.customerAccessToken.expiresAt
      ? new Date(payload.customerAccessToken.expiresAt)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    cookieStore.set("third_shelf_customer_token", payload.customerAccessToken.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/"
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login API route error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
