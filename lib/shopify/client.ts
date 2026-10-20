import type { Product, ProductVariant } from "@/lib/products";
import { getServerShopifyCredentials } from "@/lib/env";

const { domain, token, apiVersion: version, revalidateSeconds: defaultRevalidate, isConfigured } = getServerShopifyCredentials();
export const shopifyConfigured = isConfigured;
const endpoint = domain ? `https://${domain}/api/${version}/graphql.json` : "";

type ShopifyResponse<T> = { data?: T; errors?: { message: string }[] };

export interface ShopifyFetchOptions {
  tags?: string[];
  revalidate?: number;
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options?: ShopifyFetchOptions
): Promise<T | null> {
  if (!shopifyConfigured) return null;
  try {
    const revalidateSeconds = options?.revalidate ?? defaultRevalidate;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: revalidateSeconds,
        tags: Array.from(new Set(["shopify", ...(options?.tags ?? [])])),
      },
    });

    if (!res.ok) {
      console.warn(`Shopify API responded with status ${res.status}`);
      return null;
    }

    const json = (await res.json()) as ShopifyResponse<T>;
    if (json.errors?.length) {
      console.warn("Shopify GraphQL notices:", json.errors.map((e) => e.message).join("; "));
      // Genuinely fatal error: no data object returned at all
      if (!json.data) {
        return null;
      }
    }
    return json.data ?? null;
  } catch (err) {
    console.warn("Shopify request failed (reverting to resilient fallback):", err);
    return null;
  }
}

export const COLLECTION_HANDLE_ALIASES: Record<string, string[]> = {
  technology: ["technology", "tech", "technology-accessories", "desk-workspace-essentials"],
  "home-essentials": ["home-essentials", "home", "home-living", "desk-workspace-essentials"],
  home: ["home", "home-essentials", "home-living", "desk-workspace-essentials"],
  travel: ["travel", "travel-essentials", "transit"],
  "everyday-finds": ["everyday-finds", "everyday", "lifestyle", "frontpage", "office-supplies-example-products"],
  everyday: ["everyday", "everyday-finds", "lifestyle", "frontpage", "office-supplies-example-products"],
  "desk-workspace-essentials": ["desk-workspace-essentials", "technology", "home-essentials", "home"],
  all: ["all", "everything", "complete-collection"],
};

export function getCandidateCollectionHandles(handle: string): string[] {
  const normalized = handle.toLowerCase();
  const directMatch = COLLECTION_HANDLE_ALIASES[normalized];
  if (directMatch) {
    return Array.from(new Set([normalized, ...directMatch]));
  }
  // Check if normalized matches any alias value
  for (const [canonical, aliases] of Object.entries(COLLECTION_HANDLE_ALIASES)) {
    if (aliases.includes(normalized)) {
      return Array.from(new Set([normalized, canonical, ...aliases]));
    }
  }
  return [normalized];
}

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  featuredImage { url altText width height }
  images(first: 20) { nodes { url altText width height } }
  options { name values }
  variants(first: 50) {
    nodes {
      id
      title
      availableForSale
      selectedOptions { name value }
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      image { url altText width height }
    }
  }
  collections(first: 10) {
    nodes {
      id
      handle
      title
    }
  }
  productType
  tags
  seo { title description }
