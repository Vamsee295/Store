# THIRD SHELF — E-COMMERCE ARCHITECTURE SPECIFICATION

**Brand:** Third Shelf  
**Production Store:** `thirdshelfstore.myshopify.com`  
**Public Domain:** `https://thirdshelf.store`  
**Architecture Model:** Headless Storefront with Public Browsing & Login-Required Shopping  
**Last Updated:** October 2026  

---

## 1. Executive Summary & Core Principle

Third Shelf is a multi-category e-commerce platform built to provide an editorial, elevated shopping experience comparable to modern international commerce leaders (e.g., Amazon, Flipkart) while maintaining the bespoke aesthetic of an art-directed lifestyle publication.

### The Fundamental Rule: Public Browsing vs. Login-Required Shopping

| Customer State | Permissions & Capabilities |
| :--- | :--- |
| **Logged Out (Visitor)** | **Full Public Discovery**: Homepage, Shop All (`/collections/all`), category collections (`/collections/[handle]`), live search (`/search`), product detail pages (`/products/[handle]`), variant inspect, pricing, photo galleries, brand story, FAQs, and policies. **Zero barriers to exploration.** |
| **Gated Actions** | **Login Interception**: Attempting to click **"Add to bag"**, **"Save to favourites"**, opening the **Cart Drawer**, navigating to `/cart`, or accessing `/account` seamlessly redirects to `/login` or `/signup` with a context-aware banner explaining why authentication is needed. The user's intended action (product handle, variant ID, quantity) is safely preserved and automatically executed upon authentication. |
| **Logged In (Customer)** | **Full Shopping Privileges**: Persistent Shopify-backed cart, cross-session customer-isolated favourites (`/account/favourites`), variant selection, order notes, real-time Shopify checkout redirect with `buyerIdentity` binding, verified order history, and saved address management. |

---

## 2. System Architecture & Component Mapping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CUSTOMER BROWSER / CLIENT LAYER                       │
│  Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS · Motion      │
└──────────────────┬───────────────────────────────────────┬──────────────────┘
                   │                                       │
         (Public Browsing)                        (Protected Actions)
                   │                                       │
                   ▼                                       ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
