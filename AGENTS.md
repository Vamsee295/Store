# THIRD SHELF — PERMANENT PROJECT MEMORY & BUSINESS CONSTITUTION

## 1. Project identity

**Brand:** Third Shelf  
**Business model:** Multi-category dropshipping ecommerce store  
**Primary objective:** Build a premium, trustworthy online shopping experience that converts visitors into customers.  
**Future platform:** Shopify  
**Current development approach:** Build and refine a custom storefront first, then integrate it with our Shopify store.

This is a REAL ecommerce business project, not a portfolio website, UI experiment, design-only demo or single-product landing page.

All future implementation decisions must support the long-term business objective.

## 2. Business model and product strategy

Third Shelf will sell a curated selection of products across multiple categories, including:

- Technology accessories
- Home essentials
- Travel essentials
- Everyday finds and useful lifestyle products

The catalog will evolve based on product research, supplier availability, demand, margins, shipping feasibility and customer value.

We are NOT building a store exclusively for desk cable organizers or any other single product.

Do not hardcode the entire business around one product, supplier or category.

The storefront must support adding, removing, updating and organizing products and collections without redesigning the website.

## 3. Critical business rules

These rules take priority over visual preferences.

1. Never invent products, inventory, prices, discounts, customer reviews, ratings, sales figures, shipping promises or product availability.
2. Demo data must be clearly separated from live Shopify catalog data.
3. Never imply that an illustrated product is available for purchase unless the corresponding real product exists in the catalog.
4. Category artwork communicates a category. It does not guarantee that every depicted item is stocked.
5. Every shopping CTA must lead to a meaningful destination.
6. Product pages must display accurate product information, variants, prices and availability from the configured data source.
7. Checkout must use the real Shopify checkout flow once integrated.
8. Do not collect or process real customer payments through a fabricated checkout.
9. Do not claim that an order, payment or refund succeeded unless the actual commerce platform confirms it.
10. Shipping estimates, returns, refunds, taxes and business policies must reflect verified operational details.

When information is missing, identify it as pending configuration rather than inventing an answer.

## 4. Store architecture and Shopify migration

We are developing the custom storefront before completing the Shopify integration.

The current frontend architecture is:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Three.js / React Three Fiber where justified
- GSAP
- Motion for React
- Shopify Storefront API

Preserve this established architecture unless a concrete technical reason justifies a change.

Design the application so that the frontend can later connect cleanly to Shopify.

### Data architecture

- Treat Shopify as the future source of truth for products, collections, variants, prices, availability and checkout.
- Centralize product and collection data access in a reusable service layer.
- Keep Shopify credentials in environment variables and never expose private credentials in browser code.
- Use stable Shopify product IDs and collection handles where appropriate.
- Support loading, empty, error and unavailable-product states.
- Avoid scattering sample product data throughout individual components.
- Keep demo fixtures separate from production data.
- Make switching from preview mode to live Shopify mode explicit and safe.

### Shopify integration

The long-term goal is a custom-designed storefront connected to our Shopify store, not an isolated website with a fake cart.

Before launch, verify:
- Shopify Storefront API connectivity.
- Product and collection synchronization.
- Variant selection and pricing.
- Cart behavior and checkout creation.
- Shipping rates and delivery information.
- Payment-provider approval and successful test transactions.
- Mobile checkout experience.
- Store policies and domain configuration.

Do not mark the store launch-ready until the relevant checks have actually passed.

## 5. Brand identity and design system

Third Shelf uses a premium editorial visual identity.

- Warm ivory and off-white backgrounds.
- Charcoal typography.
- Refined serif headlines paired with clean supporting typography.
- Restrained taupe, stone and muted accent colors.
- Generous whitespace.
- Intentional grid layouts.
- High-quality imagery and carefully controlled animation.
- Clear, accessible shopping interactions.

The design should feel art-directed, polished and trustworthy rather than like a generic AI-generated ecommerce template.

Avoid excessive animations, unnecessary 3D effects, decorative UI that serves no purpose, inconsistent spacing and visual clutter.

Visual quality must never come at the expense of usability, performance or conversion.

## 6. Homepage and category visuals

The homepage is designed around the message:

"Better things. Better everyday."

The homepage includes an editorial hero and a category section titled "Explore the edit."

The category section covers Technology, Home essentials, Travel and Everyday finds.

We are exploring premium 2D animated editorial illustrations for category cards instead of generic 3D product objects or photographs that imply specific inventory.

Category illustrations must:
- Clearly communicate their category.
- Use a consistent illustration style.
- Remain lightweight and responsive.
- Respect reduced-motion preferences.
- Link to their actual Shopify collections.
- Never misrepresent demo illustrations as confirmed products.

Preserve established design decisions unless there is a clear reason to improve them.

## 7. Customer conversion priorities

Every important page must help customers make confident purchasing decisions.

Prioritize:
- Clear product discovery and navigation.
- Search, filters and sorting where appropriate.
- Useful product imagery.
- Accurate product descriptions and specifications.
- Transparent pricing and shipping information.
- Visible returns and contact information.
- Trustworthy product pages.
- A simple, accessible cart and checkout journey.
- Responsive mobile design.
- Fast loading and stable layouts.

Do not add fake urgency, fabricated scarcity, invented testimonials or misleading promotional claims.

## 8. Product research and operations

Products should be added based on evidence, not aesthetic preference alone.

Before a product is approved for launch, evaluate:
- Demand and customer use case.
- Competition and differentiation.
- Actual supplier and product cost.
- Shipping cost, delivery time and tracking.
- Product quality and supplier reliability.
- Expected gross margin after relevant costs.
- Returns, damage and fulfillment risks.
- Legal, safety and market-specific requirements.
- Payment and shipping feasibility for our business.

A product shown in a design mockup is not automatically an approved product.

Maintain a clear distinction between researched candidates, supplier-verified products, imported Shopify products and products approved for sale.

## 9. Development workflow

Before making changes:

1. Inspect the existing project and relevant files.
2. Understand the current architecture and established decisions.
3. Identify the smallest appropriate implementation scope.
4. Preserve existing working functionality.
5. Implement the change rather than merely describing it.
6. Test the actual rendered interface.
7. Run relevant type checks, lint checks and production builds.
8. Check responsive behavior and accessibility.
9. Fix regressions caused by the change.
10. Report modified files, completed tests and unresolved issues honestly.

Never claim a build, integration, checkout or deployment succeeded without verifying it.

Do not overwrite configuration, remove features or introduce dependencies without a clear reason.

## 10. Deployment and launch status

The custom storefront is being developed ahead of its eventual Shopify integration.

Until explicitly verified, assume:
- Demo catalog entries are not approved inventory.
- Live Shopify synchronization may be incomplete.
- Supplier and shipping details require verification.
- Payment configuration may be pending.
- The business is not ready to accept real customer orders merely because the frontend looks complete.

Keep preview and production behavior distinct.

## 11. Instructions for all future AI agents

At the beginning of every substantial task:

- Read these project rules.
- Inspect the current code and existing implementation.
- Consider the dropshipping business model and eventual Shopify integration.
- Preserve the premium editorial identity.
- Avoid introducing fake commerce functionality.
- Prefer maintainable, reusable, production-oriented implementations.

If a requested change conflicts with accurate product availability, customer trust, secure Shopify integration or checkout integrity, prioritize business correctness and explain the conflict.

**Final guiding principle:**

Build Third Shelf as a real, scalable, multi-category dropshipping business with a premium custom storefront that can later operate through Shopify. Every design and engineering decision must support customer trust, product discoverability, maintainability and eventual real-world sales.
