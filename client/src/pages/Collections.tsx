import PageLayout from "@/components/layout/PageLayout";
import ProductCard from "@/components/product/ProductCard";
import { filterProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearch } from "wouter";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Spinner } from "@/components/ui/spinner";

function useQueryParams() {
  const search = useSearch();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Collections() {
  const { products: rawProducts, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const params = useQueryParams();
  const category = params.get("category") ?? undefined;
  const style =
    params.get("style") ?? params.get("metal") ?? undefined;
  const world = params.get("world") ?? undefined;
  const occasion = params.get("occasion") ?? undefined;
  const gender = params.get("gender") ?? undefined;
  const query = params.get("q") ?? undefined;
  const trending = params.get("trending") === "true";
  const isNew = params.get("new") === "true";

  const loading = productsLoading || categoriesLoading;

  const products = filterProducts(
    {
      category,
      style,
      world,
      occasion,
      gender,
      query,
      trending: trending || undefined,
      isNew: isNew || undefined,
    },
    rawProducts
  );

  const title = useMemo(() => {
    if (query) return `Results for "${query}"`;
    if (style) return `${style} Collection`;
    if (world === "wedding") return "Wedding Collection";
    if (isNew) return "New Arrivals";
    if (trending) return "Trending Now";
    if (category) return categories.find((c) => c.slug === category)?.name ?? "Collections";
    if (gender) return `${gender}'s Jewellery`;
    return "All Jewellery";
  }, [query, style, world, isNew, trending, category, gender, categories]);

  if (loading) {
    return (
      <PageLayout>
        <div className="bg-secondary/30 border-b border-border py-8 md:py-12">
          <div className="container">
            <h1 className="font-serif text-3xl md:text-4xl mb-2">{title}</h1>
            <p className="text-muted-foreground text-sm">Loading designs...</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-24">
          <Spinner className="w-8 h-8 text-[var(--brand)]" />
        </div>
      </PageLayout>
    );
  }

  const FilterSidebar = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </div>
        {/* Close button — only visible on mobile */}
        <button
          className="lg:hidden p-1 rounded-sm hover:bg-secondary"
          onClick={() => setFiltersOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Category</p>
        <div className="space-y-1">
          <a
            href="/collections"
            className={`block text-sm py-1.5 ${!category ? "text-[var(--brand)] font-medium" : "hover:text-[var(--brand)]"}`}
          >
            All
          </a>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/collections?category=${c.slug}`}
              className={`block text-sm py-1.5 ${
                category === c.slug ? "text-[var(--brand)] font-medium" : "hover:text-[var(--brand)]"
              }`}
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Style</p>
        <Select
          value={style ?? "all"}
          onValueChange={(v) => {
            window.location.href =
              v === "all" ? "/collections" : `/collections?style=${encodeURIComponent(v)}`;
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All styles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Antique">Antique</SelectItem>
            <SelectItem value="Imitation">Imitation</SelectItem>
            <SelectItem value="Temple">Temple</SelectItem>
            <SelectItem value="Kundan">Kundan</SelectItem>
            <SelectItem value="Oxidised">Oxidised</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <div className="bg-secondary/30 border-b border-border py-8 md:py-12">
        <div className="container flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl mb-1">{title}</h1>
            <p className="text-muted-foreground text-sm">
              {products.length} {products.length === 1 ? "design" : "designs"}
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-sm text-sm font-medium hover:bg-secondary transition-colors"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Mobile filter drawer overlay */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto shadow-xl">
            {FilterSidebar}
          </div>
        </div>
      )}

      <div className="container py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-56 shrink-0">
            {FilterSidebar}
          </aside>

          <div className="flex-1 min-w-0">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground mb-4">
                  No products match your filters
                </p>
                <Button asChild variant="outline">
                  <a href="/collections">View all jewellery</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