│     PUBLIC STOREFRONT DATA LAYER     │  │   AUTH & CUSTOMER CONTEXT LAYER   │
│  - /products/[handle]                │  │  - AuthProvider (useAuth)         │
│  - /collections/[handle]             │  │  - CartProvider (useCart)         │
│  - /search                           │  │  - Pending Action Resumption      │
└──────────────────┬───────────────────┘  └────────────────┬──────────────────┘
                   │                                       │
                   │                                       ▼
                   │                      ┌───────────────────────────────────┐
                   │                      │    NEXT.JS SECURE ROUTE HANDLERS  │
                   │                      │  - /api/auth/* (login, signup)    │
                   │                      │  - /api/cart (customer bound)     │
                   │                      │  - /api/account (orders/address)  │
                   │                      │  - /api/account/favourites        │
                   │                      └────────────────┬──────────────────┘
                   │                                       │
                   ▼                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SHOPIFY COMMERCE ENGINE (AUTHORITY)                      │
│  Storefront API (GraphQL) · Catalog · Inventory · Pricing · Checkout API    │
│  Customer Accounts API · Carrier Shipping · Payment Gateways · Orders       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Ownership & Source of Truth

To ensure absolute commercial integrity and prevent data drift, ownership is strictly partitioned:

| Feature / Domain | Authoritative Source of Truth | Storage & Implementation Mechanism |
| :--- | :--- | :--- |
| **Catalog & Products** | **Shopify** | Storefront API `products` & `product(handle:)`. Sanitized on ingest. |
| **Variant Pricing & Compare-at** | **Shopify** | Authoritative in Shopify. Never trusted from browser inputs. |
| **Stock & Availability** | **Shopify** | Real-time `availableForSale` and `quantityAvailable`. |
| **Collections & Categories** | **Shopify** | Canonical handles (`technology`, `home-essentials`, `travel`, `everyday-finds`). |
| **Shopping Cart Line Items** | **Shopify Cart API** | Server-side `cartCreate` / `cartLinesAdd` with `buyerIdentity`. |
| **Checkout & Payments** | **Shopify Checkout** | SSL-encrypted Shopify checkout URL; zero raw card data stored. |
| **Order History & Status** | **Shopify Orders** | Storefront API `customer.orders` retrieved via customer access token. |
| **Customer Identity & Sessions** | **Shopify Customer API** | Storefront API `customerAccessTokenCreate`; HTTP-only cookie. |
| **Customer Favourites (Wishlist)**| **Customer Data Store** | Server-side isolated store (`lib/favourites.ts`) keyed by Customer GID. |
| **Saved Shipping Addresses** | **Shopify** | Storefront API `customerAddressCreate` / `customerAddressUpdate`. |
| **Store Policies** | **Storefront Code / Shopify** | Editorial policy pages (`/pages/shipping`, `/pages/returns`, etc.). |

---

## 4. Authentication & Session Architecture

### Customer Account Integration
- **Protocol:** Shopify Storefront API Customer Access Token.
- **Session Transport:** HTTP-only, `SameSite=Lax`, `Secure` (production) cookie named `third_shelf_customer_token`.
- **Token Lifecycle:** 30-day sliding expiration. Verified server-side via `getCustomer(token)` on protected mutations.
- **Auto-Login on Signup:** When a customer registers via `/api/auth/signup`, `customerCreate` is executed followed immediately by `customerAccessTokenCreate`. If Shopify accepts the credentials, the session cookie is set instantly, returning the customer to their product without a redundant login prompt.

### Return URL & Pending Action Mechanism
When an unauthenticated visitor clicks "Add to bag" or "Save to favourites":
1. The client intercepts the event and builds a safe, sanitized return target:
   `redirectTo=/products/silicone-cable-organizer?action=add_to_cart&variantId=demo-cable-warm-stone&quantity=1`
2. The user is navigated to:
   `/login?redirectTo=${encodeURIComponent(target)}&reason=cart`
3. `/login` and `/signup` render an editorial reassurance banner:
   *"Account required to shop. Please sign in or create an account to add items to your shopping bag. We'll return you right back to your item."*
4. Open Redirect Protection: `safeRedirectPath` strictly enforces relative paths starting with `/` and rejects protocol schemes (`://`), double slashes (`//`), or backslashes (`\`).
5. Upon successful authentication, the user is returned to the exact product page.
6. The `ProductDetailView` component detects the `action` parameter, validates the variant, executes the action exactly once, displays a confirmation toast (*"Welcome back! Added to your shopping bag."*), and clears the query parameters via `window.history.replaceState`.

---

## 5. Favourites (Wishlist) Architecture

### Design Requirements
- Customer-isolated: Customer A cannot see, access, or modify Customer B's saved pieces.
- Cross-session persistence: Favourites remain preserved across page reloads and device logins.
- Catalog validation: Favourites are resolved against current catalog data; discontinued pieces display appropriate sold-out badges.

### Implementation Details
- **Module:** `lib/favourites.ts`
- **Storage:** Server-side JSON storage engine in `data/customer_favourites.json`, partitioned strictly by Shopify Customer GID (`gid://shopify/Customer/...`).
- **Endpoints:**
  - `GET /api/account/favourites` — Verifies customer session; resolves product details for saved handles.
  - `POST /api/account/favourites` — Adds handle to customer's set; returns updated count.
  - `DELETE /api/account/favourites` — Removes handle; returns updated count.
- **Interface:** `/account/favourites` rendered inside the Customer Sanctuary layout with direct "View piece" and "Add to bag" capabilities.

---

## 6. Cart & Checkout Architecture

### Gated Cart Security
- Unauthenticated visitors have no local shopping bag (`lines = []`, `count = 0`).
- Clicking the header cart icon when logged out redirects to `/login?redirectTo=/cart&reason=cart`.
- Navigating directly to `/cart` renders an editorial sign-in gate explaining that shopping bags are preserved to customer accounts.
- `app/api/cart/route.ts` strictly enforces customer authentication on all `POST`, `PATCH`, and `DELETE` mutations. Anonymous requests return `401 Unauthorized`.

### Shopify Cart & Checkout Handshake
1. Customer clicks "Add to bag" while authenticated.
2. Item variant and quantity are committed to the client-side `CartProvider` and synchronized with Shopify via `POST /api/cart`.
3. `POST /api/cart` passes `buyerIdentity: { customerAccessToken: token }` to Shopify's `cartCreate` mutation.
4. Shopify binds the cart to the authenticated customer's Shopify account and returns an authoritative `checkoutUrl`.
5. On `/cart` or in `CartDrawer`, clicking "Continue to Checkout" navigates directly to Shopify's secure SSL checkout URL.
6. Shopify calculates authoritative shipping rates, tax obligations, applicable discount codes, and processes payment.

---

## 7. Security Boundaries & Protections

1. **Token Secrecy:** Private secrets (Shopify Admin API tokens, webhook signing keys, session secrets) never appear in client bundles or public repositories.
2. **Server-Side Storefront Token Proxying:** The Storefront API token (`SHOPIFY_STOREFRONT_ACCESS_TOKEN`) is maintained strictly server-side in Next.js Server Components and Route Handlers. No credentials or customer tokens are ever exposed via client-side public bundles.
3. **No Payment Card Storage:** Zero credit card numbers, CVVs, or expiration dates are collected or stored in the Next.js database. All payment processing is delegated to Shopify's Level 1 PCI DSS-compliant checkout.
4. **Content Sanitization:** `sanitizeProductDescription()` strips raw supplier notes, wholesale MOQ notes, and supplier contact details from incoming Shopify product descriptions.
5. **Open Redirect Prevention:** All authentication redirects are validated against local relative URI rules.
6. **Serverless-Durable Favourites Storage:** Favourites storage is decoupled from ephemeral container disk via managed KV/Redis support and tamper-proof HMAC-SHA256 signed session state cookies.

---

## 8. Required Environment Variables

All secrets are managed in `.env.local` (excluded by `.gitignore`). A safe template with empty placeholders is maintained in `.env.example`.

| Variable Name | Exposure | Purpose |
| :--- | :--- | :--- |
| `SHOPIFY_STORE_DOMAIN` | Server | Shopify shop domain (`thirdshelfstore.myshopify.com`) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Server | Storefront API token for server-side queries and mutations |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Client/Server | Public domain reference |
| `NEXT_PUBLIC_SITE_URL` | Client/Server | Canonical URL (`https://thirdshelf.store`) |
| `SHOPIFY_REVALIDATE_SECONDS` | Server | Cache revalidation interval (default: 60) |
| `REVALIDATE_SECRET` | Server | Webhook validation key for on-demand revalidation |
| `KV_REST_API_URL` | Server (Optional) | Vercel KV / Upstash Redis REST endpoint for distributed favourites |
| `KV_REST_API_TOKEN` | Server (Optional) | Vercel KV / Upstash Redis REST bearer token |
| `FAVOURITES_SIGNING_SECRET` | Server (Optional) | Secret key for signing serverless customer favourites cookies |

---

## 9. Deployment & Production Verification

- **Node.js Target:** Node 18+ / 20+ / 22+
- **Build Output:** 100% Next.js App Router standalone or Vercel edge deployment.
- **Route Distribution:** 40 prerendered static routes and optimized dynamic SSR endpoints for catalog, product pages, and customer accounts.
