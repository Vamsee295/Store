"use client";

import React, { useState, useMemo, useId } from "react";
import Link from "next/link";
import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw, Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

interface CategoryMeta {
  title: string;
  handle: string;
  subtitle?: string;
}

interface ProductCatalogViewProps {
  initialProducts: Product[];
  categories: CategoryMeta[];
  initialCategoryHandle?: string;
  isShopAll?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  shopifyConfigured?: boolean;
  hideHeader?: boolean;
}

type SortOption = "featured" | "price-asc" | "price-desc" | "alpha-asc" | "alpha-desc";
type PriceFilter = "all" | "under-20" | "20-30" | "30-plus";

export function ProductCatalogView({
  initialProducts,
  categories,
  initialCategoryHandle = "all",
  isShopAll = true,
  pageTitle = "The complete collection.",
  pageDescription = "Thoughtfully selected finds across technology, home, travel, and everyday living. Built to earn their place.",
  shopifyConfigured = false,
  hideHeader = false,
}: ProductCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryHandle);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const searchInputId = useId();

  // Extract all unique tags across products
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialProducts.forEach((p) => {
      p.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [initialProducts]);

  // Compute item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProducts.length };
    categories.forEach((c) => {
      counts[c.handle] = initialProducts.filter(
        (p) =>
          p.categoryHandle === c.handle ||
          p.category.toLowerCase() === c.title.toLowerCase() ||
          p.collections?.some(
            (col) =>
              col.handle === c.handle ||
              col.title.toLowerCase() === c.title.toLowerCase()
          )
      ).length;
    });
    return counts;
  }, [initialProducts, categories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Category filter (applied in Shop All mode)
    if (isShopAll && selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.categoryHandle === selectedCategory ||
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.collections?.some(
            (c) =>
              c.handle === selectedCategory ||
              c.title.toLowerCase() === selectedCategory.toLowerCase()
          )
      );
    }

    // 2. Search query filter (title, description, category, tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const tagsMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || tagsMatch;
      });
    }

    // 3. Price range filter
    if (priceFilter === "under-20") {
      result = result.filter((p) => p.price < 20);
    } else if (priceFilter === "20-30") {
      result = result.filter((p) => p.price >= 20 && p.price <= 30);
    } else if (priceFilter === "30-plus") {
      result = result.filter((p) => p.price > 30);
    }

    // 4. In-stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.available);
    }

    // 5. Tag filter
    if (selectedTag) {
      result = result.filter((p) => p.tags?.includes(selectedTag));
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "alpha-asc") return a.title.localeCompare(b.title);
      if (sortBy === "alpha-desc") return b.title.localeCompare(a.title);
      return 0; // "featured" maintains catalog curation order
    });

    return result;
  }, [initialProducts, isShopAll, selectedCategory, searchQuery, priceFilter, inStockOnly, selectedTag, sortBy]);

  // Check if any filter is actively applied
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== initialCategoryHandle ||
    priceFilter !== "all" ||
    inStockOnly ||
    selectedTag !== null ||
    sortBy !== "featured";

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(initialCategoryHandle);
    setSortBy("featured");
    setPriceFilter("all");
    setInStockOnly(false);
    setSelectedTag(null);
  };

  return (
    <div className="catalog-wrapper">
      {/* Editorial Header */}
      {!hideHeader && (
        <header className="catalog-header">
          <nav aria-label="Breadcrumb" className="catalog-breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span>{isShopAll ? "Shop all" : pageTitle}</span>
          </nav>

          <div className="catalog-header-layout">
            <div className="catalog-header-text">
              <span className="eyebrow catalog-eyebrow">
                {isShopAll ? "Considered Edit · Archive Vol. 01" : "Category Edit"}
              </span>
              <h1 className="display catalog-title">{pageTitle}</h1>
              <p className="catalog-description">{pageDescription}</p>
            </div>

            <div className="catalog-header-badge">
              <span className="catalog-count-pill">
                <strong>{filteredProducts.length}</strong>{" "}
                {filteredProducts.length === 1 ? "find curated" : "finds curated"}
              </span>
            </div>
          </div>

          {!shopifyConfigured && (
            <div className="catalog-preview-banner" role="status">
              <div className="catalog-preview-dot" />
              <span>
                <strong>Preview Catalog:</strong> Displaying curated prototype finds. Live inventory, variants, and pricing synchronize automatically once Shopify Storefront API credentials are configured.
              </span>
            </div>
          )}
        </header>
      )}

      {/* Main Interactive Controls & Toolbar */}
      <section className="catalog-controls-section" aria-label="Catalog search, filters and sorting">
        {/* Top Filter Bar: Search + Category Pills + Sort + Mobile Filter Toggle */}
        <div className="catalog-toolbar">
          {/* In-page Instant Search */}
          <div className="catalog-search-box">
            <label htmlFor={searchInputId} className="sr-only">
              Search products
            </label>
            <Search className="catalog-search-icon" size={16} aria-hidden="true" />
            <input
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, room, use, or keyword…"
              className="catalog-search-input"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="catalog-search-clear"
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="catalog-sort-box">
            <ArrowUpDown size={14} className="catalog-sort-icon" aria-hidden="true" />
            <label htmlFor="catalog-sort-select" className="sr-only">
              Sort by
            </label>
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="catalog-sort-select"
            >
              <option value="featured">Sort: Curated / Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="alpha-asc">Alphabetical: A–Z</option>
              <option value="alpha-desc">Alphabetical: Z–A</option>
            </select>
          </div>

          {/* Toggle Additional Filters Button */}
          <button
            type="button"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`catalog-filter-toggle-btn ${showFiltersPanel ? "active" : ""}`}
            aria-expanded={showFiltersPanel}
            aria-controls="catalog-filters-drawer"
          >
            <SlidersHorizontal size={14} />
            <span>Refine</span>
            {(priceFilter !== "all" || inStockOnly || selectedTag) && (
              <span className="catalog-active-filter-dot" />
            )}
          </button>
        </div>

        {/* Category Pills (Tabs) */}
        <div className="catalog-category-row" role="tablist" aria-label="Filter by category">
          {isShopAll ? (
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
              className={`catalog-category-pill ${selectedCategory === "all" ? "active" : ""}`}
            >
              <span>All items</span>
              <span className="pill-count">{categoryCounts["all"] || 0}</span>
            </button>
          ) : (
            <Link
              href="/collections/all"
              className={`catalog-category-pill ${selectedCategory === "all" ? "active" : ""}`}
            >
              <span>All items</span>
            </Link>
          )}

          {categories.map((cat) => {
            const count = categoryCounts[cat.handle] || 0;
            const isSelected = selectedCategory === cat.handle;

            if (isShopAll) {
              return (
                <button
                  key={cat.handle}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat.handle)}
                  className={`catalog-category-pill ${isSelected ? "active" : ""}`}
                >
                  <span>{cat.title}</span>
                  <span className="pill-count">{count}</span>
                </button>
              );
            }

            return (
              <Link
                key={cat.handle}
                href={`/collections/${cat.handle}`}
                className={`catalog-category-pill ${isSelected ? "active" : ""}`}
              >
                <span>{cat.title}</span>
                {isSelected && <span className="pill-count">{initialProducts.length}</span>}
              </Link>
            );
          })}
        </div>

        {/* Expandable Refinement Panel (Price, Stock, Tags) */}
        {showFiltersPanel && (
          <div id="catalog-filters-drawer" className="catalog-refinements-panel">
            {/* Price Filter Options */}
            <div className="refinement-group">
              <span className="refinement-label">Price Range</span>
              <div className="refinement-chips">
                {[
                  { id: "all", label: "All prices" },
                  { id: "under-20", label: "Under $20" },
                  { id: "20-30", label: "$20 – $30" },
                  { id: "30-plus", label: "$30 & above" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPriceFilter(opt.id as PriceFilter)}
                    className={`refinement-chip ${priceFilter === opt.id ? "active" : ""}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="refinement-group">
              <span className="refinement-label">Availability</span>
              <label className="refinement-checkbox-label">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="refinement-checkbox"
                />
                <span>Ready to ship (In stock only)</span>
              </label>
            </div>

            {/* Tags / Focus Filter */}
            {availableTags.length > 0 && (
              <div className="refinement-group">
                <span className="refinement-label">Intent & Focus</span>
                <div className="refinement-chips">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`refinement-chip ${selectedTag === tag ? "active" : ""}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="catalog-active-filters-bar">
            <span className="active-filters-title">Active filters:</span>

            {searchQuery.trim() && (
              <span className="active-filter-badge">
                Search: “{searchQuery}”
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Remove search filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="active-filter-badge">
                Category:{" "}
                {categories.find((c) => c.handle === selectedCategory)?.title || selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  aria-label="Reset category to all"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {priceFilter !== "all" && (
              <span className="active-filter-badge">
                Price:{" "}
                {priceFilter === "under-20"
                  ? "Under $20"
                  : priceFilter === "20-30"
                  ? "$20 – $30"
                  : "$30+"}
                <button
                  type="button"
                  onClick={() => setPriceFilter("all")}
                  aria-label="Reset price filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="active-filter-badge">
                In stock only
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  aria-label="Remove in-stock only filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedTag && (
              <span className="active-filter-badge">
                Tag: #{selectedTag}
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  aria-label="Remove tag filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {sortBy !== "featured" && (
              <span className="active-filter-badge">
                Sorted: {sortBy.replace("-", " ")}
                <button
                  type="button"
                  onClick={() => setSortBy("featured")}
                  aria-label="Reset sort to featured"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="catalog-reset-all-btn"
            >
              <RotateCcw size={12} />
              <span>Reset all</span>
            </button>
          </div>
        )}
      </section>

      {/* Product Results Grid or Empty State */}
      <section className="catalog-results-section" aria-label="Product results">
        {filteredProducts.length > 0 ? (
          <div className="product-grid catalog-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty-card">
            <div className="empty-icon-circle">
              <Sparkles size={24} className="empty-sparkle-icon" />
            </div>
            <h2 className="display empty-title">
              {hasActiveFilters
                ? "No finds match your selection."
                : "No finds in this collection yet."}
            </h2>
            <p className="empty-description">
              {hasActiveFilters
                ? "We couldn't find any products matching your specific combination of filters or search terms."
                : "New considered objects are currently being researched and added to this collection. Check back soon or explore our complete catalog."}
            </p>
            <div className="empty-actions">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="btn btn-empty-reset"
                >
                  <RotateCcw size={14} />
                  <span>Reset all filters</span>
                </button>
              )}
              <Link href="/collections/all" className="btn btn-light">
                Explore all collections
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
