"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, Heart, LogOut } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/components/auth-provider";

const nav = [
  { label: "Shop all", href: "/collections/all" },
  { label: "Technology", href: "/collections/technology" },
  { label: "Home essentials", href: "/collections/home-essentials" },
  { label: "Travel", href: "/collections/travel" },
  { label: "Everyday finds", href: "/collections/everyday-finds" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();
  const { isAuthenticated, customer, favouritesCount, logout, requireAuth } = useAuth();

  const handleCartClick = () => {
    if (!isAuthenticated) {
      requireAuth("/cart", "cart");
      return;
    }
    openCart();
  };

  const customerInitial = customer?.firstName?.charAt(0).toUpperCase() || "M";

  return (
    <>
      <div
        style={{
          background: "#252522",
          color: "#f7f5f0",
          textAlign: "center",
          padding: "9px 12px",
          fontSize: 10,
          letterSpacing: ".12em",
        }}
      >
        THOUGHTFULLY CHOSEN. MADE FOR EVERYDAY.
      </div>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(247,245,240,.94)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          className="container"
          style={{
            height: 76,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Left Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <button
              aria-label="Open menu"
              className="mobile-menu"
              onClick={() => setOpen(!open)}
              style={{ background: "none", border: 0, padding: 4, display: "none" }}
            >
              <Menu size={20} />
            </button>
            <nav
              className="desktop-nav"
              style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}
            >
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  style={{
                    fontSize: 14,
                    fontWeight: 450,
                    color: "#383632",
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#181716")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#383632")}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center Brand Identity */}
          <Link
            href="/"
            aria-label="Third Shelf home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              aria-hidden="true"
            >
              <rect x="5" y="6.5" width="14" height="1.6" rx="0.4" fill="#252522" />
              <rect x="3" y="11" width="18" height="1.6" rx="0.4" fill="#252522" />
              <rect x="5" y="15.5" width="14" height="1.6" rx="0.4" fill="#252522" />
            </svg>
            <span
              style={{
                fontFamily: "var(--serif)",
                fontSize: 21,
                letterSpacing: "-.04em",
                color: "#252522",
              }}
            >
              Third shelf
            </span>
            <span
              style={{
                fontSize: 8,
                verticalAlign: "super",
                color: "var(--muted)",
                marginLeft: -2,
              }}
            >
              ®
            </span>
          </Link>

          {/* Right Customer Actions */}
          <div
            style={{
              display: "flex",
              justifySelf: "end",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Link href="/search" aria-label="Search products" style={{ display: "flex", color: "#252522" }}>
              <Search size={18} strokeWidth={1.5} />
            </Link>

            {isAuthenticated ? (
              <>
                {/* Logged in: Favourites link with count badge */}
                <Link
                  href="/account/favourites"
                  aria-label={`Saved favourites, ${favouritesCount} items`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "#252522",
                    textDecoration: "none",
                    position: "relative",
                  }}
                >
                  <Heart size={18} strokeWidth={1.5} />
                  {favouritesCount > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        background: "#c2410c",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 17,
                        height: 17,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {favouritesCount}
                    </span>
                  )}
                </Link>

                {/* Logged in: Account sanctuary link with customer avatar/initial */}
                <Link
                  href="/account"
                  aria-label="Customer account sanctuary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#252522",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "#252522",
                      color: "#f7f5f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {customerInitial}
                  </div>
                </Link>

                {/* Logged in: Shopping bag button with accurate item count */}
                <button
                  type="button"
                  onClick={handleCartClick}
                  aria-label={`Open shopping bag, ${count} items`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    background: "transparent",
                    border: 0,
                    padding: "6px 8px",
                    borderRadius: 4,
                    cursor: "pointer",
                    color: "#252522",
                  }}
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{count}</span>
                </button>
              </>
            ) : (
              <>
                {/* Logged out: Sign In link */}
                <Link
                  href="/login?redirectTo=/account&reason=account"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#252522",
                    textDecoration: "none",
                  }}
                >
                  <User size={17} strokeWidth={1.5} />
                  <span>Sign in</span>
                </Link>

                {/* Logged out: Cart button redirects to login per architecture requirement */}
                <button
                  type="button"
                  onClick={handleCartClick}
                  aria-label="Shopping bag (sign in required)"
                  title="Sign in required to access shopping bag"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    background: "transparent",
                    border: 0,
                    padding: "6px 8px",
                    borderRadius: 4,
                    cursor: "pointer",
                    color: "#5d564b",
                  }}
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div style={{ padding: "0 20px 20px", display: "grid", gap: 14 }}>
            {nav.map((n) => (
              <Link
                onClick={() => setOpen(false)}
                key={n.href}
                href={n.href}
                style={{ fontSize: 14.5, color: "#252522", padding: "4px 0" }}
              >
                {n.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  href="/account/favourites"
                  style={{
                    borderTop: "1px solid var(--line)",
                    paddingTop: 14,
                    fontSize: 13.5,
                    color: "#252522",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Heart size={16} strokeWidth={1.5} />
                  <span>Favourites ({favouritesCount})</span>
                </Link>
                <Link
                  onClick={() => setOpen(false)}
                  href="/account"
                  style={{
                    fontSize: 13.5,
                    color: "#252522",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <User size={16} strokeWidth={1.5} />
                  <span>Customer Sanctuary</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  style={{
                    background: "none",
                    border: 0,
                    padding: "4px 0",
                    fontSize: 13,
                    color: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <LogOut size={15} strokeWidth={1.5} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <Link
                onClick={() => setOpen(false)}
                href="/login?redirectTo=/account&reason=account"
                style={{
                  borderTop: "1px solid var(--line)",
                  paddingTop: 14,
                  fontSize: 13.5,
                  color: "#252522",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <User size={16} strokeWidth={1.5} />
                <span>Sign in / Register</span>
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
