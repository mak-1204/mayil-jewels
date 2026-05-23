import PageLayout from "@/components/layout/PageLayout";
import ProductCard from "@/components/product/ProductCard";
import { useShop } from "@/contexts/ShopContext";
import { filterProducts, getProductById } from "@/data/products";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";
import {
  Heart,
  Minus,
  Plus,
  Share2,
  Shield,
  ShoppingBag,
  Truck,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import { WHATSAPP_NUMBER } from "@/const";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { products, loading } = useProducts();
  const product = params?.id ? getProductById(params.id, products) : undefined;
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-24">
          <Spinner className="w-8 h-8 text-[var(--brand)]" />
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container py-24 text-center">
          <h1 className="font-serif text-2xl mb-4">Product not found</h1>
          <Button asChild>
            <Link href="/collections">Back to shop</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const related = filterProducts({ category: product.categorySlug }, products)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const images = product.images.length ? product.images : [product.image];
  const wished = isWishlisted(product.id);

  return (
    <PageLayout>
      <div className="container py-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-[var(--brand)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-[var(--brand)]">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-secondary/30 rounded-sm overflow-hidden">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                   key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-24 rounded-sm overflow-hidden border-2 ${
                    i === activeImage ? "border-[var(--brand)]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--brand)] mb-2">
                {product.style}
                {product.finish ? ` · ${product.finish}` : ""}
              </p>
              <h1 className="font-serif text-2xl md:text-3xl leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-[var(--brand)]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.weight && (
                <p className="text-sm text-muted-foreground mt-2">
                  Piece weight: {product.weight}g (approx., fashion jewellery)
                </p>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center border rounded-sm">
                <button
                  type="button"
                  className="p-2 hover:bg-secondary"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  type="button"
                  className="p-2 hover:bg-secondary"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 h-12 bg-[var(--brand)] hover:bg-[var(--brand-dark)] rounded-sm uppercase tracking-wider text-xs"
                onClick={() => addToCart(product.id, qty)}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Bag
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-sm"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  className={`w-4 h-4 ${wished ? "fill-[var(--brand)] text-[var(--brand)]" : ""}`}
                />
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copied");
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <Button
              className="w-full h-12 rounded-sm bg-[#25D366] hover:bg-[#20ba5a] text-white border-none uppercase tracking-wider text-xs font-semibold flex items-center justify-center"
              onClick={() => {
                const message = `Hello Mayil Jewels! I would like to inquire about ordering this item:\n\n*${product.name}*\nQuantity: ${qty}\nPrice: ${formatINR(product.price * qty)}\nLink: ${window.location.href}`;
                const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                window.open(url, "_blank");
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Order via WhatsApp
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              For inquiries, call <a href="tel:+14693676317" className="underline hover:text-[var(--brand)] font-medium">+1 (469) 367-6317</a>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
              {[
                { icon: Sparkles, text: "Antique / imitation finish" },
                { icon: Shield, text: "Anti-tarnish protective layer" },
                { icon: Truck, text: "Fashion jewellery — not precious metal" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-[var(--brand)] shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-2xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
