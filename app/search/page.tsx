"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { demoProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function SearchPage(){
 const [q,setQ]=useState("");
 const results=useMemo(()=>demoProducts.filter(p=>`${p.title} ${p.category} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())),[q]);
 return <main className="container" style={{paddingTop:65,paddingBottom:100,minHeight:"60vh"}}><div className="eyebrow" style={{marginBottom:15}}>Find your next favourite</div><h1 className="display" style={{fontSize:"clamp(48px,6vw,76px)",margin:"0 0 32px"}}>Search the shelf.</h1><label style={{display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid var(--ink)",paddingBottom:12,maxWidth:680}}><Search size={20}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Try “organizer” or “travel”…" style={{border:0,outline:0,background:"transparent",fontSize:18,width:"100%"}}/></label><div style={{margin:"28px 0 22px",fontSize:11,color:"var(--muted)"}}>{q?`${results.length} preview results for “${q}”`:"Search sample preview catalog"}</div><div className="product-grid">{results.map(p=><ProductCard key={p.id} product={p}/>)}</div><p style={{fontSize:10,color:"var(--muted)",marginTop:28}}>Search preview currently uses sample data. Connect Shopify search for live catalog results.</p></main>;
}
