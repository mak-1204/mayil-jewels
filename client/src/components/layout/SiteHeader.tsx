import { useShop } from "@/contexts/ShopContext";
import { useCategories } from "@/hooks/useCategories";
import CategoryBar from "@/components/home/CategoryBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Camera,
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import VisualSearchDialog from "./VisualSearchDialog";
import StylingAssistantDialog from "./StylingAssistantDialog";

const navLinks = [
  { label: "All Jewellery", href: "/collections" },
  { label: "Antique", href: "/collections?style=Antique" },
  { label: "Imitation", href: "/collections?style=Imitation" },
  { label: "Wedding", href: "/collections?world=wedding" },
  { label: "New Arrivals", href: "/collections?new=true" },
  { label: "Stores", href: "/stores" },
];

export default function SiteHeader() {
  const [location, setLocation] = useLocation();
  const { cartCount } = useShop();
  const { categories } = useCategories();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [visualOpen, setVisualOpen] = useState(false);
  const [stylingOpen, setStylingOpen] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setLocation(q ? `/collections?q=${encodeURIComponent(q)}` : "/collections");
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/60 shadow-sm">
      <div className="border-b border-border/40">
        <div className="container flex items-center justify-between h-14 md:h-16 gap-4">
          <Link href="/" className="shrink-0 flex items-center">
            <img
              src="/logo.png"
              alt="Mayil Jewels"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          <form
            onSubmit={submitSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search antique necklace, jhumkas, bangles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-24 rounded-sm border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
              />
              <button
                type="button"
                onClick={() => setVisualOpen(true)}
                className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-[var(--brand)] font-medium px-2 py-1 hover:bg-secondary rounded-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                Visual
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 md:gap-3">
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/stores" className="hidden lg:flex p-2 hover:text-[var(--brand)]" title="Find store">
              <MapPin className="w-5 h-5" />
            </Link>
            <Link href="/wishlist" className="p-2 hover:text-[var(--brand)] relative">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 hover:text-[var(--brand)] relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--brand)] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <button type="button" className="lg:hidden p-2" aria-label="Menu">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="font-serif text-[var(--brand)] tracking-widest">
                    MENU
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                  {navLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="py-3 border-b border-border/50 text-sm font-medium hover:text-[var(--brand)]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {categories.slice(0, 6).map((c) => (
                    <Link
                      key={c.id}
                      href={`/collections?category=${c.slug}`}
                      className="text-xs text-center py-2 bg-secondary/50 rounded-sm hover:bg-secondary"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="md:hidden px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                placeholder="Search jewellery..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 rounded-sm border text-sm"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      <CategoryBar />

      <VisualSearchDialog open={visualOpen} onOpenChange={setVisualOpen} />
      <StylingAssistantDialog open={stylingOpen} onOpenChange={setStylingOpen} />
    </header>
  );
}
