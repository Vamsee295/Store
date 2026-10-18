export type Product = {
  id: string; handle: string; title: string; category: string; categoryHandle: string;
  price: number; compareAt?: number; description: string; image: string; images: string[];
  badge?: string; variantId: string; available: boolean; tags: string[];
};

const img = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const demoProducts: Product[] = [
  { id:"demo-cable", handle:"silicone-cable-organizer", title:"Cable Organizer Set", category:"Technology", categoryHandle:"technology", price:14.99, description:"A considered little fix for the cables that never stay where you left them. Compact, simple and made for a calmer workspace.", image:img("photo-1519389950473-47ba0277781c"), images:[img("photo-1519389950473-47ba0277781c"),img("photo-1498050108023-c5249f4df085")], badge:"Everyday essential", variantId:"demo-cable-default", available:true, tags:["desk","organization","tech"] },
  { id:"demo-stand", handle:"minimal-device-stand", title:"Minimal Device Stand", category:"Technology", categoryHandle:"technology", price:24.00, description:"A clean, stable home for the device you reach for every day. Designed to keep your setup feeling intentional.", image:img("photo-1517336714731-489689fd1ca8"), images:[img("photo-1517336714731-489689fd1ca8")], variantId:"demo-stand-default", available:true, tags:["desk","tech"] },
  { id:"demo-organizer", handle:"modular-drawer-organizer", title:"Modular Drawer Organizer", category:"Home", categoryHandle:"home", price:19.50, description:"Bring a little order to everyday drawers with flexible compartments for the small things that tend to wander.", image:img("photo-1618221195710-dd6b41faaea6"), images:[img("photo-1618221195710-dd6b41faaea6")], variantId:"demo-organizer-default", available:true, tags:["home","storage"] },
  { id:"demo-travel", handle:"travel-packing-cubes", title:"Travel Packing Cubes", category:"Travel", categoryHandle:"travel", price:28.00, description:"A more considered way to pack, unpack and find what you need on the move.", image:img("photo-1500530855697-b586d89ba3ee"), images:[img("photo-1500530855697-b586d89ba3ee")], variantId:"demo-travel-default", available:true, tags:["travel","organizer"] },
  { id:"demo-bottle", handle:"everyday-water-bottle", title:"Everyday Bottle", category:"Everyday", categoryHandle:"everyday", price:22.00, description:"A simple everyday companion for desk days, errands and weekends away.", image:img("photo-1602143407151-7111542de6e8"), images:[img("photo-1602143407151-7111542de6e8")], variantId:"demo-bottle-default", available:true, tags:["everyday","lifestyle"] },
  { id:"demo-pouch", handle:"daily-carry-pouch", title:"Daily Carry Pouch", category:"Travel", categoryHandle:"travel", price:18.00, description:"Keep small essentials together with a compact pouch that earns its place in your bag.", image:img("photo-1553062407-98eeb64c6a62"), images:[img("photo-1553062407-98eeb64c6a62")], variantId:"demo-pouch-default", available:true, tags:["travel","everyday"] },
  { id:"demo-light", handle:"ambient-desk-light", title:"Ambient Desk Light", category:"Technology", categoryHandle:"technology", price:36.00, description:"A softer pool of light for slower evenings, focused work and a more settled desk.", image:img("photo-1507473885765-e6ed057f782c"), images:[img("photo-1507473885765-e6ed057f782c")], variantId:"demo-light-default", available:true, tags:["desk","home"] },
  { id:"demo-tray", handle:"everyday-catchall-tray", title:"Everyday Catchall Tray", category:"Home", categoryHandle:"home", price:16.00, description:"A dedicated landing place for keys, earbuds and the little essentials you reach for on the way out.", image:img("photo-1600210492486-724fe5c67fb0"), images:[img("photo-1600210492486-724fe5c67fb0")], variantId:"demo-tray-default", available:true, tags:["home","organization"] }
];

// Remove any placeholder image URL before real catalog use.
export const categories = [
  { title:"Technology", handle:"technology", subtitle:"A calmer, smarter setup", image:img("photo-1519389950473-47ba0277781c") },
  { title:"Home essentials", handle:"home", subtitle:"Make room for better", image:img("photo-1618221195710-dd6b41faaea6") },
  { title:"Travel", handle:"travel", subtitle:"Ready for the next thing", image:img("photo-1553062407-98eeb64c6a62") },
  { title:"Everyday finds", handle:"everyday", subtitle:"Small things, considered", image:img("photo-1602143407151-7111542de6e8") }
];
