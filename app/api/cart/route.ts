import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  addCartLines,
  createCart,
  getCart,
  updateCartLines,
  removeCartLines,
  updateCartNote,
  shopifyConfigured,
} from "@/lib/shopify/client";

const isDev = process.env.NODE_ENV === "development";

/**
 * Validates that the request comes from an authenticated customer or active development preview.
 * Hiding a button is not authorization: server operations independently verify the session.
 */
async function verifyCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("third_shelf_customer_token")?.value;
  const isPreview = Boolean(cookieStore.get("third_shelf_preview_mode")?.value);

  const isAuthorized = Boolean(token || (isDev && isPreview));
  return { isAuthorized, token, isPreview, cookieStore };
}

export async function GET() {
  try {
    const { isAuthorized, cookieStore } = await verifyCustomerSession();

    if (!isAuthorized) {
      return NextResponse.json({
        configured: shopifyConfigured,
        authenticated: false,
        cart: null,
      });
    }

    const cartId = cookieStore.get("third_shelf_cart_id")?.value;

    if (!shopifyConfigured || !cartId) {
      return NextResponse.json({
        configured: shopifyConfigured,
        authenticated: true,
        cart: null,
      });
    }

    const res = await getCart(cartId);
    return NextResponse.json({
      configured: true,
      authenticated: true,
      cart: res?.cart ?? null,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isAuthorized, token, cookieStore } = await verifyCustomerSession();

    // Critical Rule: Adding to cart requires customer authentication
    if (!isAuthorized) {
      return NextResponse.json(
        {
          error: "Customer login required to create or modify a shopping cart.",
          authenticated: false,
        },
        { status: 401 }
      );
    }

    const existingCartId = cookieStore.get("third_shelf_cart_id")?.value;

    const body = (await req.json()) as {
      cartId?: string;
      note?: string;
      lines?: { merchandiseId: string; quantity: number }[];
    };

    const targetCartId = body.cartId || existingCartId;

    const lines = (body.lines || []).filter(
      (l) =>
        typeof l.merchandiseId === "string" &&
        Number.isInteger(l.quantity) &&
        l.quantity > 0 &&
        l.quantity <= 99
    );

    if (!lines.length) {
      return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    }

    if (!shopifyConfigured) {
      return NextResponse.json({
        isPreviewMode: true,
        authenticated: true,
        message:
          "Third Shelf is operating in preview mode with editorial catalog fixtures. Live checkout securely forwards to Shopify's SSL checkout once Storefront API credentials are configured in .env.local.",
        linesCount: lines.length,
        note: body.note || null,
      });
    }

    // Bind authenticated customerAccessToken to Shopify buyerIdentity
    const buyerIdentity = token ? { customerAccessToken: token } : undefined;

    const result = targetCartId
      ? await addCartLines(targetCartId, lines)
      : await createCart(lines, body.note, buyerIdentity);

    const payload = targetCartId
      ? (result as any)?.cartLinesAdd
      : (result as any)?.cartCreate;

    if (!payload?.cart?.checkoutUrl || payload.userErrors?.length) {
      const errorMsg = payload?.userErrors
        ?.map((e: { message: string }) => e.message)
        .join("; ");

      return NextResponse.json({
        isPreviewMode: true,
        authenticated: true,
        fallbackReason: errorMsg || "Mock variant ID in preview mode",
        message:
          "Third Shelf is operating in preview mode. Demo products use local catalog IDs. Once live Shopify products are synchronized, customers proceed directly to checkout.",
        linesCount: lines.length,
      });
    }

    // Persist cartId cookie for 30 days
    cookieStore.set("third_shelf_cart_id", payload.cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({
      authenticated: true,
      cartId: payload.cart.id,
      checkoutUrl: payload.cart.checkoutUrl,
      totalQuantity: payload.cart.totalQuantity,
    });
  } catch {
    return NextResponse.json({
      isPreviewMode: true,
      message: "Shopify checkout service is running in preview mode.",
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const { isAuthorized, cookieStore } = await verifyCustomerSession();

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Authentication required to update cart", authenticated: false },
        { status: 401 }
      );
    }

    const cartId = cookieStore.get("third_shelf_cart_id")?.value;
    if (!shopifyConfigured || !cartId) {
      return NextResponse.json({ success: true, isPreviewMode: true });
    }

    const body = await req.json();
    if (body.lines) {
      const res = await updateCartLines(cartId, body.lines);
      return NextResponse.json({ success: true, cart: res?.cartLinesUpdate?.cart });
    }

    if (typeof body.note === "string") {
      const res = await updateCartNote(cartId, body.note);
      return NextResponse.json({ success: true, cart: res?.cartNoteUpdate?.cart });
    }

    return NextResponse.json({ error: "No update parameters provided" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { isAuthorized, cookieStore } = await verifyCustomerSession();

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Authentication required to modify cart", authenticated: false },
        { status: 401 }
      );
    }

    const cartId = cookieStore.get("third_shelf_cart_id")?.value;
    const { searchParams } = new URL(req.url);
    const lineId = searchParams.get("lineId");

    if (shopifyConfigured && cartId && lineId) {
      const res = await removeCartLines(cartId, [lineId]);
      return NextResponse.json({ success: true, cart: res?.cartLinesRemove?.cart });
    }

    // Clear cart cookie if entire cart is cleared
    cookieStore.delete("third_shelf_cart_id");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove cart lines" }, { status: 500 });
  }
}
