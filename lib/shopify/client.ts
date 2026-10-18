import type { Product } from "@/lib/products";

const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || "2025-10";
export const shopifyConfigured = Boolean(domain && token);
const endpoint = domain ? `https://${domain}/api/${version}/graphql.json` : "";

type ShopifyResponse<T> = { data?: T; errors?: { message: string }[] };

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  if (!shopifyConfigured) return null;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token! },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`Shopify API returned ${res.status}`);
    const json = await res.json() as ShopifyResponse<T>;
    if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join("; "));
    return json.data ?? null;
  } catch (err) {
    console.error("Shopify request failed:", err);
    return null;
  }
}

const PRODUCT_FIELDS = `id handle title description availableForSale featuredImage { url altText } images(first: 5) { nodes { url altText } } variants(first: 20) { nodes { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } } } productType tags`;

export async function getProducts(): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: any[] } }>(
    `query Products { products(first: 24, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } } }`
  );
  if (!data) return (await import("@/lib/products")).demoProducts;
  return data.products.nodes.map((p: any) => {
    const v = p.variants.nodes[0];
    const category = p.productType || "Everyday";
    const image = p.featuredImage?.url || p.images.nodes[0]?.url || "";
    return {
      id:p.id, handle:p.handle, title:p.title, category, categoryHandle:category.toLowerCase().replace(/[^a-z0-9]+/g,"-"),
      price:Number(v?.price?.amount || 0), compareAt:v?.compareAtPrice ? Number(v.compareAtPrice.amount) : undefined,
      description:p.description, image, images:p.images.nodes.map((i:any)=>i.url), variantId:v?.id || "",
      available:Boolean(p.availableForSale && v?.availableForSale), tags:p.tags
    } as Product;
  });
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const data = await shopifyFetch<{ product: any | null }>(
    `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`, { handle }
  );
  if (!data) {
    const { demoProducts } = await import("@/lib/products");
    return demoProducts.find(p => p.handle === handle);
  }
  const p = data.product;
  if (!p) return undefined;
  const v = p.variants.nodes[0];
  const category = p.productType || "Everyday";
  return { id:p.id, handle:p.handle, title:p.title, category, categoryHandle:category.toLowerCase().replace(/[^a-z0-9]+/g,"-"), price:Number(v?.price?.amount || 0), compareAt:v?.compareAtPrice ? Number(v.compareAtPrice.amount) : undefined, description:p.description, image:p.featuredImage?.url || "", images:p.images.nodes.map((i:any)=>i.url), variantId:v?.id || "", available:Boolean(p.availableForSale && v?.availableForSale), tags:p.tags };
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  const data = await shopifyFetch<{ collection: { products: { nodes: any[] } } | null }>(
    `query Collection($handle: String!) { collection(handle: $handle) { products(first: 24) { nodes { ${PRODUCT_FIELDS} } } } }`, { handle }
  );
  if (!data) {
    const { demoProducts } = await import("@/lib/products");
    return demoProducts.filter(p => p.categoryHandle === handle);
  }
  const nodes = data.collection?.products.nodes || [];
  return nodes.map((p:any) => {
    const v=p.variants.nodes[0]; const category=p.productType || "Everyday";
    return {id:p.id,handle:p.handle,title:p.title,category,categoryHandle:category.toLowerCase().replace(/[^a-z0-9]+/g,"-"),price:Number(v?.price?.amount||0),compareAt:v?.compareAtPrice?Number(v.compareAtPrice.amount):undefined,description:p.description,image:p.featuredImage?.url||"",images:p.images.nodes.map((i:any)=>i.url),variantId:v?.id||"",available:Boolean(p.availableForSale&&v?.availableForSale),tags:p.tags} as Product;
  });
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[]) {
  return shopifyFetch<{ cartCreate: { cart: { id: string; checkoutUrl: string; totalQuantity: number } | null; userErrors: { message: string }[] } }>(
    `mutation CartCreate($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { id checkoutUrl totalQuantity } userErrors { message } } }`, { lines }
  );
}
export async function addCartLines(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  return shopifyFetch<{ cartLinesAdd: { cart: { id: string; checkoutUrl: string; totalQuantity: number } | null; userErrors: { message: string }[] } }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id checkoutUrl totalQuantity } userErrors { message } } }`, { cartId, lines }
  );
}

export async function customerAccessTokenCreate(input: { email: string; password: string }) {
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

export async function customerCreate(input: { firstName: string; lastName: string; email: string; password: string; acceptsMarketing?: boolean }) {
  return shopifyFetch<{
    customerCreate: {
      customer: { id: string; email: string; firstName: string; lastName: string } | null;
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

export async function getCustomer(customerAccessToken: string) {
  return shopifyFetch<{
    customer: { id: string; firstName: string; lastName: string; email: string; phone: string | null } | null;
  }>(
    `query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id firstName lastName email phone
      }
    }`,
    { customerAccessToken }
  );
}
