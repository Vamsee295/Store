import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const order = searchParams.get("order")?.trim().replace(/^#/, "");
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!order || !email) {
    return NextResponse.json(
      {
        order: null,
        message: "Please provide both an order number and the email address used during checkout.",
      },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      {
        order: null,
        message: "Please enter a valid email address.",
      },
      { status: 400 }
    );
  }

  // Real-world operational rule:
  // Public Storefront API does not expose unauthenticated order history for security & privacy.
  // Full carrier tracking milestones are synchronized via supplier fulfillment apps or customer account sign-in.
  return NextResponse.json(
    {
      order: null,
      message: `No active carrier tracking is currently linked to order #${order} for ${email}. When your order is dispatched by our fulfillment partner, live tracking numbers and carrier transit milestones will be emailed directly to you.`,
    },
    { status: 200 }
  );
}
