# THIRD SHELF — STOREFRONT & SHOPIFY LAUNCH CHECKLIST

**Brand:** Third Shelf  
**Store URL:** `https://thirdshelf.store`  
**Shopify Admin:** `https://admin.shopify.com/store/thirdshelfstore`  
**Target Markets:** International (evaluation starting with United States)  
**Status:** Pre-Launch Preparation & Owner Handover  

---

## 1. Developer Completed (Code & Storefront Level)

- [x] **Storefront API Error Handling:** Fixed GraphQL parser to preserve valid `json.data` when non-fatal field warnings occur (`lib/shopify/client.ts`).
- [x] **Product Description Sanitization:** Automated stripping of raw supplier notes, wholesale MOQs, and personal supplier email addresses (`lib/shopify/client.ts`).
- [x] **Hero Hotspot Links:** Replaced dead 404 links with active canonical collection routes (`components/hero-still-life.tsx`).
- [x] **Public Browsing Architecture:** Homepage, Shop All, category collections, search, and product detail pages are completely accessible without authentication.
- [x] **Login Gate for Shopping Actions:** Added auth guard on "Add to bag", "Save to favourites", opening Cart Drawer, and navigating to `/cart`.
- [x] **Pending Action Resumption:** Preserved return redirect parameters (`action`, `variantId`, `quantity`) through login/signup, executing the action exactly once upon return.
- [x] **Context-Aware Auth Banners:** Informational banners on `/login` and `/signup` explaining why an account is required based on the action attempted.
- [x] **Customer-Isolated Favourites System:** Built server-persisted favourites storage (`lib/favourites.ts`, `app/api/account/favourites/route.ts`) isolated by Shopify Customer GID.
- [x] **Dedicated Favourites Sanctuary Page:** Created `/account/favourites` with editorial grid, piece links, removal, and direct add-to-bag capabilities.
- [x] **Site Header Synchronization:** Header dynamically reflects authentication state (logged out: "Sign in" & bag; logged in: avatar initial, favourites count badge, live cart count, and account links).
- [x] **Cart Security Hardening:** Gated `/api/cart` mutations on verified customer session; bound `buyerIdentity: { customerAccessToken }` to Shopify cart creation.
- [x] **Honest Form States:** Verified `/pages/contact` input validation and direct brand email link (`care@thirdshelf.store`); removed mock timeout alerts.
- [x] **Production Build & Lint Validation:** Zero type errors (`npx tsc --noEmit`), zero ESLint errors, and 100% successful static page generation (40/40 routes).

---

## 2. Developer Pending

- [x] **No critical frontend code blockers remaining.** The Next.js custom storefront is feature-complete, secure, and production-built.
- [ ] *(Optional Post-Launch)* Add automated webhook handler (`/api/revalidate`) to trigger on-demand Next.js tag revalidation when products are edited in Shopify Admin.

---

## 3. Shopify Admin Required (Owner Actions)

- [ ] **Create the Four Canonical Collections:**
  Ensure the following collections exist in Shopify Admin under **Products → Collections** with exact matching handles:
  - `technology` (Title: *Technology*)
  - `home-essentials` (Title: *Home essentials*)
  - `travel` (Title: *Travel*)
  - `everyday-finds` (Title: *Everyday finds*)
- [ ] **Assign Products to Collections:**
  Add active products to their respective collections so they populate dynamically on the collection pages.
- [ ] **Publish Products to Storefront Sales Channel:**
  Verify that all intended products are published to the **Headless** / **Storefront API** sales channel in Shopify Admin.
- [ ] **Sanitize Source Product Descriptions in Shopify:**
  Review product descriptions in Shopify Admin to ensure supplier internal notes, Chinese factory packaging remarks, and manufacturer emails are permanently removed from the source catalog.
- [ ] **Customer Account Settings:**
  In Shopify Admin under **Settings → Customer accounts**, verify that customer accounts are enabled and configured to support Storefront API authentication.

---

## 4. Supplier & Dropshipping Fulfillment Required

- [ ] **Dropshipping App Integration:**
  Connect your verified dropshipping app (e.g., DSers, Zendrop, CJ Dropshipping, or Spocket) to Shopify.
- [ ] **Product Variant Mapping:**
  Verify that each Shopify product variant is correctly mapped to the supplier's SKU.
- [ ] **Automated Order Sync:**
  Test order fulfillment flow to confirm that once an order is paid in Shopify, it flows automatically into the supplier's fulfillment queue.
- [ ] **Tracking Number Synchronization:**
  Confirm that when the supplier dispatches the package and inputs the tracking number, it syncs back to Shopify and triggers customer dispatch notifications.

---

## 5. Payment & International Shipping Required

- [ ] **Payment Gateway Activation:**
  In Shopify Admin under **Settings → Payments**, activate an active card processor (e.g., Shopify Payments, Stripe, or Razorpay for international transactions).
- [ ] **Test Transaction:**
  Perform a safe test transaction using Shopify's **Bogus Gateway** or test mode to verify checkout creation, discount handling, and order generation.
- [ ] **Shipping Zones & Rates:**
  In Shopify Admin under **Settings → Shipping and delivery**, configure shipping zones (e.g., United States, International) and establish accurate carrier rates or flat rates.
- [ ] **Tax Configuration:**
  In Shopify Admin under **Settings → Taxes and duties**, verify automated tax calculation rules for target markets.

---

## 6. Owner Launch Approval Required

- [ ] **Custom Domain Verification:**
  Verify that `https://thirdshelf.store` DNS records (A and CNAME records) point correctly to the storefront hosting provider (e.g., Vercel) and that SSL is active.
- [ ] **End-to-End Test in Test Mode:**
  Log in as a test customer, add a live product to the bag, navigate to Shopify checkout, verify shipping rates and address pre-fill, and complete a test transaction.
- [ ] **Remove Storefront Password:**
  Once payments, supplier mapping, and shipping zones are verified, remove the storefront password in Shopify Admin under **Online Store → Preferences**.

---

## Launch Status Summary

| Workstream | Status | Notes |
| :--- | :--- | :--- |
| **Frontend Code & Architecture** | **PASS** | 40/40 routes built, auth-gated, customer-isolated, typed. |
| **Storefront API Data Sync** | **PASS** | Fetches live catalog, handles warnings, sanitizes copy. |
| **Account & Favourites Engine** | **PASS** | File-backed, customer-isolated, auto-login enabled. |
| **Shopify Admin Collections** | **PENDING** | Owner must create canonical collection handles in Admin. |
| **Payment Gateway** | **PENDING** | Owner must activate merchant processor in Shopify Settings. |
| **Dropshipping Fulfillment** | **PENDING** | Owner must map supplier SKUs in fulfillment app. |
| **Commercial Launch Safety** | **SECURED** | Pre-launch mode enforced; real orders disabled until owner launch. |
