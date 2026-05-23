import PageLayout from "@/components/layout/PageLayout";
import ProductCard from "@/components/product/ProductCard";
import { useShop } from "@/contexts/ShopContext";
import { getProductById } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { useProducts } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";

export default function Wishlist() {
  const { wishlist } = useShop();
  const { products: dynamicProducts, loading } = useProducts();
  const products = [...wishlist]
    .map((id) => getProductById(id, dynamicProducts))
    .filter(Boolean);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-24">
          <Spinner className="w-8 h-8 text-[var(--brand)]" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8 md:py-12">
        <h1 className="font-serif text-3xl mb-2">Wishlist</h1>
        <p className="text-muted-foreground text-sm mb-10">
          {products.length} saved {products.length === 1 ? "item" : "items"}
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => p && <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-6">No items in your wishlist yet</p>
            <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand-dark)]">
              <Link href="/collections">Explore Collections</Link>
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
