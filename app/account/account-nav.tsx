"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, MapPin, Sliders, LogOut, ShoppingBag, Heart } from "lucide-react";

interface AccountNavProps {
  customerName?: string;
  email?: string;
  isPreview?: boolean;
}

export function AccountNav({ customerName, email, isPreview }: AccountNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/login");
  };

  const navItems = [
    { href: "/account", label: "Overview", icon: User },
    { href: "/account/orders", label: "Orders & Shipments", icon: Package },
    { href: "/account/favourites", label: "Favourites", icon: Heart },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/preferences", label: "Preferences", icon: Sliders },
  ];

  return (
    <aside className="account-sidebar">
      {/* Customer summary card */}
      <div className="account-profile-card">
        <div className="account-avatar">
          {customerName ? customerName.charAt(0).toUpperCase() : "T"}
        </div>
        <div className="account-profile-info">
          <div className="account-profile-name">{customerName || "Member"}</div>
          <div className="account-profile-email">{email || "account@thirdshelf.store"}</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="account-nav-list" aria-label="Account navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`account-nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Continue shopping link */}
        <Link
          href="/collections/all"
          className="account-nav-link"
          style={{
            borderTop: "1px solid var(--line)",
            marginTop: 8,
            paddingTop: 12,
            color: "#252522",
            fontWeight: 500,
          }}
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          <span>Continue shopping</span>
        </Link>

        <button
          onClick={handleSignOut}
          className="account-nav-link account-signout-btn"
          type="button"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Sign out</span>
        </button>
      </nav>
    </aside>
  );
}
