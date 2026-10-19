/**
 * Centralized, typed server-side environment configuration for Third Shelf.
 *
 * Rules:
 * - Only server-side code should import this module (keep secrets out of browser bundles).
 * - Never log or return raw secrets, tokens, or authorization headers.
 * - Format validation for domains and API versions.
 * - Safe diagnostics summaries.
 */

export interface ShopifyEnvConfig {
  domain: string;
  apiVersion: string;
  revalidateSeconds: number;
  isConfigured: boolean;
  hasStorefrontToken: boolean;
  hasWebhookSecret: boolean;
  hasRevalidateSecret: boolean;
}

const DEFAULT_API_VERSION = "2026-10";
const DEFAULT_REVALIDATE_SECONDS = 60;
const API_VERSION_REGEX = /^\d{4}-\d{2}$/;

/**
 * Normalizes and validates a Shopify store domain.
 * Strips leading https://, trailing slashes, and pathnames.
 */
export function sanitizeShopifyDomain(rawDomain: string): string {
  if (!rawDomain) return "";
  return rawDomain
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

/**
 * Checks if a token is a placeholder or template value.
 */
export function isPlaceholderToken(token: string): boolean {
  if (!token) return true;
  const upper = token.trim().toUpperCase();
  return (
    upper.startsWith("YOUR_") ||
    upper.includes("STOREFRONT_ACCESS_TOKEN") ||
    upper === "YOUR_PUBLIC_STOREFRONT_ACCESS_TOKEN" ||
    upper === "PLACEHOLDER"
  );
}

/**
 * Get server-side Shopify Storefront API credentials.
 * Keeps raw credentials isolated to server-side callers.
 */
export function getServerShopifyCredentials(): {
  domain: string;
  token: string;
  apiVersion: string;
  revalidateSeconds: number;
  isConfigured: boolean;
} {
  const rawDomain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "";
  const domain = sanitizeShopifyDomain(rawDomain);

  const rawToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
  const token = rawToken.trim();

  let apiVersion = (process.env.SHOPIFY_API_VERSION || DEFAULT_API_VERSION).trim();
  if (!API_VERSION_REGEX.test(apiVersion)) {
    apiVersion = DEFAULT_API_VERSION;
  }

  const rawRevalidate = process.env.SHOPIFY_REVALIDATE_SECONDS;
  const parsedSeconds = rawRevalidate ? parseInt(rawRevalidate, 10) : DEFAULT_REVALIDATE_SECONDS;
  const revalidateSeconds = Number.isFinite(parsedSeconds) && parsedSeconds > 0 ? parsedSeconds : DEFAULT_REVALIDATE_SECONDS;

  const isConfigured = Boolean(domain && token && !isPlaceholderToken(token));

  return {
    domain,
    token,
    apiVersion,
    revalidateSeconds,
    isConfigured,
  };
}

/**
 * Get revalidation secret if configured.
 * Does not provide hardcoded default fallbacks.
 */
export function getRevalidateSecret(): string | null {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  return secret && secret.length > 0 ? secret : null;
}

/**
 * Get webhook verification secret if configured.
 */
export function getWebhookSecret(): string | null {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
  return secret && secret.length > 0 ? secret : null;
}

/**
 * Generates a sanitized diagnostics summary safe for status endpoints.
 * Guaranteed never to expose actual token values, secrets, or auth headers.
 */
export function getSanitizedDiagnosticsSummary(): {
  domain: string;
  apiVersion: string;
  isConfigured: boolean;
  hasStorefrontToken: boolean;
  isPlaceholderToken: boolean;
  hasWebhookSecret: boolean;
  hasRevalidateSecret: boolean;
  revalidateSeconds: number;
  environment: "development" | "production" | "test";
} {
  const { domain, token, apiVersion, revalidateSeconds, isConfigured } = getServerShopifyCredentials();
  const rawToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
  const isPlaceholder = isPlaceholderToken(rawToken);

  return {
    domain,
    apiVersion,
    isConfigured,
    hasStorefrontToken: Boolean(token && !isPlaceholder),
    isPlaceholderToken: isPlaceholder,
    hasWebhookSecret: Boolean(getWebhookSecret()),
    hasRevalidateSecret: Boolean(getRevalidateSecret()),
    revalidateSeconds,
    environment: (process.env.NODE_ENV as any) || "development",
  };
}
