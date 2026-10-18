# Third Shelf — Premium multi-category Shopify storefront

A custom Next.js storefront starter for Third Shelf, using React, TypeScript, Tailwind CSS, React Three Fiber/Three.js, GSAP, Motion-ready component architecture, and Shopify Storefront API integration.

## Included
- Editorial warm-white and charcoal visual system
- Responsive multi-category homepage with selective 3D hero
- Collection, product, search-preview, cart and information pages
- Product/cart UI and Shopify checkout API route
- Shopify product/collection fetching with a clearly labelled sample-data fallback
- `.env.example`, responsive styles, reduced-motion support and setup notes

## Important status
This is a **working project scaffold**, not a live, launched store. Without Shopify credentials, the site runs in preview mode and uses sample catalog data. Demo product IDs are not real Shopify variant IDs, and checkout intentionally fails until the Storefront API is configured. Replace placeholder policies and confirm all product imagery, prices, availability, supplier arrangements, payments and shipping before launch.

## Requirements
- Node.js 20.9+ (recommended)
- A Shopify store with products/collections configured
- A Storefront API access token with the required storefront read and cart permissions

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000. The site will display a preview-mode notice if Shopify credentials are missing.

## Connect Shopify
1. In Shopify Admin, create/configure a Storefront API access token with product/collection read access and cart permissions.
2. Set `SHOPIFY_STORE_DOMAIN` to the actual `your-store.myshopify.com` domain.
3. Set `SHOPIFY_STOREFRONT_ACCESS_TOKEN` to the correct Storefront API token.
4. Set `SHOPIFY_API_VERSION` to a currently supported API version for your store.
5. Add and verify real products, collections, product types, variants, prices and inventory in Shopify.
6. Restart the app. Verify product pages and checkout URL flow with a test order before launch.

Do not commit `.env.local` or expose private Admin API credentials in browser code.

## Design and catalog
Category pages use collection handles: `technology`, `home`, `travel`, `everyday`. Create Shopify collections with matching handles or update the category configuration and links. Product type should be set sensibly in Shopify. For true live search, connect a Shopify search query instead of the current local preview search.

## Before launch checklist
- [ ] Replace sample catalog and remove any placeholder imagery/product content.
- [ ] Confirm domain, currency, market and checkout behavior.
- [ ] Confirm a payment provider approved for the merchant and target market.
- [ ] Verify supplier delivered cost, inventory, delivery estimates and order synchronization.
- [ ] Publish complete policies, support contacts and legally appropriate notices.
- [ ] Test mobile, keyboard accessibility, reduced motion, cart, variants and checkout.
- [ ] Run `npm run build` and resolve all build errors.
- [ ] Deploy to staging first; complete a real Shopify test checkout before production.

## Build
```bash
npm run build
```

## Folder overview
- `app/`: routes, pages, API route and global styling
- `components/`: header, footer, hero, product card, cart provider and purchase controls
- `lib/shopify/`: Storefront API client, product queries and cart mutations
- `lib/products.ts`: demo catalog and category configuration (preview only)
