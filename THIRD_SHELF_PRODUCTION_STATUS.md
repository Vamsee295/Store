# THIRD SHELF — PRODUCTION STATUS & ARCHITECTURE AUDIT

**Brand:** Third Shelf  
**Live Store:** `thirdshelfstore.myshopify.com`  
**Public Target Domain:** `https://thirdshelf.store`  
**Architecture:** Next.js (App Router 15.5.28) + React 19 + TypeScript + Tailwind CSS + Shopify Storefront API (`2026-10`)  
**Audit Date:** October 20, 2026  
**Operational Status:** **DEVELOPMENT FROZEN · PRE-LAUNCH VERIFICATION PHASE**

---

## 1. Executive Summary

Per the **Temporary Development Freeze & Production Stability Directive**, all visual redesigns and unneeded feature iterations are paused. The storefront frontend has been thoroughly validated for compilation, type safety, responsive behavior, and integration with the live Shopify Storefront API.

The store is **not yet ready to accept live customer orders**. Real order acceptance depends on external operational configurations: finalizing payment gateway authorization for cross-border USD transactions, configuring shipping rates, pointing DNS records for `thirdshelf.store`, and expanding the catalog beyond the initial single product.

---

## 2. Core Technical Audit Results

### 2.1 Compilation & Build Verification
- **TypeScript Check (`npx tsc --noEmit`):** **PASS** (Exit code 0, 0 type errors).
- **Production Build (`npm run build`):** **PASS** (Exit code 0).
  - 40 routes generated (30 static prerendered routes, 10 dynamic server endpoints).
  - Zero fatal build errors.
  - Chunk bundles optimized (103 kB shared First Load JS).

### 2.2 Environment Configuration & Security
- **Storefront API Isolation:**
  - `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` reside strictly in server-side environment variables (`.env.local`).
  - No private API tokens or webhook secrets are exposed behind `NEXT_PUBLIC_` prefixes.
  - Client-side code accesses Shopify exclusively through server-side route handlers (`/api/account`, `/api/cart`, `/api/auth/*`).
- **Secret & PII Hygiene:**
  - Passwords and customer session tokens are never logged.
  - Customer API responses strip internal passwords before returning data to the client.

### 2.3 Live Catalog & Data Integrity
- **Live Mode Active:** `shopifyConfigured` evaluates to `true`. All mock/sample fixtures are strictly suppressed.
- **Active Live Product:**
  - Product: `Silicone Desk Cable Organizer – 3, 5 or 7 Slots` (`gid://shopify/Product/15426809266472`)
  - Variants: 7 active variants retrieved via Storefront API with verified pricing ($12.99, $13.99, $14.99).
- **Active Collections in Shopify:**
  - `desk-workspace-essentials` ("Desk & Workspace Essentials"): 1 product.
  - `frontpage` ("Home page"): 0 products.
  - `office-supplies-example-products`: 0 products.
  - *Observation:* The four planned store collections (`technology`, `home-essentials`, `travel-essentials`, `everyday-finds`) do not yet exist on Shopify.

### 2.4 Customer Authentication Flow
- **Registration (`/api/auth/signup`):**
  - Calls Shopify Storefront API `customerCreate`.
  - Verified live: created customer `gid://shopify/Customer/31295720587560` on `thirdshelfstore.myshopify.com` with zero userErrors.
- **Session Transport:**
  - Auto-login executes `customerAccessTokenCreate` and issues an `httpOnly`, `SameSite=Lax`, `Secure` (production) cookie named `third_shelf_customer_token`.
- **Account Verification (`/api/account`):**
  - Queries `customer(customerAccessToken)` from Shopify.
  - Purges expired tokens automatically and instructs client to re-authenticate.
- **Password Recovery (`/api/auth/forgot-password`):**
  - Dispatches `customerRecover` mutation to trigger Shopify password reset email.

### 2.5 Favourites Storage & State Durability
- **Storage Architecture in `lib/favourites.ts`:**
  1. **Tier 1 (Managed Key-Value REST API):** Native support for Upstash Redis / Vercel KV (`KV_REST_API_URL` & `KV_REST_API_TOKEN`).
  2. **Tier 2 (Signed Cookie Fallback):** HMAC-SHA256 cryptographically signed customer-partitioned cookie (`ts_fav_sig`).
  3. **Tier 3 (Local Filesystem):** `data/customer_favourites.json` for offline development.
- **Important Production Distinction:**
  - While Tier 2 (signed cookie) guarantees that serverless lambdas on Vercel will not lose favourites during container cold starts, **cookies are not a database**.
  - A cookie has a 4 KB size constraint, cannot sync across multiple devices (e.g. phone to desktop), and HMAC guarantees integrity (tamper-resistance), not encryption.
  - **Recommendation for Launch:** Provision a free Upstash Redis instance and set `KV_REST_API_URL` and `KV_REST_API_TOKEN` in Vercel to give customers true persistent cross-device favourites.

### 2.6 Cart & Checkout Investigation
- **Live Cart Mutation:**
  - `cartCreate` generates a live Shopify Cart GID: `gid://shopify/Cart/hWNIBfZq...`
  - Total and variant lines calculate accurately ($12.99 / $25.98).
- **Checkout URL Investigation & HTTP 403 Analysis:**
  - *Previous Finding:* Server-side `curl`/Node fetch to the checkout URL returned `403 Forbidden` (`Request Forbidden`).
  - *Root Cause Determination:* 
    1. The 403 was caused by **Cloudflare/Shopify WAF bot-protection** blocking automated server-side HTTP clients that lack genuine browser headers.
    2. When the exact same checkout URL (`https://thirdshelfstore.myshopify.com/cart/c/...`) was navigated in a real Chromium browser, it resolved cleanly and redirected to `https://thirdshelfstore.myshopify.com/password`.
    3. The redirect to `/password` occurs because **Shopify Storefront Password Protection is currently enabled** on `thirdshelfstore.myshopify.com`.
    4. **Plan Status:** Shopify Admin confirms the store is on an **Advanced Plan** (promotional rate). The store is NOT restricted by a missing plan.
    5. **Checkout Path:** Once the storefront password is bypassed in the browser session or removed at launch, the customer lands directly on Shopify's native checkout page.

### 2.7 Domain & Hosting Status
- **Target Domain:** `https://thirdshelf.store`
- **DNS Resolution Test:** `ENOTFOUND` (`getaddrinfo ENOTFOUND thirdshelf.store`).
- **Status:** The domain `thirdshelf.store` does not currently point to Vercel. DNS `A` and `CNAME` records must be configured at the registrar.
