export type ProductImageItem = {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  color?: string;
  colorHex?: string;
  size?: string;
  price: number;
  compareAt?: number;
  available: boolean;
  quantityAvailable?: number;
  image?: { url: string; altText?: string };
};

export type ProductSpec = {
  materials: string;
  dimensions: string;
  weight: string;
  care: string;
  shipping: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  category: string;
  categoryHandle: string;
  price: number;
  compareAt?: number;
  description: string;
  image: string;
  imageAlt?: string;
  images: string[];
  gallery?: ProductImageItem[];
  badge?: string;
  variantId: string;
  available: boolean;
  tags: string[];
  stockCount?: number;
  variants?: ProductVariant[];
  specs?: ProductSpec;
  collections?: { id: string; handle: string; title: string }[];
};

const img = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const demoProducts: Product[] = [
  {
    id: "demo-cable",
    handle: "silicone-cable-organizer",
    title: "Cable Organizer Set",
    category: "Technology",
    categoryHandle: "technology",
    price: 14.99,
    description: "A considered little fix for the cables that never stay where you left them. Compact, weighted silicone with magnetic channels made for a calmer workspace.",
    image: img("photo-1519389950473-47ba0277781c"),
    images: [img("photo-1519389950473-47ba0277781c"), img("photo-1498050108023-c5249f4df085")],
    badge: "Everyday essential",
    variantId: "demo-cable-warm-stone",
    available: true,
    tags: ["desk", "organization", "tech"],
    stockCount: 14,
    variants: [
      { id: "demo-cable-warm-stone", title: "Warm Stone", color: "Warm Stone", colorHex: "#ded4c4", price: 14.99, available: true },
      { id: "demo-cable-charcoal", title: "Charcoal Slate", color: "Charcoal Slate", colorHex: "#2b2a27", price: 14.99, available: true },
      { id: "demo-cable-clay", title: "Muted Terracotta", color: "Muted Terracotta", colorHex: "#b4836d", price: 16.99, available: true }
    ],
    specs: {
      materials: "High-density food-grade silicone dock, embedded zinc-alloy micro counterweight, and neodymium magnetic collar clips.",
      dimensions: "Dock: 120 mm × 32 mm × 18 mm. Magnetic collar diameter: 14 mm.",
      weight: "165 grams (weighted to resist cable drag).",
      care: "Wipe with a damp microfibre cloth. Avoid harsh solvent cleaners.",
      shipping: "Dispatches within 24–48 hours. Standard courier transit 3–5 business days."
    }
  },
  {
    id: "demo-stand",
    handle: "minimal-device-stand",
    title: "Minimal Device Stand",
    category: "Technology",
    categoryHandle: "technology",
    price: 24.00,
    description: "A clean, stable home for the device you reach for every day. Sculpted from bead-blasted aluminum designed to keep your desk feeling intentional.",
    image: img("photo-1517336714731-489689fd1ca8"),
    images: [img("photo-1517336714731-489689fd1ca8")],
    variantId: "demo-stand-matte-black",
    available: true,
    tags: ["desk", "tech"],
    stockCount: 8,
    variants: [
      { id: "demo-stand-matte-black", title: "Anodized Charcoal", color: "Anodized Charcoal", colorHex: "#252522", price: 24.00, available: true },
      { id: "demo-stand-silver", title: "Natural Silver", color: "Natural Silver", colorHex: "#d1cec7", price: 24.00, available: true },
      { id: "demo-stand-champagne", title: "Soft Brass", color: "Soft Brass", colorHex: "#c8b38c", price: 28.00, available: false }
    ],
    specs: {
      materials: "Single-piece CNC-machined aerospace aluminum with precision bevels and non-marking silicone feet.",
      dimensions: "Base: 95 mm × 82 mm. Elevation angle: 60° ergonomic viewing tilt.",
      weight: "210 grams.",
      care: "Dust with a dry soft cloth. Clean with gentle glass or screen cleaner if required.",
      shipping: "Dispatches within 24–48 hours. Delivered in protective recycled cardboard packaging."
    }
  },
  {
    id: "demo-organizer",
    handle: "modular-drawer-organizer",
    title: "Modular Drawer Organizer",
    category: "Home",
    categoryHandle: "home",
    price: 19.50,
    description: "Bring order to everyday drawers with tactile compartments for the small tools and stationery that tend to wander.",
    image: img("photo-1618221195710-dd6b41faaea6"),
    images: [img("photo-1618221195710-dd6b41faaea6")],
    variantId: "demo-organizer-taupe",
    available: true,
    tags: ["home", "storage"],
    stockCount: 22,
    variants: [
      { id: "demo-organizer-taupe", title: "Taupe Felt", color: "Taupe Felt", colorHex: "#b8ada0", price: 19.50, available: true },
      { id: "demo-organizer-oatmeal", title: "Oatmeal", color: "Oatmeal", colorHex: "#e3ded4", price: 19.50, available: true }
    ],
    specs: {
      materials: "Molded recycled PET acoustic felt with natural cork base dampening.",
      dimensions: "Set includes: 1 Large (240 × 160 mm), 2 Medium (160 × 120 mm), 2 Small (80 × 80 mm).",
      weight: "340 grams total set.",
      care: "Spot clean with mild wool detergent or lint roll as needed.",
      shipping: "Dispatches within 24 hours. Carbon-neutral parcel delivery."
    }
  },
  {
    id: "demo-travel",
    handle: "travel-packing-cubes",
    title: "Travel Packing Cubes",
    category: "Travel",
    categoryHandle: "travel",
    price: 28.00,
    description: "A more considered way to pack, compress, and find what you need on the move. Water-resistant recycled ripstop with YKK zippers.",
    image: img("photo-1500530855697-b586d89ba3ee"),
    images: [img("photo-1500530855697-b586d89ba3ee")],
    variantId: "demo-travel-sage",
    available: true,
    tags: ["travel", "organizer"],
    stockCount: 11,
    variants: [
      { id: "demo-travel-sage", title: "Moss Olive", color: "Moss Olive", colorHex: "#5b6655", price: 28.00, available: true },
      { id: "demo-travel-slate", title: "Deep Slate", color: "Deep Slate", colorHex: "#353d42", price: 28.00, available: true },
      { id: "demo-travel-sand", title: "Dune Sand", color: "Dune Sand", colorHex: "#d5c9b6", price: 28.00, available: true }
    ],
    specs: {
      materials: "100% post-consumer recycled 210D ripstop nylon, water-repellent DWR coating, double-slider YKK coil zips.",
      dimensions: "Set of 3: Small (20 × 15 × 8 cm), Medium (30 × 20 × 10 cm), Large (38 × 28 × 10 cm).",
      weight: "185 grams combined.",
      care: "Hand wash in cool water; air dry in shade. Do not machine dry.",
      shipping: "Dispatches within 24–48 hours."
    }
  },
  {
    id: "demo-bottle",
    handle: "everyday-water-bottle",
    title: "Everyday Bottle",
    category: "Everyday",
    categoryHandle: "everyday",
    price: 22.00,
    description: "A simple everyday companion for desk days, commutes, and weekends away. Double-walled vacuum insulation keeping cold drinks crisp for 24 hours.",
    image: img("photo-1602143407151-7111542de6e8"),
    images: [img("photo-1602143407151-7111542de6e8")],
    variantId: "demo-bottle-stone",
    available: true,
    tags: ["everyday", "lifestyle"],
    stockCount: 19,
    variants: [
      { id: "demo-bottle-stone", title: "Chalk Stone 600ml", size: "600ml", color: "Chalk Stone", colorHex: "#ded7cc", price: 22.00, available: true },
      { id: "demo-bottle-charcoal", title: "Charcoal 600ml", size: "600ml", color: "Charcoal", colorHex: "#292826", price: 22.00, available: true },
      { id: "demo-bottle-stone-large", title: "Chalk Stone 850ml", size: "850ml", color: "Chalk Stone", colorHex: "#ded7cc", price: 26.00, available: true }
    ],
    specs: {
      materials: "18/8 pro-grade stainless steel interior, powder-coated exterior, BPA-free silicone seal.",
      dimensions: "Diameter: 74 mm. Height: 235 mm. Capacity: 600 ml / 20 oz.",
      weight: "295 grams empty.",
      care: "Bottle hand wash recommended. Cap dishwasher safe on top rack.",
      shipping: "Dispatches within 24 hours."
    }
  },
  {
    id: "demo-pouch",
    handle: "daily-carry-pouch",
    title: "Daily Carry Pouch",
    category: "Travel",
    categoryHandle: "travel",
    price: 18.00,
    description: "Keep cables, chargers, keys, and transit passes organized in a compact pouch that easily moves from desk to backpack.",
    image: img("photo-1553062407-98eeb64c6a62"),
    images: [img("photo-1553062407-98eeb64c6a62")],
    variantId: "demo-pouch-tan",
    available: true,
    tags: ["travel", "everyday"],
    stockCount: 16,
    variants: [
      { id: "demo-pouch-tan", title: "Washed Canvas Tan", color: "Canvas Tan", colorHex: "#c5ab8c", price: 18.00, available: true },
      { id: "demo-pouch-black", title: "Waxed Canvas Coal", color: "Canvas Coal", colorHex: "#202020", price: 18.00, available: true }
    ],
    specs: {
      materials: "14 oz heavyweight cotton canvas with organic beeswax coating, brass zipper teeth, pull tab.",
      dimensions: "210 mm × 140 mm × 45 mm.",
      weight: "95 grams.",
      care: "Spot clean with cold water. Re-wax every 18 months for enhanced water repellency.",
      shipping: "Dispatches within 24–48 hours."
    }
  },
  {
    id: "demo-light",
    handle: "ambient-desk-light",
    title: "Ambient Desk Light",
    category: "Technology",
    categoryHandle: "technology",
    price: 36.00,
    description: "A softer pool of warm light for focused work and calmer evenings. Stepless capacitive touch dimming with warm 2700K LED array.",
    image: img("photo-1507473885765-e6ed057f782c"),
    images: [img("photo-1507473885765-e6ed057f782c")],
    variantId: "demo-light-brass",
    available: true,
    tags: ["desk", "home"],
    stockCount: 5,
    variants: [
      { id: "demo-light-brass", title: "Muted Brass", color: "Muted Brass", colorHex: "#b89f71", price: 36.00, available: true },
      { id: "demo-light-cast-iron", title: "Cast Charcoal", color: "Cast Charcoal", colorHex: "#2c2c28", price: 36.00, available: true }
    ],
    specs: {
      materials: "Solid spun brass shade with protective matte lacquer, sandcast zinc base, USB-C braided power cable.",
      dimensions: "Base diameter: 110 mm. Height: 240 mm. Cable length: 1.8 m.",
      weight: "580 grams.",
      care: "Clean with a dry lint-free cloth. Do not immerse in water.",
      shipping: "Ships in reinforced foam-free packaging."
    }
  },
  {
    id: "demo-tray",
    handle: "everyday-catchall-tray",
    title: "Everyday Catchall Tray",
    category: "Home",
    categoryHandle: "home",
    price: 16.00,
    description: "A dedicated landing place for keys, earbuds, coins, and the pocket items you reach for on the way out the door.",
    image: img("photo-1600210492486-724fe5c67fb0"),
    images: [img("photo-1600210492486-724fe5c67fb0")],
    variantId: "demo-tray-raw-stone",
    available: true,
    tags: ["home", "organization"],
    stockCount: 15,
    variants: [
      { id: "demo-tray-raw-stone", title: "Raw Sandstone", color: "Raw Sandstone", colorHex: "#ded7cc", price: 16.00, available: true },
      { id: "demo-tray-granite", title: "Granite Ash", color: "Granite Ash", colorHex: "#454542", price: 16.00, available: true }
    ],
    specs: {
      materials: "Cast composite stoneware with unglazed matte exterior, sealed food-safe basin, and underside felt protector.",
      dimensions: "Oval: 200 mm × 130 mm × 22 mm.",
      weight: "410 grams.",
      care: "Hand wash with mild soap. Wipe dry promptly.",
      shipping: "Dispatches within 24 hours."
    }
  }
];

// Remove any placeholder image URL before real catalog use.
export const categories = [
  { title: "Technology", handle: "technology", subtitle: "A calmer, smarter setup", image: img("photo-1519389950473-47ba0277781c") },
  { title: "Home essentials", handle: "home-essentials", subtitle: "Make room for better", image: img("photo-1618221195710-dd6b41faaea6") },
  { title: "Travel", handle: "travel", subtitle: "Ready for the next thing", image: img("photo-1553062407-98eeb64c6a62") },
  { title: "Everyday finds", handle: "everyday-finds", subtitle: "Small things, considered", image: img("photo-1602143407151-7111542de6e8") }
];
