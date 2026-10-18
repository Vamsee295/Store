import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Truck } from "lucide-react";
import Link from "next/link";
import { getProduct, getProducts, shopifyConfigured } from "@/lib/shopify/client";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductCard } from "@/components/product-card";
import { ProductIllustration } from "@/components/product-illustrations";

export async function generateMetadata({params}:{params:Promise<{handle:string}>}):Promise<Metadata>{
 const {handle}=await params; const p=await getProduct(handle); return {title:p?.title||"Product",description:p?.description.slice(0,150)};
}
export default async function ProductPage({params}:{params:Promise<{handle:string}>}){
 const {handle}=await params; const product=await getProduct(handle); if(!product)notFound();
 const related=(await getProducts()).filter(p=>p.id!==product.id&&p.categoryHandle===product.categoryHandle).slice(0,3);
 return <main className="container" style={{paddingTop:34,paddingBottom:90}}>
   <Link href="/collections/all" style={{fontSize:11,display:"inline-flex",alignItems:"center",gap:8,marginBottom:28,color:"var(--muted)"}}><ArrowLeft size={14}/> Back to shop</Link>
   {!shopifyConfigured&&<div style={{background:"#f1e8da",padding:11,fontSize:10,marginBottom:20}}>DEMO PRODUCT · Sample content and pricing are illustrative. Connect Shopify and verify all product details before selling.</div>}
   <div className="product-detail"><div className="product-gallery"><div className="main-product-image"><ProductIllustration handle={product.handle} fallback={<img src={product.image} alt={product.title}/>}/></div>{product.images.length > 1 && !shopifyConfigured ? null : product.images.slice(1,4).map((src,i)=><div key={src+i} className="secondary-product-image"><img src={src} alt={`${product.title} view ${i+2}`}/></div>)}</div>
   <div className="product-panel"><div className="eyebrow" style={{marginBottom:16}}>{product.category}</div><h1 className="display" style={{fontSize:"clamp(44px,5vw,64px)",margin:"0 0 18px"}}>{product.title}</h1><div style={{fontSize:16,marginBottom:22}}>${product.price.toFixed(2)}{product.compareAt&&<span style={{color:"var(--muted)",textDecoration:"line-through",fontSize:13,marginLeft:10}}>${product.compareAt.toFixed(2)}</span>}</div><p style={{fontSize:13,color:"var(--muted)",lineHeight:1.9,marginBottom:25}}>{product.description}</p>
   <div style={{borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",padding:"18px 0",display:"grid",gap:13,marginBottom:24}}><div style={{display:"flex",gap:10,fontSize:11,alignItems:"center"}}><Check size={15}/> Thoughtfully selected for everyday use</div><div style={{display:"flex",gap:10,fontSize:11,alignItems:"center"}}><Truck size={15}/> Shipping options shown at checkout</div></div>
   <ProductPurchase product={product} demoMode={!shopifyConfigured}/><p style={{fontSize:10,color:"var(--muted)",lineHeight:1.7,marginTop:18}}>Delivery timing and return eligibility depend on the final store policies and destination. Review the terms before placing an order.</p>
   <div style={{marginTop:36,display:"grid",gap:12}}>{[["Product details","Useful design, considered for everyday routines."],["Shipping & returns","See the store's published shipping and return terms."],["Need help?","Contact our team before placing your order."]].map(([a,b])=><details key={a} style={{borderTop:"1px solid var(--line)",paddingTop:15}}><summary style={{fontSize:12,cursor:"pointer"}}>{a}</summary><p style={{fontSize:11,lineHeight:1.8,color:"var(--muted)"}}>{b}</p></details>)}</div>
   </div></div>
   {related.length>0&&<section style={{paddingTop:90}}><div className="section-head"><h2 className="section-title">You may also like.</h2><Link href={`/collections/${product.categoryHandle}`} style={{fontSize:11}}>Explore category <ArrowRight size={13}/></Link></div><div className="product-grid">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
   <style>{`.product-detail{display:grid;grid-template-columns:1.1fr .8fr;gap:8%}.product-gallery{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:start}.main-product-image{grid-column:1/-1;aspect-ratio:1;background:#ece8e0;overflow:hidden;border-radius:12px;border:1px solid rgba(37,37,34,0.08);display:flex;align-items:center;justify-content:center}.main-product-image svg{width:100%;height:100%;display:block}.main-product-image img,.secondary-product-image img{width:100%;height:100%;object-fit:cover}.secondary-product-image{aspect-ratio:1;background:var(--stone);overflow:hidden}.product-panel{position:sticky;top:120px;align-self:start;padding-top:12px}@media(max-width:800px){.product-detail{grid-template-columns:1fr;gap:34px}.product-panel{position:static}.product-gallery{gap:8px}}`}</style>
 </main>;
}
