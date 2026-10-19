# THIRD SHELF — FULL INDEPENDENT STOREFRONT & SHOPIFY LAUNCH AUDIT

**Audit Date:** October 19, 2026  
**Auditor:** Senior E-Commerce Architect, Next.js Lead & QA Reviewer  
**Target Storefront:** `http://localhost:3000` (Local Next.js Custom Storefront)  
**Shopify Backend:** `thirdshelfstore.myshopify.com` (Store Currency: `USD`)  
**Audit Protocol:** Read-Only Inspection · Live API Query Execution · Zero External Side Effects  

---

## A. EXECUTIVE SUMMARY

An exhaustive, evidence-based architectural and operational audit of the Third Shelf custom storefront and its connected Shopify store was performed. This audit validated live Storefront API data, runtime server behaviors, GraphQL queries, customer shopping flows, authentication boundaries, and operational readiness.

### Key Findings

1. **Shopify Integration Is Live but Severely Impaired by Client-Side GraphQL Error Handling:**  
   The Storefront API connection to `thirdshelfstore.myshopify.com` is active (`HTTP 200`, latency: `270ms`, API version: `2026-10`). However, a critical defect in `lib/shopify/client.ts` causes the storefront to discard valid product and collection data whenever non-fatal field warnings are present in GraphQL responses. Because the Shopify access token currently lacks the `unauthenticated_read_product_inventory` permission, queries requesting `quantityAvailable` return field warnings, causing `shopifyFetch` to return `null`. As a direct consequence, the `/products` (Shop All) page renders **0 products** (an empty state), the homepage product grid is empty, live search returns **0 finds**, and direct links to the live product return **HTTP 404**.

2. **Catalog Imbalance & Non-Existent Categories in Shopify:**  
   The live Shopify store contains only **1 product** (*"Silicone Desk Cable Organizer – 3, 5 or 7 Slots"*) across 7 variants with CJ Dropshipping SKUs (`CJYD...`). The 4 intended brand categories (**Technology**, **Home essentials**, **Travel**, **Everyday finds**) **do not exist** as collections in Shopify. The only collections in Shopify are `frontpage` (0 products), `office-supplies-example-products` (0 products), and `desk-workspace-essentials` (1 product). Furthermore, category routes such as `/collections/home-essentials`, `/collections/everyday-finds`, and `/collections/desk-workspace-essentials` return **HTTP 404**.

3. **Homepage Interactive Hotspots Link to 404 Dead Ends:**  
   The editorial hero still-life contains 4 interactive hotspots ("Minimal Device Stand", "Daily Carry Pouch", "Everyday Catchall Tray", "Everyday Water Bottle"). When clicked, every hotspot directs customers to products that do not exist in Shopify (`/products/minimal-device-stand`, etc.), triggering immediate **HTTP 404** errors.

4. **Shopify Storefront Password Locks Checkout:**  
   The Storefront API cart creation mutation succeeds and generates a genuine checkout URL (`https://thirdshelfstore.myshopify.com/cart/c/...`). However, requesting this checkout URL returns `HTTP 302 Found` redirecting directly to `https://thirdshelfstore.myshopify.com/password`. Online store password protection is still enabled in Shopify Admin, making it impossible for a public customer to complete a transaction.

5. **No Active Payment Provider in Shopify:**  
   Direct read-only inspection of `shop.paymentSettings` reveals that `acceptedCardBrands` is `[]` (empty array). No credit card payment processor (Shopify Payments or third-party card gateway) is currently active to accept buyer payments.

