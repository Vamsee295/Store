"use client";
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/cart-provider";

export function ProductPurchase({product, demoMode}:{product:Product; demoMode:boolean}){
 const {add}=useCart(); const [added,setAdded]=useState(false);
 function onAdd(){if(!product.available)return;add(product);setAdded(true);window.setTimeout(()=>setAdded(false),1800)}
 return <div><button className="btn" onClick={onAdd} disabled={!product.available} style={{width:"100%",justifyContent:"center",opacity:product.available?1:.5}}>{added?<><Check size={16}/> Added to bag</>:<><ShoppingBag size={16}/>{product.available?"Add to bag":"Currently unavailable"}</>}</button>
 {demoMode&&<p style={{fontSize:10,color:"var(--muted)",lineHeight:1.7,marginTop:12}}>Demo mode: adding to bag is a local preview only. Connect Shopify for real checkout.</p>}</div>;
}
