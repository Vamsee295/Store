import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomer, getProduct, shopifyConfigured } from "@/lib/shopify/client";
import {
  getCustomerFavourites,
  addCustomerFavourite,
  removeCustomerFavourite,
} from "@/lib/favourites";
import type { Product } from "@/lib/products";

const isDev = process.env.NODE_ENV === "development";

/**
 * Resolves the authenticated customer ID from the secure HTTP-only session cookie.
 * Returns null if the request is not authenticated.
 */
async function resolveCustomerId(): Promise<{ customerId: string | null; isPreview: boolean }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("third_shelf_customer_token")?.value;

  if (shopifyConfigured && token) {
    const res = await getCustomer(token);
    if (res?.customer?.id) {
      return { customerId: res.customer.id, isPreview: false };
    }
  }

  // Allow development preview mode if enabled
  const isPreview = Boolean(cookieStore.get("third_shelf_preview_mode")?.value);
  if (isDev && isPreview) {
    return { customerId: "dev-preview-customer", isPreview: true };
  }

  return { customerId: null, isPreview: false };
}

export async function GET() {
  try {
    const { customerId, isPreview } = await resolveCustomerId();

    if (!customerId) {
      return NextResponse.json(
        { error: "Authentication required to access saved favourites.", authenticated: false },
        { status: 401 }
      );
    }

    const handles = await getCustomerFavourites(customerId);

    // Populate actual products from catalog
    const productPromises = handles.map((h) => getProduct(h));
    const rawProducts = await Promise.all(productPromises);
    const products: Product[] = rawProducts.filter((p): p is Product => Boolean(p));

    return NextResponse.json({
      authenticated: true,
      isPreview,
      handles,
      products,
      count: handles.length,
    });
  } catch (err) {
    console.error("Favourites GET error:", err);
    return NextResponse.json({ error: "Failed to load favourites" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { customerId } = await resolveCustomerId();

    if (!customerId) {
      return NextResponse.json(
        { error: "Authentication required to save favourites.", authenticated: false },
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as { handle?: string };
    const handle = body.handle?.trim();

    if (!handle) {
      return NextResponse.json({ error: "Product handle is required" }, { status: 400 });
    }

    const handles = await addCustomerFavourite(customerId, handle);
    return NextResponse.json({ success: true, handles, count: handles.length });
  } catch (err) {
    console.error("Favourites POST error:", err);
    return NextResponse.json({ error: "Failed to update favourites" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { customerId } = await resolveCustomerId();

    if (!customerId) {
      return NextResponse.json(
        { error: "Authentication required to modify favourites.", authenticated: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let handle = searchParams.get("handle")?.trim();

    if (!handle) {
      const body = (await req.json().catch(() => ({}))) as { handle?: string };
      handle = body.handle?.trim();
    }

    if (!handle) {
      return NextResponse.json({ error: "Product handle is required" }, { status: 400 });
    }

    const handles = await removeCustomerFavourite(customerId, handle);
    return NextResponse.json({ success: true, handles, count: handles.length });
  } catch (err) {
    console.error("Favourites DELETE error:", err);
    return NextResponse.json({ error: "Failed to remove favourite" }, { status: 500 });
  }
}
