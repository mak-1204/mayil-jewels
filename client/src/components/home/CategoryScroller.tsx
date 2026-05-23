import { Link } from "wouter";
import { useCategories } from "@/hooks/useCategories";
import { Spinner } from "@/components/ui/spinner";

export default function CategoryScroller() {
  const { categories, loading } = useCategories();

  // Show first 7 categories in grid, 8th slot is "View All"
  const gridCategories = categories.slice(0, 7);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            Find Your Perfect Match
          </h2>
          <p className="text-muted-foreground text-sm">Shop by Categories</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner className="w-8 h-8 text-[var(--brand)]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {gridCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/collections?category=${cat.slug}`}
                className="group flex flex-col"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden border border-border/50 shadow-sm group-hover:shadow-md transition-all duration-300 bg-secondary/15">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=400&h=500&fit=crop";
                    }}
                  />
                </div>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-center text-foreground group-hover:text-[var(--brand)] transition-colors mt-2">
                  {cat.name}
                </p>
              </Link>
            ))}

            {/* View All Card */}
            <Link href="/collections" className="group flex flex-col">
              <div className="aspect-[4/5] rounded-xl border border-dashed border-[var(--brand)]/30 group-hover:border-[var(--brand)] bg-secondary/10 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 shadow-sm group-hover:shadow-md">
                <span className="text-3xl md:text-4xl font-serif text-[var(--brand)] font-semibold mb-2">
                  {categories.length}+
                </span>
                <span className="text-xs md:text-sm text-muted-foreground leading-snug">
                  Categories to choose from
                </span>
              </div>
              <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-center text-foreground group-hover:text-[var(--brand)] transition-colors mt-2">
                View All
              </p>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
