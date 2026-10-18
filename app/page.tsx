import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { ProductCard } from "@/components/product-card";
import { CategoryCards } from "@/components/category-cards";
import { BrandStoryIllustration } from "@/components/brand-story-illustration";
import { categories } from "@/lib/products";
import { getProducts, shopifyConfigured } from "@/lib/shopify/client";

export default async function HomePage() {
  const allProducts = await getProducts();
  const products = allProducts.slice(0, 4);

  const heroProducts = {
    tech: allProducts.find(p => p.handle === "minimal-device-stand") || allProducts.find(p => p.categoryHandle === "technology"),
    travel: allProducts.find(p => p.handle === "daily-carry-pouch") || allProducts.find(p => p.categoryHandle === "travel"),
    home: allProducts.find(p => p.handle === "everyday-catchall-tray") || allProducts.find(p => p.categoryHandle === "home"),
    everyday: allProducts.find(p => p.handle === "everyday-water-bottle") || allProducts.find(p => p.categoryHandle === "everyday"),
  };

  const categoriesWithCounts = categories.map(c => {
    const itemCount = allProducts.filter(p => p.categoryHandle === c.handle).length;
    return {
      title: c.title,
      handle: c.handle,
      subtitle: c.subtitle,
      itemCount,
      available: itemCount > 0,
    };
  });

  return <main>
    {!shopifyConfigured && <div style={{background:"#f1e8da",padding:"9px 16px",textAlign:"center",fontSize:10,color:"#5d4b35",letterSpacing:".04em"}}>PREVIEW MODE · Connect your Shopify Storefront API to replace sample products with your live catalog.</div>}
    <HomeHero featuredProducts={heroProducts}/>
    <section className="container" style={{paddingTop:25,paddingBottom:22,borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
      {[["01","Thoughtfully selected","Useful finds, not endless noise."],["02","Designed for everyday","Small upgrades that make sense."],["03","A simpler way to shop","Clear details from discovery to checkout."]].map(([n,t,d])=><div key={n} style={{display:"flex",gap:12,alignItems:"start"}}><span style={{fontSize:10,color:"var(--accent)"}}>{n}</span><div><div style={{fontSize:12,fontWeight:600,marginBottom:5}}>{t}</div><div style={{fontSize:11,color:"var(--muted)"}}>{d}</div></div></div>)}
    </section>
    <section className="section container">
      <div className="section-head"><div><div className="eyebrow" style={{marginBottom:13}}>Find your kind of better</div><h2 className="section-title">Explore the edit.</h2></div><Link href="/collections/all" style={{fontSize:12,display:"flex",alignItems:"center",gap:7}}>Shop everything <ArrowRight size={15}/></Link></div>
      <CategoryCards categories={categoriesWithCounts} />
    </section>
    <section className="section" style={{background:"#eeebe4"}}>
      <div className="container">
        <div className="section-head"><div><div className="eyebrow" style={{marginBottom:13}}>The considered edit</div><h2 className="section-title">Useful things, chosen well.</h2><p style={{color:"var(--muted)",fontSize:13,lineHeight:1.7,maxWidth:420}}>A rotating selection of everyday essentials with a clear purpose and a place in your life.</p></div><Link href="/collections/all" className="btn btn-light">View all products <ArrowRight size={14}/></Link></div>
        <div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>
      </div>
    </section>
    <section className="section container">
      <div className="story-block"><div className="story-image"><BrandStoryIllustration /></div><div className="story-copy"><div className="eyebrow" style={{marginBottom:18}}>The Third Shelf point of view</div><h2 className="display" style={{fontSize:"clamp(42px,5.4vw,68px)",margin:"0 0 22px"}}>Less noise.<br/>More <i style={{color:"#8d806f"}}>considered</i><br/>choices.</h2><p style={{fontSize:13,lineHeight:1.9,color:"var(--muted)",maxWidth:370}}>We believe the best everyday things earn their place. Our aim is simple: make useful products easier to discover, understand and bring into your routine.</p><Link href="/pages/about" className="btn btn-light" style={{marginTop:15}}>Our approach <ArrowRight size={14}/></Link></div></div>
    </section>
    <section className="newsletter"><div className="container newsletter-inner"><div className="eyebrow" style={{color:"#c7b9a7",marginBottom:16}}>A little more considered</div><h2 className="display">Good finds,<br/>occasionally.</h2><p>Product discoveries and everyday inspiration. No noise.</p><form action="/pages/contact" className="newsletter-form"><input aria-label="Email address" type="email" placeholder="Your email address" required/><button aria-label="Continue" type="submit"><ArrowRight size={18}/></button></form><small>Newsletter signup UI preview. Connect a consent-aware email platform before launch.</small></div></section>
    <style>{`
      .story-block{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:8%}.story-image{aspect-ratio:4/5;overflow:hidden;background:#ece5dc;border-radius:12px;border:1px solid rgba(37,37,34,0.1);box-shadow:0 16px 36px -12px rgba(45,38,28,0.12);position:relative}.story-copy{padding-block:30px}
      .newsletter{background:#252522;color:#f7f5f0;text-align:center;padding:90px 0}.newsletter-inner h2{font-size:clamp(48px,6vw,76px);margin:0 0 18px}.newsletter-inner p{font-size:13px;color:#c0bcb3;margin:0 0 28px}.newsletter-form{display:flex;width:min(430px,100%);margin:auto;border-bottom:1px solid #77746d}.newsletter-form input{flex:1;min-width:0;border:0;background:transparent;color:white;height:48px;font-size:12px;outline:none}.newsletter-form button{border:0;background:transparent;color:white;padding:0 8px}.newsletter small{display:block;color:#918d83;font-size:9px;margin-top:16px}
      @media(max-width:900px){.story-block{gap:5%}}
      @media(max-width:600px){.container[style*="repeat(3"]{grid-template-columns:1fr!important;gap:20px!important}.story-block{grid-template-columns:1fr}.story-image{aspect-ratio:4/3}.newsletter{padding:68px 0}}
    `}</style>
  </main>;
}
