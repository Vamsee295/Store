"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/components/cart-provider";

const nav = [{label:"Shop all",href:"/collections/all"},{label:"Technology",href:"/collections/technology"},{label:"Home",href:"/collections/home"},{label:"Travel",href:"/collections/travel"},{label:"Everyday",href:"/collections/everyday"}];

export function SiteHeader() {
  const [open,setOpen] = useState(false);
  const { count } = useCart();
  return <>
    <div style={{background:"#252522",color:"#f7f5f0",textAlign:"center",padding:"9px 12px",fontSize:10,letterSpacing:".12em"}}>THOUGHTFULLY CHOSEN. MADE FOR EVERYDAY.</div>
    <header style={{position:"sticky",top:0,zIndex:40,background:"rgba(247,245,240,.94)",backdropFilter:"blur(14px)",borderBottom:"1px solid var(--line)"}}>
      <div className="container" style={{height:76,display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:20}}>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <button aria-label="Open menu" className="mobile-menu" onClick={()=>setOpen(!open)} style={{background:"none",border:0,padding:4,display:"none"}}><Menu size={20}/></button>
          <nav className="desktop-nav" style={{display:"flex",gap:20}}>
            {nav.slice(0,3).map(n=><Link key={n.href} href={n.href} style={{fontSize:11,color:"var(--muted)"}}>{n.label}</Link>)}
          </nav>
        </div>
        <Link href="/" aria-label="Third Shelf home" style={{fontFamily:"var(--serif)",fontSize:29,letterSpacing:"-.07em",whiteSpace:"nowrap"}}>third shelf<span style={{fontSize:8,verticalAlign:"top",marginLeft:3}}>®</span></Link>
        <div style={{display:"flex",justifyContent:"end",alignItems:"center",gap:18}}>
          <Link href="/search" aria-label="Search products" style={{display:"flex"}}><Search size={18} strokeWidth={1.5}/></Link>
          <Link href="/login" aria-label="Customer account" style={{display:"flex",alignItems:"center"}}><User size={18} strokeWidth={1.5}/></Link>
          <Link href="/cart" aria-label={`Shopping bag, ${count} items`} style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}><ShoppingBag size={18} strokeWidth={1.5}/><span>{count}</span></Link>
        </div>
      </div>
      {open && (
        <div style={{padding:"0 20px 20px",display:"grid",gap:16}}>
          {nav.map(n=><Link onClick={()=>setOpen(false)} key={n.href} href={n.href}>{n.label}</Link>)}
          <Link onClick={()=>setOpen(false)} href="/login" style={{borderTop:"1px solid var(--line)",paddingTop:14,fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",gap:8}}>
            <User size={16} strokeWidth={1.5}/>
            <span>Account / Sign in</span>
          </Link>
        </div>
      )}
    </header>
  </>;
}
