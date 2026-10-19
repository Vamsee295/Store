import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from "crypto";
import { getRevalidateSecret, getWebhookSecret } from "@/lib/env";

/**
 * Constant-time safe string comparison to prevent timing attacks.
 */
function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Verifies Shopify Webhook HMAC signature according to official specification:
 * Base64-encoded SHA256 HMAC of raw request payload using the Shopify app webhook signing secret.
 */
function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null, secret: string | null): boolean {
  if (!secret || !hmacHeader) return false;
  const hash = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  return timingSafeCompare(hash, hmacHeader.trim());
}

/**
 * Extracts and verifies the revalidation secret from headers (preferred) or query params (legacy fallback).
 */
function verifyRevalidateSecret(req: NextRequest): boolean {
  const expectedSecret = getRevalidateSecret();
  if (!expectedSecret) {
    // If not configured, reject all attempts to prevent unauthorized revalidation
    return false;
  }

  // 1. Check protected header: x-revalidate-secret
  const headerSecret = req.headers.get("x-revalidate-secret");
  if (headerSecret && timingSafeCompare(headerSecret.trim(), expectedSecret)) {
    return true;
  }

  // 2. Check Bearer authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (timingSafeCompare(bearerToken, expectedSecret)) {
      return true;
    }
  }

  // 3. Fallback to query param (?secret=) for backwards compatibility
  const querySecret = req.nextUrl.searchParams.get("secret");
  if (querySecret && timingSafeCompare(querySecret.trim(), expectedSecret)) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const shopifyTopic = req.headers.get("x-shopify-topic");
    const shopifyHmac = req.headers.get("x-shopify-hmac-sha256");

    // 1. Handle Shopify Webhook
    if (shopifyTopic) {
      const webhookSecret = getWebhookSecret();
      if (!webhookSecret) {
        return NextResponse.json(
          { error: "Webhook verification failed: SHOPIFY_WEBHOOK_SECRET is not configured." },
          { status: 503 }
        );
      }

      if (!verifyShopifyWebhook(rawBody, shopifyHmac, webhookSecret)) {
        return NextResponse.json(
          { error: "Invalid webhook HMAC signature." },
          { status: 401 }
        );
      }

      let parsed: { handle?: string; id?: string | number } = {};
      try {
        parsed = JSON.parse(rawBody);
      } catch {
        // Raw body might be empty or non-JSON
      }

      const revalidatedTags: string[] = ["shopify"];

      if (shopifyTopic.startsWith("products/")) {
        revalidatedTags.push("products");
        if (parsed.handle) {
          revalidatedTags.push(`product-${parsed.handle}`);
        }
        revalidatePath("/collections/all");
        revalidatePath("/products");
        if (parsed.handle) {
          revalidatePath(`/products/${parsed.handle}`);
        }
      } else if (shopifyTopic.startsWith("collections/")) {
        revalidatedTags.push("collections");
        if (parsed.handle) {
          revalidatedTags.push(`collection-${parsed.handle}`);
        }
        revalidatePath("/collections/all");
        if (parsed.handle) {
          revalidatePath(`/collections/${parsed.handle}`);
        }
      } else {
        revalidatedTags.push("products", "collections");
      }

      for (const tag of revalidatedTags) {
        revalidateTag(tag);
      }

      return NextResponse.json({
        revalidated: true,
        source: "shopify_webhook",
        topic: shopifyTopic,
        tags: revalidatedTags,
        handle: parsed.handle || null,
        timestamp: Date.now(),
      });
    }

    // 2. Handle Direct Secret-Triggered Revalidation
    if (verifyRevalidateSecret(req)) {
      const searchParams = req.nextUrl.searchParams;
      const queryTag = searchParams.get("tag");
      const queryPath = searchParams.get("path");

      const tagsToRevalidate = queryTag ? [queryTag] : ["shopify", "products", "collections"];
      for (const tag of tagsToRevalidate) {
        revalidateTag(tag);
      }
      if (queryPath) {
        revalidatePath(queryPath);
      }

      return NextResponse.json({
        revalidated: true,
        source: "direct_trigger",
        tags: tagsToRevalidate,
        path: queryPath || null,
        timestamp: Date.now(),
      });
    }

    // If neither valid webhook nor valid revalidate secret
    return NextResponse.json(
      { error: "Unauthorized. Valid x-revalidate-secret header or Shopify webhook signature required." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Revalidation operation failed." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!verifyRevalidateSecret(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Valid x-revalidate-secret header or secret parameter required." },
      { status: 401 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const tag = searchParams.get("tag");
  const path = searchParams.get("path");

  const tags = tag ? [tag] : ["shopify", "products", "collections"];
  for (const t of tags) {
    revalidateTag(t);
  }
  if (path) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    source: "direct_trigger",
    tags,
    path: path || null,
    timestamp: Date.now(),
  });
}