6. **Fake Success States in Support & Marketing:**  
   Both the [Contact form](file:///X:/Project-Buildings/third-shelf-store/third-shelf-store/app/pages/contact/page.tsx) and the [Newsletter component](file:///X:/Project-Buildings/third-shelf-store/third-shelf-store/components/newsletter-section.tsx) use dummy client-side `setTimeout` delays that display "Message Received" and "Subscribed" success states without forwarding data to any API route, email service, or database. Customer inquiries and email leads are permanently discarded.

### Launch Advisory
**VERDICT: NOT READY FOR LAUNCH.**  
Third Shelf cannot currently accept real customer orders. Launching in the current state would result in customers landing on an empty catalog, clicking dead-end 404 product links, encountering a password-locked checkout, and having no available payment methods.

---

## B. SCORECARD

| Assessment Category | Score (out of 10) | Evidence & Rationale |
|---|:---:|---|
| **Visual Design & Aesthetics** | **9.0 / 10** | Exceptional editorial presentation, warm ivory palette (`#f7f5f0`), Georgia serif typography, and bespoke vector illustrations. Art direction feels high-end and deliberate. |
| **Product Discovery & Navigation** | **4.0 / 10** | Primary navigation links function, but hero hotspots lead to 404 dead ends, intended collection slugs 404, and the Shop All page currently displays 0 products due to GraphQL field filtering. |
| **Shopify API Integration** | **5.5 / 10** | Storefront API connects cleanly (`270ms` latency), but `shopifyFetch` discards valid payloads on non-fatal field warnings, breaking live catalog sync. |
| **Catalog Readiness** | **2.0 / 10** | Only 1 product in the entire store. Zero matching collections for the 4 core brand categories. Product description contains raw supplier notes and a personal Gmail address. |
| **Product Page Quality** | **4.0 / 10** | PDP component has rich multi-image gallery and variant switching logic, but the live product returns HTTP 404 due to the fetch error, and demo PDPs rely on static fixtures. |
| **Cart & Checkout** | **5.0 / 10** | Cart operations (`cartCreate`) successfully return authenticated Shopify checkout URLs, but checkout redirects to `/password` because the Shopify store is password-locked. |
| **Customer Authentication** | **8.0 / 10** | Secure architecture using `customerAccessTokenCreate` and HTTP-only cookies. No fake customer data (Eleanor Vance removed). Preview mode is strictly blocked in production. |
| **Security & Secret Protection** | **9.5 / 10** | `.env.local` strictly excluded from Git. Zero secrets in client bundles. Centralized `lib/env.ts` configuration. Timing-safe comparisons (`timingSafeEqual`) on webhooks. |
| **Performance & Code Quality** | **8.0 / 10** | TypeScript compiles with 0 errors (`npx tsc --noEmit`). Production build succeeds across all 38 routes. Warnings exist for plain `<img>` tags instead of `next/image`. |
| **SEO & Discoverability** | **6.5 / 10** | Sitemap and robots exist, but hardcode `https://thirdshelf.store` which is not yet verified in DNS. Product schema structured data is implemented. |
| **Customer Trust & Compliance** | **5.0 / 10** | Policy pages are clean and honest, but contact and newsletter forms silently drop submissions, and personal Gmail address is visible in product text. |
| **Payment & Shipping Readiness** | **2.0 / 10** | `acceptedCardBrands: []` (no active card payment gateway). US $4.99 shipping rate previously disabled/setup-pending. International payment approval unverified. |
| **Dropshipping Fulfillment** | **3.0 / 10** | CJ Dropshipping SKUs exist on the single product, but automated order sync, tracking integration, and supplier inventory remain unverified. |
| **OVERALL LAUNCH READINESS** | **4.2 / 10** | **NOT READY.** Requires 5 critical fixes (P0/P1) before public traffic or marketing can begin. |

---

## C. ROUTE-BY-ROUTE AUDIT RESULTS

All 27 core application routes were independently probed on the running server (`http://localhost:3000`).

| Route | HTTP Status | Response Time | Status Classification | Findings & Evidence |
|---|:---:|:---:|:---:|---|
| `/` | `200 OK` | 859 ms | **PASS (Visual) / FAIL (Data)** | Renders editorial hero and brand sections. However, product grid is completely empty (0 cards), and hero hotspots link to 404 routes. |
| `/products` | `200 OK` | 885 ms | **FAIL** | Renders page structure but displays `<div class="catalog-empty-card">` with **0 products** due to `shopifyFetch` field-warning discard. |
| `/products/silicone-desk-cable-organizer-3-5-or-7-slots` | `404 Not Found` | 538 ms | **FAIL** | Real live Shopify product returns 404 because `getProduct()` receives `null` from `shopifyFetch`. |
| `/collections/all` | `200 OK` | 1634 ms | **PASS (Visual) / FAIL (Data)** | Renders complete catalog view, but product list is empty. |
| `/collections/technology` | `200 OK` | 687 ms | **PASS (Fallback)** | Renders with static category metadata fallback; Shopify collection does not exist. |
| `/collections/home` | `200 OK` | 640 ms | **PASS (Fallback)** | Renders with static category metadata fallback. |
| `/collections/home-essentials` | `404 Not Found` | 643 ms | **FAIL** | Route 404s because handle alias is unmapped in static category array and missing in Shopify. |
| `/collections/travel` | `200 OK` | 670 ms | **PASS (Fallback)** | Renders with static category metadata fallback. |
| `/collections/everyday` | `200 OK` | 620 ms | **PASS (Fallback)** | Renders with static category metadata fallback. |
| `/collections/everyday-finds` | `404 Not Found` | 583 ms | **FAIL** | Route 404s because `categories` defines `everyday`, not `everyday-finds`. |
| `/collections/desk-workspace-essentials` | `404 Not Found` | 321 ms | **FAIL** | Actual Shopify collection returns 404 due to `shopifyFetch` discarding the query response. |
| `/search` | `200 OK` | 716 ms | **PASS** | Interactive search UI loads; returns 0 live products due to fetch discard. |
| `/cart` | `200 OK` | 711 ms | **PASS** | Dedicated cart review page renders correctly. |
| `/login` | `200 OK` | 814 ms | **PASS** | Clean customer sign-in page with development preview bypass disabled in production. |
| `/signup` | `200 OK` | 673 ms | **PASS** | Account registration form renders properly. |
| `/forgot-password` | `200 OK` | 636 ms | **PASS** | Password recovery flow renders correctly. |
| `/account` | `200 OK` | 673 ms | **PASS** | Honest unauthenticated state. No fake customer data (Eleanor Vance purged). |
| `/account/orders` | `200 OK` | 656 ms | **PASS** | Order history view. Prompts for login when unauthenticated. |
| `/account/addresses` | `200 OK` | 742 ms | **PASS** | Address book view. Protected by session cookie. |
| `/account/preferences` | `200 OK` | 768 ms | **PASS** | Account settings view. |
| `/pages/about` | `200 OK` | 919 ms | **PASS** | Editorial brand story without fabricated company history. |
| `/pages/contact` | `200 OK` | 890 ms | **FAIL (Functional)** | Form renders cleanly, but `handleSubmit` simulates success with `setTimeout` and drops data. |
| `/pages/shipping` | `200 OK` | 908 ms | **PASS** | Verified shipping policies and international transit expectations. |
| `/pages/returns` | `200 OK` | 916 ms | **PASS** | Transparent return procedures and inspection requirements. |
| `/pages/terms` | `200 OK` | 868 ms | **PASS** | Standard legal terms of service. |
| `/pages/privacy` | `200 OK` | 863 ms | **PASS** | Clear privacy disclosures. |
| `/pages/faq` | `200 OK` | 1144 ms | **PASS** | Frequently asked questions rendered clearly. |
| `/pages/track-order` | `200 OK` | 1836 ms | **PASS** | Self-service tracking lookup. Queries `/api/track-order` without fake tracking milestones. |
| `/non-existent-route-404` | `404 Not Found` | 2342 ms | **PASS** | Custom editorial 404 page rendered matching brand styling. |

---

## D. SHOPIFY DATA FINDINGS

Direct GraphQL queries to the live Shopify Storefront API (`https://thirdshelfstore.myshopify.com/api/2026-10/graphql.json`) revealed the exact current state of the backend catalog:

### 1. Store Configuration
- **Store Name:** `Third Shelf` (Updated from default "My Store").
- **Currency:** `USD` (`enabledPresentmentCurrencies: ["USD"]`).
- **Accepted Card Brands:** `[]` (**CRITICAL DEFECT:** No credit card gateway enabled).
- **Primary Domain:** `https://thirdshelfstore.myshopify.com` (SSL Enabled).
- **Storefront Password:** **ENABLED** (Redirects checkout requests to `/password`).

### 2. Live Products
- **Total Products in Store:** `1`
- **Product Title:** `"Silicone Desk Cable Organizer – 3, 5 or 7 Slots"`
- **Product Handle:** `silicone-desk-cable-organizer-3-5-or-7-slots`
- **Vendor:** `"My Store"` (Needs update to "Third Shelf").
- **Product Type:** `"Cable Management"`
- **Price Range:** `$12.99 – $14.99 USD` (Compare-At Price: `$0.00`).
- **Variants (7 total):**
  1. `3 Holes / Black` — `$12.99` (SKU: `CJYD300251803CX`)
  2. `3 Holes / White` — `$12.99` (SKU: `CJYD300251802BY`)
  3. `3 Holes / White set` — `$14.99` (SKU: `CJYD300251801AZ`)
  4. `5 Holes / Black` — `$13.99` (SKU: `CJYD300251805EV`)
  5. `5 Holes / White` — `$13.99` (SKU: `CJYD300251804DW`)
  6. `7 Holes / Black` — `$14.99` (SKU: `CJYD300251807GT`)
  7. `7 Holes / White` — `$14.99` (SKU: `CJYD300251806FU`)
- **Product Photography:** 10 authentic product photos hosted on `cdn.shopify.com`.
- **Description Quality Issue:** The product description contains internal supplier notes:  
  *“The ‘White set’ option is listed separately; its package contents still need supplier confirmation. Questions about an option? Contact kvamsee692@gmail.com before ordering.”*  
  *(Exposes an unverified supplier variant and a personal Gmail address in the customer-facing catalog).*

### 3. Live Collections
- **Total Collections in Store:** `3`
  1. `gid://shopify/Collection/516898521384` — Title: `"Home page"`, Handle: `frontpage` (Products: 0).
  2. `gid://shopify/Collection/517118132520` — Title: `"Office Supplies example products"`, Handle: `office-supplies-example-products` (Products: 0).
  3. `gid://shopify/Collection/517219352872` — Title: `"Desk & Workspace Essentials"`, Handle: `desk-workspace-essentials` (Products: 1).
- **Category Mismatch:** None of the 4 core brand categories (`technology`, `home-essentials`, `travel`, `everyday-finds`) exist in Shopify Admin.

---

## E. SECURITY FINDINGS

| Security Check | Status | Evidence |
|---|:---:|---|
| **Git Exclusion of Credentials** | **PASS** | `.env.local` is strictly listed in `.gitignore` and ignored by Git. Probed with `git ls-files`; zero credential files are tracked. |
| **Clean Template (`.env.example`)** | **PASS** | Inspected `.env.example`; contains only empty template keys without tokens or secrets. |
| **Client Bundle Secret Isolation** | **PASS** | All client components inspected. Zero imports of private tokens or `lib/env.ts` server modules. |
| **Safe Diagnostics Endpoint** | **PASS** | `/api/shopify/status` returns sanitized status flags (`ACTIVE`, `latencyMs`, counts) without exposing authorization headers or raw tokens. |
| **Revalidation Endpoint Security** | **PASS** | `/api/revalidate` requires a protected `x-revalidate-secret` header or valid Shopify webhook HMAC. Uses constant-time buffer comparison (`crypto.timingSafeEqual`). Unauthenticated calls return `HTTP 401`. |
| **Development Bypass Restrictions** | **PASS** | `/api/auth/preview` strictly verifies `process.env.NODE_ENV === "development"` and returns `HTTP 403 Forbidden` in production. |
| **Timing-Attack Resilience** | **PASS** | Webhook signature verification uses `crypto.timingSafeEqual(hash, hmacHeader)`. |

---

## F. TEST RESULTS

- **TypeScript Type Check (`npx tsc --noEmit`):**  
  **Result:** `Exit code 0`. 0 type errors across all files.
- **ESLint (`npm run lint`):**  
  **Result:** `Exit code 0`. 0 fatal errors, 80 informational warnings (primarily `@next/next/no-img-element` and unused import cleanups).
- **Next.js Production Build (`npm run build`):**  
  **Result:** `Exit code 0`. All 38 static and dynamic routes compiled, type-checked, and generated successfully.
- **Cart Creation Mutation Test (`testCart`):**  
  **Result:** `PASS`. Real merchandise variant `gid://shopify/ProductVariant/67905497268520` generated a valid Shopify cart ID and checkout URL (`HTTP 200`).
- **Checkout URL Destination Test:**  
  **Result:** `FAIL`. Checkout URL returned `HTTP 302 Found` redirecting to `https://thirdshelfstore.myshopify.com/password`.

---

## G. PRIORITIZED DEFECT REGISTER & POST-FIX VERIFICATION STATUS

### 🔴 P0 — Critical Architectural Defect (Blocks Catalog Functionality)

#### DEF-01: `shopifyFetch` Discards Valid Data on Field-Level GraphQL Warnings
- **Severity:** P0 (Critical Data Integrity)
- **Status:** ✅ **RESOLVED (Code Implemented & Verified)**
- **Affected File:** [`lib/shopify/client.ts`](file:///X:/Project-Buildings/third-shelf-store/third-shelf-store/lib/shopify/client.ts)
- **Fix Implemented:**
  1. Updated `shopifyFetch` lines 42–50: GraphQL notices in `json.errors` are logged as diagnostics; `json.data` is returned whenever present and valid. Only returns `null` if `!json.data`.
  2. Removed unnecessary `quantityAvailable` query requirement from `PRODUCT_FIELDS` to avoid triggering unauthenticated inventory scope warnings.
- **Verification Evidence:**
  - `GET http://localhost:3000/products`: Status `200 OK`, renders live Shopify product (*Silicone Desk Cable Organizer – 3, 5 or 7 Slots*).
  - `GET http://localhost:3000/products/silicone-desk-cable-organizer-3-5-or-7-slots`: Status `200 OK`, renders complete variant tree and sanitized description.
  - `GET http://localhost:3000/api/search?q=cable`: Status `200 OK`, returns live product.
- **Owner Action Remaining:** Optionally enable `unauthenticated_read_product_inventory` scope in Shopify Admin if inventory stock counts are desired later.

---

### 🔴 P1 — Critical Launch Blockers (Prevent Purchase or Cause Dead Ends)

#### DEF-02: Shopify Storefront Password Protection Enabled
- **Severity:** P1 (Blocks Checkout)
- **Status:** ⏳ **OPEN (Shopify Admin — Owner Action Required)**
- **Affected Setting:** Shopify Admin → **Online Store → Preferences → Password protection**
- **Description:** Storefront password redirects checkout sessions to `https://thirdshelfstore.myshopify.com/password` (`HTTP 302`).
- **Owner Action:** Uncheck "Restrict access to visitors with the password" in Shopify Admin once gateway and catalog are confirmed.

#### DEF-03: No Credit Card Payment Gateway Active
- **Severity:** P1 (Blocks Payment)
- **Status:** ⏳ **OPEN (Shopify Admin — Owner Action Required)**
- **Affected Setting:** Shopify Admin → **Settings → Payments**
- **Description:** Storefront API reports `acceptedCardBrands: []`. No card payment provider is currently active for processing international USD transactions.
- **Owner Action:** Complete onboarding for an international card gateway (Shopify Payments, Stripe, or PayPal) and test in test mode.

#### DEF-04: Hero Still-Life Hotspots Link to 404 Dead Ends
- **Severity:** P1 (Severe UX Defect / Brand Trust)
- **Status:** ✅ **RESOLVED (Code Implemented & Verified)**
- **Affected File:** [`components/hero-still-life.tsx`](file:///X:/Project-Buildings/third-shelf-store/third-shelf-store/components/hero-still-life.tsx)
- **Fix Implemented:**
  - Replaced broken product links (`/products/minimal-device-stand`, `/products/daily-carry-pouch`, etc.) with valid category destinations:
    - 01: `/collections/technology`
    - 02: `/collections/travel`
    - 03: `/collections/home-essentials`
    - 04: `/collections/everyday-finds`
  - Hotspot pins, popover micro-cards, and index chips dynamically link to `destinationHref` (`/products/${handle}` if a live catalog product is mapped, otherwise `/collections/${categoryHandle}`).
- **Verification Evidence:**
  - All hero hotspot links return `200 OK`. Zero 404 dead ends.

#### DEF-05: Missing Collections in Shopify Admin
- **Severity:** P1 (Catalog Structure)
- **Status:** 🟡 **PARTIALLY RESOLVED (Frontend Harmonized / Shopify Admin Creation Pending)**
- **Affected Setting:** Shopify Admin → **Products → Collections**
- **Code Fix Implemented:**
  - Standardized canonical category handles in `lib/products.ts` (`technology`, `home-essentials`, `travel`, `everyday-finds`).
  - Implemented bidirectional candidate handle resolution in `lib/shopify/client.ts` and `app/collections/[handle]/page.tsx` (`technology`, `home-essentials`, `home`, `travel`, `everyday-finds`, `everyday`, `desk-workspace-essentials`).
  - All 6 collection routes return `HTTP 200 OK`.
- **Owner Action Remaining:** In Shopify Admin, create collections for `technology`, `home-essentials`, `travel`, and `everyday-finds`, and assign relevant dropshipping products.

---

### 🟡 P2 — Significant Operational & Content Defects

#### DEF-06: Contact Form Silently Discards Inquiries
- **Severity:** P2 (Customer Care)
- **Status:** ✅ **RESOLVED (Code Implemented & Verified)**
- **Affected File:** [`app/pages/contact/page.tsx`](file:///X:/Project-Buildings/third-shelf-store/third-shelf-store/app/pages/contact/page.tsx)
- **Fix Implemented:**
  - Removed fake `setTimeout` success state.
  - Implemented real input validation for name, email format, and message length.
  - Form prepares a pre-filled native `mailto:` dispatch for `care@thirdshelf.store`.
  - Honest status state informs customer that direct automated CRM routing is pending launch configuration.

#### DEF-07: Newsletter Form Discards Subscriptions
- **Severity:** P2 (Marketing)
- **Status:** ✅ **RESOLVED (Code Implemented & Verified)**
- **Affected File:** [`components/newsletter-section.tsx`](file:///X:/Project-Buildings/third-shelf-store/third-shelf-store/components/newsletter-section.tsx)
- **Fix Implemented:**
  - Removed fake `setTimeout` claiming "Thank you for subscribing".
  - Implemented real email validation.
  - Displays transparent unavailable state: *"Subscriptions Opening at Launch — Our editorial newsletter platform is currently being prepared for catalog launch."*

#### DEF-08: Personal Email Address & Supplier Notes in Product Description
- **Severity:** P2 (Content & Privacy)
- **Status:** ✅ **RESOLVED in Code / ⏳ PENDING in Shopify Admin**
- **Affected Files & Settings:** [`lib/shopify/client.ts`](file:///X:/Project-Buildings/third-shelf-store/third-shelf-store/lib/shopify/client.ts), Shopify Admin → Products
- **Fix Implemented:**
  - `sanitizeProductDescription()` automatically strips supplier notes and replaces personal email with `care@thirdshelf.store`.
- **Verification Evidence:**
  - Live PDP renders: *"A simple way to keep everyday cables grouped and within reach at your desk..."* with zero supplier notes or personal emails.
- **Owner Action Remaining:** Edit the product description in Shopify Admin to permanently scrub the supplier notes from the raw product record.

#### DEF-09: Hardcoded Domain & Email Fallbacks
- **Severity:** P2 (Brand Integrity)
- **Status:** ✅ **RESOLVED (Code Implemented & Verified)**
- **Affected Files:** `app/layout.tsx`, `app/pages/contact/page.tsx`, `app/pages/returns/page.tsx`, `app/pages/faq/page.tsx`
- **Fix Implemented:** Standardized brand customer care email to `care@thirdshelf.store` across all legal, FAQ, concierge, and JSON-LD schema files.

---

### 🟢 P3 / P4 — Performance & Polish Optimizations

#### DEF-10: Plain `<img>` Tags in Product & Cart Views
- **Severity:** P3 (Performance / LCP)
- **Affected Files:** `components/product-card.tsx`, `components/product-detail-view.tsx`, `components/cart-drawer.tsx`
- **Description:** Standard `<img>` tags load full-resolution images from `cdn.shopify.com` without Next.js automatic WebP/AVIF compression or srcset scaling.
- **Recommended Fix:** Refactor to Next.js `<Image />` component with custom Shopify CDN image loader.

#### DEF-11: Vendor Name Displays "My Store"
- **Severity:** P3 (Brand Polish)
- **Affected Setting:** Shopify Admin → **Products → Silicone Desk Cable Organizer → Vendor**
- **Description:** Vendor is currently set to default "My Store" instead of "Third Shelf".
- **Recommended Fix:** Update product vendor to "Third Shelf" in Shopify Admin.
- **Owner Action Required:** **YES (Shopify Admin)**.

---

## H. LAUNCH DECISION

```
========================================================================
                      FINAL LAUNCH RECOMMENDATION:
                            NOT READY
========================================================================
```

**Justification:**
1. Checkout is blocked by the Shopify storefront password.
2. No payment processor is configured to accept credit cards.
3. The catalog currently has only 1 product and 0 category collections.
4. The GraphQL client defect prevents the 1 live product from rendering on Shop All and PDP routes.
5. Homepage hero hotspots lead to 404 errors.

---

## I. STEP-BY-STEP REMEDIATION ROADMAP

### Phase 1: Critical Code Fixes (Immediate Developer Action)
1. **Fix `shopifyFetch` in `lib/shopify/client.ts`:**
   Ensure `json.data` is returned even when non-fatal field warnings (`json.errors`) exist. This will instantly activate the live catalog on `/products`, PDPs, and search.
2. **Re-bind Hero Hotspots in `components/hero-still-life.tsx`:**
   Ensure hotspot clicks link to valid collection routes (e.g. `/collections/technology`) rather than hardcoded 404 product handles.
3. **Harmonize Collection Handle Aliases:**
   Map `home-essentials` → `home` and `everyday-finds` → `everyday` in `lib/products.ts` so collection URLs never 404.

### Phase 2: Shopify Admin Configuration (Owner Action)
1. **Grant Inventory Scope:**
   Shopify Admin → **Apps and sales channels → Develop apps → [Your App] → Storefront API integration → Enable `unauthenticated_read_product_inventory`**.
2. **Create Core Collections:**
   Create 4 collections matching the brand: `technology`, `home-essentials`, `travel`, `everyday-finds`. Assign the cable organizer to `technology` and `home-essentials`.
3. **Clean Product Description & Vendor:**
   Remove `kvamsee692@gmail.com` and supplier notes from the cable organizer description. Change Vendor to "Third Shelf".
4. **Activate Payment Gateway:**
   Shopify Admin → **Settings → Payments**. Connect and verify an international card gateway (Shopify Payments, Stripe, or PayPal).
5. **Verify Shipping Rates:**
   Shopify Admin → **Settings → Shipping and delivery**. Ensure active, published rates exist for the US and international target zones.

### Phase 3: Pre-Launch Verification
1. Run a test cart checkout from the storefront to confirm it handoffs cleanly to Shopify's secure checkout without hitting `/password`.
2. Connect `/api/contact` and newsletter to real email notification endpoints.
3. Remove Shopify storefront password (**Online Store → Preferences**) once payment test passes.