`;

function sanitizeProductDescription(raw: string): string {
  if (!raw) return "";
  const clean = raw
    .replace(/Questions about an option\? Contact [^\s]+ before ordering\./gi, "")
    .replace(/The [“"]White set[”"] option is listed separately; its package contents still need supplier confirmation\./gi, "")
    .replace(/[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook)\.[a-zA-Z]{2,}/gi, "care@thirdshelf.store")
    // Fix missing spaces after punctuation (e.g. "desk.Choose" -> "desk. Choose")
    .replace(/([a-z0-9])\.([A-Z])/g, "$1. $2")
    // Fix run-on phrases like "selectionChoose" -> "selection. Choose"
    .replace(/selectionChoose/gi, "selection. Choose")
    // Format bullet specs cleanly
    .replace(/organizer Material:/gi, "organizer.\n\n• Material:")
    .replace(/Slot options:/gi, "\n• Slot options:")
    .replace(/Colours:/gi, "\n• Colours:")
    .replace(/Check your selection/gi, "\n\nCheck your selection")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
  return clean;
}

function formatShopifyProduct(p: any): Product {
  const variantNodes = p.variants?.nodes || [];
  const primaryVariant = variantNodes[0];
  const category = p.productType || "Everyday";
  const featuredImg = p.featuredImage?.url || p.images?.nodes?.[0]?.url || "";
  const featuredAlt = p.featuredImage?.altText || p.title || "";
  const allImageNodes = p.images?.nodes || [];
  const allImages = allImageNodes.map((i: any) => i.url);
  const gallery = allImageNodes.map((i: any) => ({
    url: i.url,
    altText: i.altText || p.title,
    width: i.width,
    height: i.height,
  }));

  const mappedVariants: ProductVariant[] = variantNodes.map((v: any) => {
    const colorOpt = v.selectedOptions?.find(
      (o: any) =>
        o.name.toLowerCase().includes("color") ||
        o.name.toLowerCase().includes("colour")
    );
    const sizeOpt = v.selectedOptions?.find(
      (o: any) =>
        o.name.toLowerCase().includes("size") ||
        o.name.toLowerCase().includes("dimension")
    );

    return {
      id: v.id,
      title: v.title,
      color: colorOpt?.value,
      size: sizeOpt?.value,
      price: Number(v.price?.amount || 0),
      compareAt: v.compareAtPrice ? Number(v.compareAtPrice.amount) : undefined,
      available: Boolean(v.availableForSale),
      quantityAvailable: v.quantityAvailable ?? undefined,
      image: v.image ? { url: v.image.url, altText: v.image.altText || v.title } : undefined,
    };
  });

  const productCollections = (p.collections?.nodes || []).map((c: any) => ({
    id: c.id,
    handle: c.handle,
    title: c.title,
  }));

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    category,
    categoryHandle: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    price: Number(primaryVariant?.price?.amount || 0),
    compareAt: primaryVariant?.compareAtPrice
      ? Number(primaryVariant.compareAtPrice.amount)
      : undefined,
    description: sanitizeProductDescription(p.description || ""),
    image: featuredImg,
    imageAlt: featuredAlt,
    images: allImages.length ? allImages : featuredImg ? [featuredImg] : [],
    gallery: gallery.length ? gallery : featuredImg ? [{ url: featuredImg, altText: featuredAlt }] : [],
    variantId: primaryVariant?.id || "",
    available: Boolean(p.availableForSale && primaryVariant?.availableForSale),
    tags: p.tags || [],
    variants: mappedVariants.length ? mappedVariants : undefined,
    collections: productCollections.length ? productCollections : undefined,
  };
}

export async function getProducts(options?: {
  first?: number;
  after?: string;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<Product[]> {
  const first = options?.first ?? 48;
  const sortKey = options?.sortKey ?? "BEST_SELLING";
  const reverse = options?.reverse ?? false;
  const queryStr = options?.query;

  const data = await shopifyFetch<{
    products: {
      nodes: any[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  }>(
    `query Products($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
        pageInfo { hasNextPage endCursor }
        nodes { ${PRODUCT_FIELDS} }
      }
    }`,
    { first, after: options?.after, query: queryStr, sortKey, reverse },
    { tags: ["products"] }
  );

  if (!data?.products?.nodes?.length) {
    if (shopifyConfigured) {
      return [];
    }
    const { demoProducts } = await import("@/lib/products");
    return demoProducts;
  }

  return data.products.nodes.map(formatShopifyProduct);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const data = await shopifyFetch<{ product: any | null }>(
    `query Product($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FIELDS}
      }
    }`,
    { handle },
    { tags: [`product-${handle}`] }
  );

  if (!data?.product) {
    if (shopifyConfigured) {
      return undefined;
    }
    const { demoProducts } = await import("@/lib/products");
    return demoProducts.find((p) => p.handle === handle);
  }

  return formatShopifyProduct(data.product);
}

export interface CollectionWithProductsResult {
  collection: {
    id: string;
    handle: string;
    title: string;
    description: string;
    image?: { url: string; altText?: string } | null;
  } | null;
  products: Product[];
}

export async function getCollectionWithProducts(
  handle: string
): Promise<CollectionWithProductsResult> {
  if (handle === "all") {
    const products = await getProducts();
    return {
      collection: {
        id: "all",
        handle: "all",
        title: "The complete collection.",
        description:
          "Thoughtfully selected finds across technology, home, travel, and everyday living. Built to earn their place.",
      },
      products,
    };
  }

  const candidateHandles = getCandidateCollectionHandles(handle);

  if (shopifyConfigured) {
    for (const candidate of candidateHandles) {
      const data = await shopifyFetch<{
        collection: {
          id: string;
          handle: string;
          title: string;
          description: string;
          image?: { url: string; altText?: string } | null;
          products: { nodes: any[] };
        } | null;
      }>(
        `query CollectionDetails($handle: String!) {
          collection(handle: $handle) {
            id
            handle
            title
            description
            image { url altText }
            products(first: 50) {
              nodes { ${PRODUCT_FIELDS} }
            }
          }
        }`,
        { handle: candidate },
        { tags: [`collection-${candidate}`, "collections"] }
      );

      if (data?.collection) {
        const products = (data.collection.products?.nodes || []).map(formatShopifyProduct);
        return {
          collection: {
            id: data.collection.id,
            handle: data.collection.handle,
            title: data.collection.title,
            description: data.collection.description,
            image: data.collection.image,
          },
          products,
        };
      }
    }

    // Collection not found in Shopify; return empty result without demo substitution
    return {
      collection: null,
      products: [],
    };
  }

  // Preview / Demo fallback when Shopify is not configured
  const { demoProducts, categories } = await import("@/lib/products");
  const cat = categories.find((c) => candidateHandles.includes(c.handle));
  const products = demoProducts.filter((p) => candidateHandles.includes(p.categoryHandle));

  return {
    collection: cat
      ? {
          id: `demo-${cat.handle}`,
          handle: cat.handle,
          title: cat.title,
          description: cat.subtitle,
        }
      : null,
    products,
  };
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  const res = await getCollectionWithProducts(handle);
  return res.products;
}

export async function getCollections(): Promise<
  Array<{ id: string; handle: string; title: string; description: string; image?: { url: string; altText?: string } | null }>
> {
  const data = await shopifyFetch<{
    collections: { nodes: any[] };
  }>(
    `query Collections {
      collections(first: 30) {
        nodes {
          id
          handle
          title
          description
          image { url altText }
        }
      }
    }`,
    {},
    { tags: ["collections"] }
  );

  if (!data?.collections?.nodes?.length) {
    return [
      { id: "col-tech", handle: "technology", title: "Technology", description: "Useful tools for focus and modern workspace rituals." },
      { id: "col-home", handle: "home", title: "Home Essentials", description: "Sculptural tabletop vessels and living space anchors." },
      { id: "col-travel", handle: "travel", title: "Travel", description: "Featherlight packing organizers and transit gear." },
      { id: "col-everyday", handle: "everyday", title: "Everyday Finds", description: "Considered everyday carry accessories and vessels." },
    ];
  }

  return data.collections.nodes;
}

/* ==============================================================================
   CART MUTATIONS & SESSION MANAGEMENT
   ============================================================================== */

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[],
  note?: string,
  buyerIdentity?: { customerAccessToken?: string; email?: string }
) {
  return shopifyFetch<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        cost: {
          subtotalAmount: { amount: string; currencyCode: string };
          totalAmount: { amount: string; currencyCode: string };
        };
      } | null;
      userErrors: { message: string }[];
    };
  }>(
    `mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
        }
        userErrors { message }
      }
    }`,
    {
      input: {
        lines,
        note: note || undefined,
        buyerIdentity: buyerIdentity || undefined,
      },
    }
  );
}

export async function getCart(cartId: string) {
  return shopifyFetch<{
    cart: {
      id: string;
      checkoutUrl: string;
      totalQuantity: number;
      note: string | null;
      cost: {
        subtotalAmount: { amount: string; currencyCode: string };
        totalAmount: { amount: string; currencyCode: string };
      };
      lines: {
        nodes: Array<{
          id: string;
          quantity: number;
          cost: { totalAmount: { amount: string; currencyCode: string } };
          merchandise: {
            id: string;
            title: string;
            price: { amount: string };
            image?: { url: string };
            product: { id: string; handle: string; title: string };
          };
        }>;
      };
    } | null;
  }>(
    `query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        note
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 50) {
          nodes {
            id
            quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount }
                image { url }
                product { id handle title }
              }
            }
          }
        }
      }
    }`,
    { cartId }
  );
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
) {
  return shopifyFetch<{
    cartLinesAdd: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { message: string }[];
    };
  }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl totalQuantity }
        userErrors { message }
      }
    }`,
    { cartId, lines }
  );
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
) {
  return shopifyFetch<{
    cartLinesUpdate: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { message: string }[];
    };
  }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl totalQuantity }
        userErrors { message }
      }
    }`,
    { cartId, lines }
  );
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  return shopifyFetch<{
    cartLinesRemove: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { message: string }[];
    };
  }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { id checkoutUrl totalQuantity }
        userErrors { message }
      }
    }`,
    { cartId, lineIds }
  );
}

