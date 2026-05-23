import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
};

export default function ProductRow({ title, subtitle, products, viewAllHref }: Props) {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-[var(--brand)] flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
