import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function ExploreCollectionsCTA() {
  return (
    <section className="py-20 bg-[#f8f0f1]/60 border-y border-border/30">
      <div className="container text-center max-w-2xl mx-auto">
        <span className="text-[var(--brand)] text-xs font-semibold uppercase tracking-[0.2em] mb-3 block">
          CURATED PIECES
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mb-4 text-foreground leading-tight">
          Explore Our Timeless Collections
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
          Discover a beautiful catalog of premium antique, temple, and bridal jewellery designed to make every single occasion unforgettable.
        </p>
        <div className="flex justify-center">
          <Button
            asChild
            className="bg-[#832729] hover:bg-[#6b1f21] hover:scale-105 transition-all duration-300 rounded-full px-8 py-6 text-sm uppercase tracking-[0.15em] font-semibold shadow-[0_4px_14px_rgba(131,39,41,0.3)] hover:shadow-[0_6px_20px_rgba(131,39,41,0.45)] group h-auto"
          >
            <Link href="/collections" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              Explore All Collections
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
