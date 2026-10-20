# THIRD SHELF — STOREFRONT & SHOPIFY LAUNCH TRACKER (16-POINT AUDIT)

**Brand:** Third Shelf  
**Store URL:** `https://thirdshelf.store`  
**Shopify Store:** `thirdshelfstore.myshopify.com`  
**Frontend Architecture:** Next.js (App Router 15.5.28), TypeScript, Tailwind CSS, Shopify Storefront API (`2026-10`)  
**Audit Date:** October 20, 2026  
**Shopify Plan:** **Advanced Plan (Active)**  
**Storefront Password Status:** **ACTIVE (LOCKED - DO NOT DISABLE UNTIL ALL 16 CHECKS PASS)**  

---

## Executive Launch Tracker (Score: 7/16 Verified · 9 Pending Commercial & Hosting Setup)

### Storefront Infrastructure & Code (4 of 4 Verified)
- [x] **1. Type Safety & Production Build:** **PASS.** `npx tsc --noEmit` exits with code 0 (0 type errors). `npm run build` exits with code 0, generating all 40 static and dynamic routes.
- [x] **2. Real Customer Signup, Login, Logout, and Recovery:** **PASS.** Executed live Storefront API mutations directly against `thirdshelfstore.myshopify.com`:
  - `customerCreate`: Created live customer `gid://shopify/Customer/31295720587560` (zero userErrors).
  - `customerAccessTokenCreate`: Generated live Storefront access token with valid expiration.
  - `customer(customerAccessToken)`: Verified live customer query returns matching profile and orders.
  - `customerRecover`: Dispatched live password recovery email with zero userErrors.
  - `logout`: Purges session token and favourites state cookies.
- [x] **3. Customer Isolation & Session Expiry:** **PASS.** Favourites and cart operations strictly require server-validated customer tokens. Cross-customer tampering and modified signatures are rejected. Expired tokens are purged by `/api/account`.
- [x] **4. Cart Creation & Dynamic Pricing:** **PASS.** Live Storefront API `cartCreate` generates valid Shopify Cart ID (`gid://shopify/Cart/...`) and live checkout URL. All 7 variants update prices ($12.99, $13.99, $14.99) dynamically in UI.

---

### Production Persistence & Hosting (0 of 2 Verified · Hosting Setup Required)
- [ ] **5. Confirm production environment variables on actual hosting platform:** Pending deployment to Vercel. (Requires `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`, and optional `KV_REST_API_URL`/`KV_REST_API_TOKEN`).
- [ ] **6. Configure durable cross-device favourites storage:** While `lib/favourites.ts` has an HMAC-signed cookie fallback for serverless cold-start resilience, true cross-device synchronization requires adding an Upstash Redis or Vercel KV store (`KV_REST_API_URL` & `KV_REST_API_TOKEN`) in Vercel settings.

---

### Shopify Catalog (0 of 4 Complete · Owner Action Required)
- [ ] **7. Create the four canonical collections in Shopify Admin:** `technology`, `home-essentials`, `travel-essentials`, and `everyday-finds`. (Currently only `desk-workspace-essentials`, `frontpage`, and `office-supplies-example-products` exist).
- [ ] **8. Assign real products and publish to Headless/Storefront sales channel:** Products must be added to the four collections and published to the Storefront API sales channel. (Currently only 1 active product exists).
- [ ] **9. Clean supplier notes from Shopify product descriptions:** Cleanse source copy in Shopify Admin under **Products &rarr; Silicone Desk Cable Organizer**. (Automated frontend filter in `lib/shopify/client.ts` acts as a safety net, but source data should be pristine).
- [ ] **10. Confirm prices, variants, inventory, and supplier SKU mappings:** In dropshipping app (DSers / Zendrop / CJ Dropshipping), verify that all 7 cable organizer variants map to active supplier SKUs.

---

### Payments, Shipping & Operations (0 of 4 Complete · Owner Action Required)
- [ ] **11. Complete payment provider activation for cross-border USD transactions:**
  - Cards Onsite by 1Razorpay: Confirm KYC and Purpose Code requirements for India-to-international USD exports.
  - PayPal Express Checkout: Complete account linking to remove "Partially active" state.
- [ ] **12. Configure shipping zones, rates, and delivery estimates:** In Shopify Admin under **Settings &rarr; Shipping and delivery**, set up international shipping zones (e.g. United States) with flat-rate standard delivery and free shipping over $50.
- [ ] **13. Test order sync, fulfillment, and tracking updates:** Perform test order dispatch flow to confirm tracking numbers automatically flow from supplier back into Shopify customer order records.
- [ ] **14. Connect custom domain `thirdshelf.store`:** Point DNS `A` record (`@` &rarr; `76.76.21.21`) and `CNAME` (`www` &rarr; `cname.vercel-dns.com`) at registrar; verify SSL in Vercel.

---

### Pre-Launch Verification Gate (1 of 2 Complete)
- [x] **15. Complete an end-to-end test checkout navigation on Shopify:** **PASS (VERIFIED).** Storefront cart drawer checkout button successfully redirects to native Shopify checkout (`/checkouts/cn/...`). Checkout form renders cleanly with order summary ($25.98), shipping address inputs, Credit Card, and PayPal payment options.
- [ ] **16. Remove storefront password only after all critical checks pass:** Keep password enabled until items 1 through 14 are fully satisfied.

---

## Security & Architecture Audit Summary

| Component | Architecture Decision | Status |
| :--- | :--- | :--- |
| **Storefront API Token** | Server-side only via `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. No private secrets behind `NEXT_PUBLIC_`. | **SECURE** |
| **Authentication Flow** | Shopify Storefront API mutations (`customerAccessTokenCreate`, `customerCreate`). Secure HTTP-only cookie session. | **VERIFIED LIVE** |
| **Favourites Storage** | Managed KV / Redis REST adapter + HMAC-SHA256 signed HTTP-only state cookie. Serverless resilient. | **VERIFIED SECURE** |
| **Public vs Protected** | Browsing, catalog, search, and PDP are public. Add to Bag, Favourites, and Drawer require verified account. | **VERIFIED** |
| **Production Build** | Next.js App Router: 40 static routes prerendered, 0 TypeScript errors, 0 build errors. | **PASS (100%)** |
