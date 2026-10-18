"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export default function CartPage(){
 const {lines,count,remove,update}=useCart(); const [busy,setBusy]=useState(false);
 const subtotal=lines.reduce((n,l)=>n+l.product.price*l.quantity,0);
 async function checkout(){
   setBusy(true);
   try{
     const res=await fetch("/api/cart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lines:lines.map(l=>({merchandiseId:l.product.variantId,quantity:l.quantity}))})});
     const data=await res.json();
     if(data.checkoutUrl) window.location.href=data.checkoutUrl;
     else alert(data.error||"Checkout is not configured yet. Connect your Shopify Storefront API.");
   }catch{alert("Could not start checkout. Please try again.");}
   finally{setBusy(false)}
 }
 return <main className="container" style={{paddingTop:60,paddingBottom:100,minHeight:"55vh"}}>
  <div className="eyebrow" style={{marginBottom:16}}>Your selection</div><h1 className="display" style={{fontSize:"clamp(48px,6vw,76px)",margin:"0 0 38px"}}>Your bag <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,letterSpacing:0,color:"var(--muted)"}}>({count})</span></h1>
  {!lines.length?<div style={{padding:"60px 0",borderTop:"1px solid var(--line)",textAlign:"center"}}><p style={{fontFamily:"var(--serif)",fontSize:34}}>Nothing here just yet.</p><p style={{fontSize:12,color:"var(--muted)",marginBottom:24}}>A good find is waiting somewhere in the collection.</p><Link className="btn" href="/collections/all">Explore the collection <ArrowRight size={14}/></Link></div>:
  <div className="cart-layout"><div>{lines.map(({product,quantity})=><div key={product.id} className="cart-line"><Link href={`/products/${product.handle}`} className="cart-thumb"><img src={product.image} alt={product.title}/></Link><div style={{flex:1}}><Link href={`/products/${product.handle}`} style={{fontSize:13,fontWeight:600}}>{product.title}</Link><div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>{product.category}</div><div style={{fontSize:12,marginTop:12}}>${product.price.toFixed(2)}</div><div style={{display:"flex",alignItems:"center",gap:14,marginTop:14}}><div className="qty"><button aria-label="Decrease quantity" onClick={()=>update(product.id,quantity-1)}><Minus size={12}/></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={()=>update(product.id,quantity+1)}><Plus size={12}/></button></div><button aria-label={`Remove ${product.title}`} onClick={()=>remove(product.id)} style={{border:0,background:"transparent",color:"var(--muted)"}}><Trash2 size={15}/></button></div></div><div style={{fontSize:12}}>${(product.price*quantity).toFixed(2)}</div></div>)}</div>
   <aside className="cart-summary"><h2 style={{fontSize:14,margin:"0 0 22px"}}>Order summary</h2><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:14}}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><p style={{fontSize:10,lineHeight:1.8,color:"var(--muted)",borderTop:"1px solid var(--line)",paddingTop:14}}>Shipping, taxes and final payment options are calculated by Shopify at checkout.</p><button className="btn" disabled={busy} onClick={checkout} style={{width:"100%",marginTop:12}}>{busy?"Preparing checkout…":"Continue to checkout"} <ArrowRight size={15}/></button><Link href="/collections/all" style={{display:"block",textAlign:"center",fontSize:11,marginTop:18,textDecoration:"underline",textUnderlineOffset:4}}>Continue shopping</Link></aside>
  </div>}
  <style>{`.cart-layout{display:grid;grid-template-columns:1.5fr .7fr;gap:8%;border-top:1px solid var(--line);padding-top:24px}.cart-line{display:flex;align-items:start;gap:18px;padding:18px 0;border-bottom:1px solid var(--line)}.cart-thumb{width:112px;aspect-ratio:1;background:var(--stone);flex-shrink:0}.cart-thumb img{width:100%;height:100%;object-fit:cover}.qty{display:flex;align-items:center;gap:14px;border:1px solid var(--line);padding:7px 9px;font-size:11px}.qty button{display:flex;border:0;background:transparent;padding:0}.cart-summary{align-self:start;background:#eeebe4;padding:24px;position:sticky;top:120px}@media(max-width:750px){.cart-layout{grid-template-columns:1fr}.cart-summary{position:static}.cart-thumb{width:84px}}`}</style>
 </main>;
}
