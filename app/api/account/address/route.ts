import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  customerAddressCreate,
  customerAddressUpdate,
  customerAddressDelete,
  customerDefaultAddressUpdate,
  shopifyConfigured,
} from "@/lib/shopify/client";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("third_shelf_customer_token")?.value;
    const body = await req.json();
    const { action, address, id } = body;

    if (!shopifyConfigured || !token) {
      // Return optimistic success in preview mode
      return NextResponse.json({
        success: true,
        isPreviewMode: true,
        message: "Address updated in preview session.",
        address,
      });
    }

    if (action === "CREATE") {
      const result = await customerAddressCreate(token, address);
      if (result?.customerAddressCreate?.customerUserErrors?.length) {
        return NextResponse.json(
          { error: result.customerAddressCreate.customerUserErrors.map((e) => e.message).join("; ") },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        address: result?.customerAddressCreate?.customerAddress,
      });
    }

    if (action === "UPDATE" && id) {
      const result = await customerAddressUpdate(token, id, address);
      if (result?.customerAddressUpdate?.customerUserErrors?.length) {
        return NextResponse.json(
          { error: result.customerAddressUpdate.customerUserErrors.map((e) => e.message).join("; ") },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        address: result?.customerAddressUpdate?.customerAddress,
      });
    }

    if (action === "DELETE" && id) {
      const result = await customerAddressDelete(token, id);
      if (result?.customerAddressDelete?.customerUserErrors?.length) {
        return NextResponse.json(
          { error: result.customerAddressDelete.customerUserErrors.map((e) => e.message).join("; ") },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, deletedId: id });
    }

    if (action === "SET_DEFAULT" && id) {
      const result = await customerDefaultAddressUpdate(token, id);
      if (result?.customerDefaultAddressUpdate?.customerUserErrors?.length) {
        return NextResponse.json(
          { error: result.customerDefaultAddressUpdate.customerUserErrors.map((e) => e.message).join("; ") },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, defaultId: id });
    }

    return NextResponse.json({ error: "Invalid address action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process address operation" },
      { status: 500 }
    );
  }
}
