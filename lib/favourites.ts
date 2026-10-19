import fs from "fs/promises";
import path from "path";

const FAVOURITES_FILE = path.join(process.cwd(), "data", "customer_favourites.json");

type FavouritesStore = Record<string, string[]>; // customerId -> array of product handles

async function readStore(): Promise<FavouritesStore> {
  try {
    const data = await fs.readFile(FAVOURITES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeStore(store: FavouritesStore): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FAVOURITES_FILE), { recursive: true });
    await fs.writeFile(FAVOURITES_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write favourites store:", err);
  }
}

/**
 * Retrieves all favourite product handles for a verified customer ID.
 * Strict customer isolation: only returns handles belonging to the specified customerId.
 */
export async function getCustomerFavourites(customerId: string): Promise<string[]> {
  if (!customerId) return [];
  const store = await readStore();
  return store[customerId] || [];
}

/**
 * Adds a product handle to the customer's favourites.
 */
export async function addCustomerFavourite(customerId: string, handle: string): Promise<string[]> {
  if (!customerId || !handle) return [];
  const store = await readStore();
  const current = new Set(store[customerId] || []);
  current.add(handle);
  store[customerId] = Array.from(current);
  await writeStore(store);
  return store[customerId];
}

/**
 * Removes a product handle from the customer's favourites.
 */
export async function removeCustomerFavourite(customerId: string, handle: string): Promise<string[]> {
  if (!customerId || !handle) return [];
  const store = await readStore();
  const current = new Set(store[customerId] || []);
  current.delete(handle);
  store[customerId] = Array.from(current);
  await writeStore(store);
  return store[customerId];
}

/**
 * Checks whether a product handle is saved in the customer's favourites.
 */
export async function isCustomerFavourite(customerId: string, handle: string): Promise<boolean> {
  if (!customerId || !handle) return false;
  const store = await readStore();
  return Boolean(store[customerId]?.includes(handle));
}
