import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerCreate, customerAccessTokenCreate, shopifyConfigured } from "@/lib/shopify/client";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      termsAccepted?: boolean;
      acceptsMarketing?: boolean;
    };

    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";
    const email = body.email?.trim() || "";
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const termsAccepted = Boolean(body.termsAccepted);
    const acceptsMarketing = Boolean(body.acceptsMarketing);

    if (!firstName) {
      return NextResponse.json({ error: "Please enter your first name." }, { status: 400 });
    }

    if (!lastName) {
      return NextResponse.json({ error: "Please enter your last name." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Please enter your email address." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Please enter a password." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "You must accept the Terms of Service and Privacy Policy to create an account." },
        { status: 400 }
      );
    }

    if (!shopifyConfigured) {
      return NextResponse.json(
        {
          configured: false,
          error:
            "Preview mode · Shopify Storefront API is not configured. Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local to enable live customer registration."
        },
        { status: 503 }
      );
    }

    const result = await customerCreate({
      firstName,
      lastName,
      email,
      password,
      acceptsMarketing
    });

    const payload = result?.customerCreate;

    if (!payload) {
      return NextResponse.json(
        { error: "Unable to connect to Shopify account service. Please try again." },
        { status: 502 }
      );
    }

    if (payload.customerUserErrors && payload.customerUserErrors.length > 0) {
      const message = payload.customerUserErrors.map((e) => e.message).join("; ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Attempt immediate customer session creation
    try {
      const loginRes = await customerAccessTokenCreate({ email, password });
      const token = loginRes?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

      if (token) {
        const cookieStore = await cookies();
        cookieStore.set("third_shelf_customer_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return NextResponse.json({
          success: true,
          autoLoggedIn: true,
          message: "Account created and signed in successfully."
        });
      }
    } catch (loginErr) {
      console.warn("Auto-login after signup deferred:", loginErr);
    }

    return NextResponse.json({
      success: true,
      autoLoggedIn: false,
      message: "Account created successfully. Please sign in."
    });
  } catch (err) {
    console.error("Signup API route error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
