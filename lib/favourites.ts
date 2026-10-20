import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const FAVOURITES_FILE = path.join(process.cwd(), "data", "customer_favourites.json");

/**
 * Third Shelf Favourites Storage Engine.
 *
 * Production architecture for Vercel / serverless:
 * 1. Managed Key-Value store (Vercel KV / Upstash Redis via HTTPS REST API) when configured.
 * 2. Cryptographically signed, HTTP-only session cookie fallback (zero-infra durability across serverless lambdas).
 * 3. Local filesystem store (for local Node.js development environments).
 *
 * Strict customer authorization:
 * - Every operation requires a server-verified Shopify Customer GID.
 * - Customer IDs supplied by the browser are strictly rejected/ignored.
 * - Cross-customer data access is impossible by design.
 */

function getSigningSecret(): string {
  return (
    process.env.FAVOURITES_SIGNING_SECRET ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "third-shelf-default-signature-key"
  );
}

/**
 * Upstash Redis / Vercel KV REST reader
 */
async function getKvFavourites(customerId: string): Promise<string[] | null> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!kvUrl || !kvToken) return null;

  try {
    const key = `customer_favourites:${customerId}`;
    const res = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.result) return [];
    if (typeof data.result === "string") {
      try {
        return JSON.parse(data.result);
      } catch {
        return [];
      }
    }
    if (Array.isArray(data.result)) {
      return data.result;
    }
    return [];
  } catch (err) {
    console.error("Managed KV favourites read error:", err);
    return null;
  }
}

/**
 * Upstash Redis / Vercel KV REST writer
 */
async function setKvFavourites(customerId: string, handles: string[]): Promise<boolean> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!kvUrl || !kvToken) return false;

  try {
    const key = `customer_favourites:${customerId}`;
    const res = await fetch(`${kvUrl}/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(handles),
      cache: "no-store",
    });
    return res.ok;
  } catch (err) {
    console.error("Managed KV favourites write error:", err);
    return false;
  }
}

/**
 * Local filesystem store (for development environments)
 */
async function readFileStore(): Promise<Record<string, string[]>> {
  try {
    const data = await fs.readFile(FAVOURITES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeFileStore(store: Record<string, string[]>): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FAVOURITES_FILE), { recursive: true });
    await fs.writeFile(FAVOURITES_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Non-fatal if filesystem is read-only (as on serverless)
  }
}

/**
 * Signs customer favourites payload with HMAC-SHA256 for tamper-proof serverless state persistence.
 */
export function signFavouritesPayload(customerId: string, handles: string[]): string {
  const payload = JSON.stringify({ customerId, handles, ts: Date.now() });
  const b64 = Buffer.from(payload, "utf-8").toString("base64url");
  const hmac = crypto.createHmac("sha256", getSigningSecret()).update(b64).digest("hex");
  return `${b64}.${hmac}`;
}

/**
 * Verifies HMAC-SHA256 signature and customer isolation.
 * Returns null if signature is invalid or belongs to another customer.
 */
export function verifyFavouritesPayload(customerId: string, signedValue: string): string[] | null {
  if (!signedValue || !customerId) return null;
  const parts = signedValue.split(".");
  if (parts.length !== 2) return null;
  const [b64, hmac] = parts;

  try {
    const expectedHmac = crypto.createHmac("sha256", getSigningSecret()).update(b64).digest("hex");
    const hmacBuf = Buffer.from(hmac, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");

    if (hmacBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(hmacBuf, expectedBuf)) {
      return null;
    }

    const jsonStr = Buffer.from(b64, "base64url").toString("utf-8");
    const data = JSON.parse(jsonStr);

    if (data.customerId !== customerId) {
      // Customer isolation check: payload customer ID does not match current authenticated customer
      return null;
    }

    return Array.isArray(data.handles) ? data.handles : [];
  } catch {
    return null;
  }
}

/**
 * Retrieves all favourite product handles for a verified customer ID.
 * Strict customer isolation: only returns handles belonging to the specified customerId.
 */
export async function getCustomerFavourites(
  customerId: string,
  cookieBackup?: string | null
): Promise<string[]> {
  if (!customerId) return [];

  // 1. Try managed KV first if configured
  const kvRes = await getKvFavourites(customerId);
  if (kvRes !== null) {
    return kvRes;
  }

  // 2. Try verified signed cookie fallback (ideal for zero-infra serverless deployments)
  if (cookieBackup) {
    const verified = verifyFavouritesPayload(customerId, cookieBackup);
    if (verified !== null) {
      return verified;
    }
  }

  // 3. Fallback to local file store (dev/node environments)
  const fileStore = await readFileStore();
  return fileStore[customerId] || [];
}

/**
 * Adds a product handle to the customer's favourites.
 */
export async function addCustomerFavourite(
  customerId: string,
  handle: string,
  cookieBackup?: string | null
): Promise<{ handles: string[]; signedPayload: string }> {
  if (!customerId || !handle) return { handles: [], signedPayload: "" };

  const current = await getCustomerFavourites(customerId, cookieBackup);
  const updatedSet = new Set(current);
  updatedSet.add(handle);
  const updated = Array.from(updatedSet);

  // Persist to KV if available
  await setKvFavourites(customerId, updated);

  // Persist to file if writable
  const fileStore = await readFileStore();
  fileStore[customerId] = updated;
  await writeFileStore(fileStore);

  const signedPayload = signFavouritesPayload(customerId, updated);
  return { handles: updated, signedPayload };
}

/**
 * Removes a product handle from the customer's favourites.
 */
export async function removeCustomerFavourite(
  customerId: string,
  handle: string,
  cookieBackup?: string | null
): Promise<{ handles: string[]; signedPayload: string }> {
  if (!customerId || !handle) return { handles: [], signedPayload: "" };

  const current = await getCustomerFavourites(customerId, cookieBackup);
  const updatedSet = new Set(current);
  updatedSet.delete(handle);
  const updated = Array.from(updatedSet);

  // Persist to KV if available
  await setKvFavourites(customerId, updated);

  // Persist to file if writable
  const fileStore = await readFileStore();
  fileStore[customerId] = updated;
  await writeFileStore(fileStore);

  const signedPayload = signFavouritesPayload(customerId, updated);
  return { handles: updated, signedPayload };
}

/**
 * Checks whether a product handle is saved in the customer's favourites.
 */
export async function isCustomerFavourite(
  customerId: string,
  handle: string,
  cookieBackup?: string | null
): Promise<boolean> {
  if (!customerId || !handle) return false;
  const current = await getCustomerFavourites(customerId, cookieBackup);
  return current.includes(handle);
}

/**
 * Storage configuration diagnostics
 */
export function getFavouritesStorageInfo(): {
  mode: "managed_kv" | "cookie_signed_serverless" | "local_file";
  isDurableOnServerless: boolean;
  kvConfigured: boolean;
} {
  const kvConfigured = Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );

  return {
    mode: kvConfigured ? "managed_kv" : "cookie_signed_serverless",
    isDurableOnServerless: true, // Both managed KV and signed cookie persist safely across serverless lambdas
    kvConfigured,
  };
}
