import { useShop } from "@/contexts/ShopContext";
import { formatINR } from "@/lib/format";
import type { Product } from "@/types";
import { Heart } from "lucide-react";
import { Link } from "wouter";

type Props = {
  product: Product;
  compact?: boolean;
};

export default function ProductCard({ product, compact }: Props) {
  const { toggleWishlist, isWishlisted, addToCart } = useShop();
  const wished = isWishlisted(product.id);
  const discount =
    product.originalPrice &&
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  return (
    <article className="group relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] bg-secondary/40 overflow-hidden rounded-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-[var(--brand)] text-white text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider">
              New
            </span>
          )}
          {discount && (
            <span className="absolute top-2 right-10 bg-black/70 text-white text-[10px] px-1.5 py-0.5">
              {discount}% OFF
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${wished ? "fill-[var(--brand)] text-[var(--brand)]" : "text-foreground/70"}`}
            />
          </button>
          {!compact && (
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product.id);
                }}
                className="w-full py-2 bg-white text-foreground text-xs font-semibold uppercase tracking-wider hover:bg-[var(--brand)] hover:text-white transition-colors"
              >
                Add to Bag
              </button>
            </div>
          )}
        </div>
        <div className={`pt-3 ${compact ? "space-y-0.5" : "space-y-1"}`}>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {product.metal} · {product.purity}
          </p>
          <h3
            className={`font-medium leading-snug group-hover:text-[var(--brand)] transition-colors ${
              compact ? "text-sm line-clamp-1" : "text-sm line-clamp-2"
            }`}
          >
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-[var(--brand)]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
