import AssuranceSection from "@/components/home/AssuranceSection";
import CategoryScroller from "@/components/home/CategoryScroller";
import ExperienceCTA from "@/components/home/ExperienceCTA";
import GiftByGender from "@/components/home/GiftByGender";
import ProductRow from "@/components/home/ProductRow";
import WorldCollections from "@/components/home/WorldCollections";
import PageLayout from "@/components/layout/PageLayout";
import { filterProducts } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { products, loading } = useProducts();

  const trending = filterProducts({ trending: true }, products).slice(0, 4);
  const newArrivals = filterProducts({ isNew: true }, products).slice(0, 4);
  const featured = filterProducts({}, products).filter((p) => p.featured).slice(0, 4);

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
      <CategoryScroller />
      <ProductRow
        title="Trending Now"
        subtitle="Jewellery pieces everyone's eyeing right now"
        products={trending}
        viewAllHref="/collections?trending=true"
      />
      <WorldCollections />
      <ProductRow
        title="New Arrivals"
        subtitle="500+ new items — explore the latest launches"
        products={newArrivals}
        viewAllHref="/collections?new=true"
      />
      <AssuranceSection />
      <ProductRow
        title="Editor's Picks"
        subtitle="Handpicked antique & imitation favourites"
        products={featured}
        viewAllHref="/collections?style=Imitation"
      />
      <GiftByGender />
      <ExperienceCTA />
    </PageLayout>
  );
}
