import { NextResponse } from "next/server";
import { addCartLines, createCart, shopifyConfigured } from "@/lib/shopify/client";

export async function POST(req: Request) {
  if (!shopifyConfigured) return NextResponse.json({ error: "Shopify is not configured. Add your Storefront API credentials to .env.local before using checkout." }, { status: 503 });
  try {
    const body = await req.json() as { cartId?: string; lines?: { merchandiseId: string; quantity: number }[] };
    const lines = (body.lines || []).filter(l => typeof l.merchandiseId === "string" && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 99);
    if (!lines.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    const result = body.cartId ? await addCartLines(body.cartId, lines) : await createCart(lines);
    const payload = body.cartId ? (result as any)?.cartLinesAdd : (result as any)?.cartCreate;
    if (!payload?.cart?.checkoutUrl || payload.userErrors?.length) {
      return NextResponse.json({ error: payload?.userErrors?.map((e: {message:string})=>e.message).join("; ") || "Shopify could not create a checkout." }, { status: 400 });
    }
    return NextResponse.json({ cartId: payload.cart.id, checkoutUrl: payload.cart.checkoutUrl, totalQuantity: payload.cart.totalQuantity });
  } catch {
    return NextResponse.json({ error: "Could not create checkout. Try again." }, { status: 500 });
  }
}