export async function updateCartNote(cartId: string, note: string) {
  return shopifyFetch<{
    cartNoteUpdate: {
      cart: { id: string; note: string } | null;
      userErrors: { message: string }[];
    };
  }>(
    `mutation CartNoteUpdate($cartId: ID!, $note: String) {
      cartNoteUpdate(cartId: $cartId, note: $note) {
        cart { id note }
        userErrors { message }
      }
    }`,
    { cartId, note }
  );
}

/* ==============================================================================
   CUSTOMER AUTHENTICATION & ACCESS TOKEN MUTATIONS
   ============================================================================== */

export async function customerAccessTokenCreate(input: {
  email: string;
  password: string;
}) {
  return shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: { code: string; field: string[]; message: string }[];
    };
  }>(
    `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code field message }
      }
    }`,
    { input }
  );
}

export async function customerAccessTokenRenew(customerAccessToken: string) {
  return shopifyFetch<{
    customerAccessTokenRenew: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(
    `mutation customerAccessTokenRenew($customerAccessToken: String!) {
      customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
        customerAccessToken { accessToken expiresAt }
        userErrors { field message }
      }
    }`,
    { customerAccessToken }
  );
}

export async function customerCreate(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptsMarketing?: boolean;
}) {
  return shopifyFetch<{
    customerCreate: {
      customer: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      } | null;
      customerUserErrors: { code: string; field: string[]; message: string }[];
    };
  }>(
    `mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id email firstName lastName }
        customerUserErrors { code field message }
      }
    }`,
    { input }
  );
}

