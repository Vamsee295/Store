import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const isDev = process.env.NODE_ENV === "development";

export async function GET() {
  const cookieStore = await cookies();
  const isPreview = Boolean(cookieStore.get("third_shelf_preview_mode")?.value);

  return NextResponse.json({
    isDevelopment: isDev,
    isPreviewStore: isDev && isPreview,
  });
}

export async function POST(req: Request) {
  // Security constraint: preview mode bypass is strictly forbidden in production
  if (!isDev) {
    return NextResponse.json(
      { error: "Preview store mode is strictly restricted to local development environments." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const cookieStore = await cookies();

    if (body.exit) {
      cookieStore.delete("third_shelf_preview_mode");
      return NextResponse.json({ success: true, isPreviewStore: false });
    }

    // Set temporary development-only preview cookie
    cookieStore.set("third_shelf_preview_mode", "true", {
      httpOnly: true,
      secure: false, // development localhost
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true, isPreviewStore: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to set preview mode" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("third_shelf_preview_mode");
  return NextResponse.json({ success: true, isPreviewStore: false });
}
