import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getCollectionProducts, getProducts, shopifyConfigured } from "@/lib/shopify/client";
import { categories } from "@/lib/products";

export async function generateMetadata({params}:{params:Promise<{handle:string}>}):Promise<Metadata>{
 const {handle}=await params; const c=categories.find(x=>x.handle===handle);
 return {title:c?.title||"Shop all",description:c?.subtitle||"Explore the Third Shelf collection."};
}
export default async function CollectionPage({params}:{params:Promise<{handle:string}>}){
 const {handle}=await params;
 const isAll=handle==="all";
 const category=categories.find(c=>c.handle===handle);
 if(!isAll&&!category&&!shopifyConfigured) notFound();
 const products=isAll?await getProducts():await getCollectionProducts(handle);
 const title=isAll?"Shop all":category?.title||handle.replace(/-/g," ");
 const desc=isAll?"A considered collection of useful things for everyday living.":category?.subtitle||"Thoughtfully selected for everyday life.";
 return <main className="container" style={{paddingTop:58,paddingBottom:100}}>
   <div className="eyebrow" style={{marginBottom:18}}><Link href="/">Home</Link> / {title}</div>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:30,marginBottom:40,flexWrap:"wrap"}}><div><h1 className="display" style={{fontSize:"clamp(48px,7vw,82px)",margin:"0 0 18px",textTransform:"capitalize"}}>{title}</h1><p style={{fontSize:13,color:"var(--muted)",maxWidth:460,lineHeight:1.8,margin:0}}>{desc}</p></div><span className="eyebrow">{products.length} items shown</span></div>
   {!shopifyConfigured&&<div style={{background:"#f1e8da",padding:12,fontSize:11,marginBottom:28}}>Preview catalog: connect Shopify to display your real products, inventory and pricing.</div>}
   {products.length?<div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div style={{padding:"80px 0",textAlign:"center"}}><h2 className="display" style={{fontSize:42}}>A little more time.</h2><p style={{color:"var(--muted)",fontSize:13}}>We are curating this collection. Explore everything else in the meantime.</p><Link href="/collections/all" className="btn" style={{marginTop:14}}>Shop all <ArrowRight size={14}/></Link></div>}
 </main>;
}