export async function customerRecover(email: string) {
  return shopifyFetch<{
    customerRecover: {
      customerUserErrors: { code: string; field: string[]; message: string }[];
    };
  }>(
    `mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors { code field message }
      }
    }`,
    { email }
  );
}

/* ==============================================================================
   CUSTOMER PROFILE, ADDRESS BOOK & ORDERS
   ============================================================================== */

export interface CustomerOrderLineItem {
  title: string;
  quantity: number;
  variant?: {
    title: string;
    price: { amount: string };
    image?: { url: string };
  } | null;
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: {
    nodes: CustomerOrderLineItem[];
  };
}

export interface CustomerAddress {
  id?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt?: string;
  defaultAddress?: CustomerAddress | null;
  addresses?: {
    nodes: CustomerAddress[];
  };
  orders?: {
    nodes: CustomerOrder[];
  };
}

export async function getCustomer(customerAccessToken: string) {
  return shopifyFetch<{
    customer: CustomerProfile | null;
  }>(
    `query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        createdAt
        defaultAddress {
          id
          address1
          address2
          city
          province
          zip
          country
          phone
        }
        addresses(first: 10) {
          nodes {
            id
            address1
            address2
            city
            province
            zip
            country
            phone
          }
        }
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice { amount currencyCode }
            lineItems(first: 10) {
              nodes {
                title
                quantity
                variant {
                  title
                  price { amount }
                  image { url }
                }
              }
            }
          }
        }
      }
    }`,
    { customerAccessToken }
  );
}

export async function customerAddressCreate(
  customerAccessToken: string,
  address: CustomerAddress
) {
  return shopifyFetch<{
    customerAddressCreate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: { code: string; field: string[]; message: string }[];
    };
  }>(
    `mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress { id address1 address2 city province zip country phone }
        customerUserErrors { code field message }
      }
    }`,
    { customerAccessToken, address }
  );
}

export async function customerAddressUpdate(
  customerAccessToken: string,
  id: string,
  address: CustomerAddress
) {
  return shopifyFetch<{
    customerAddressUpdate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: { code: string; field: string[]; message: string }[];
    };
  }>(
    `mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress { id address1 address2 city province zip country phone }
        customerUserErrors { code field message }
      }
    }`,
    { customerAccessToken, id, address }
  );
}

export async function customerAddressDelete(
  customerAccessToken: string,
  id: string
) {
  return shopifyFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: { code: string; field: string[]; message: string }[];
    };
  }>(
    `mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
        customerUserErrors { code field message }
      }
    }`,
    { customerAccessToken, id }
  );
}

export async function customerDefaultAddressUpdate(
  customerAccessToken: string,
  addressId: string
) {
  return shopifyFetch<{
    customerDefaultAddressUpdate: {
      customer: { id: string } | null;
      customerUserErrors: { code: string; field: string[]; message: string }[];
    };
  }>(
    `mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
      customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
        customer { id }
        customerUserErrors { code field message }
      }
    }`,
    { customerAccessToken, addressId }
  );
}
