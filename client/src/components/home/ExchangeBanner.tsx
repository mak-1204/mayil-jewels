import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ExchangeBanner() {
  return (
    <section className="py-10 bg-[var(--brand)] text-white">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl mb-2">Fashion Jewellery, Crafted to Last</h2>
          <p className="text-white/90 text-sm md:text-base max-w-xl">
            Antique and imitation pieces with premium plating and anti-tarnish care — beautiful
            looks for weddings, festivals, and everyday style. Not sold as precious metal jewellery.
          </p>
        </div>
        <Button
          asChild
          variant="secondary"
          className="rounded-sm uppercase tracking-wider text-xs h-11 px-8 shrink-0"
        >
          <Link href="/collections">Shop Collections</Link>
        </Button>
      </div>
    </section>
  );
}
