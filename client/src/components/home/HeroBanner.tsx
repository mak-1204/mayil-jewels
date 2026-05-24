import { useWorldCollections } from "@/hooks/useWorldCollections";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroBanner() {
  const { collections, loading } = useWorldCollections();
  const [current, setCurrent] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (collections.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % collections.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [collections.length]);

  if (loading || collections.length === 0) return null;

  const sortedCollections = [...collections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section className="relative w-full overflow-hidden bg-[#2c2117]">
      {/* Banner slides */}
      <div className="relative aspect-[21/9] sm:aspect-[21/8] md:aspect-[21/7]">
        {sortedCollections.map((b, idx) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Link
              href={b.href || "/collections"}
              className="block w-full h-full cursor-pointer"
            >
              <img
                src={b.bannerImage || b.image}
                alt={b.title}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {sortedCollections.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrent((p) => (p - 1 + sortedCollections.length) % sortedCollections.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((p) => (p + 1) % sortedCollections.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {sortedCollections.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-6" : "bg-white/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
