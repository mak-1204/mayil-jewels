import AssuranceSection from "@/components/home/AssuranceSection";
import CategoryScroller from "@/components/home/CategoryScroller";
import ExperienceCTA from "@/components/home/ExperienceCTA";
import ExploreCollectionsCTA from "@/components/home/ExploreCollectionsCTA";
import HeroBanner from "@/components/home/HeroBanner";
import ProductRow from "@/components/home/ProductRow";
import PageLayout from "@/components/layout/PageLayout";
import { filterProducts } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export default function Home() {
  const { products, loading } = useProducts();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small timeout to allow content/images to render
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, []);

  const trending = filterProducts({ trending: true }, products).slice(0, 4);
  const newArrivals = filterProducts({ isNew: true }, products).slice(0, 4);

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
      <div id="home">
        <HeroBanner />
      </div>
      <div id="categories">
        <CategoryScroller />
      </div>
      <div id="trending">
        <ProductRow
          title="Trending Now"
          subtitle="Jewellery pieces everyone's eyeing right now"
          products={trending}
          viewAllHref="/collections?trending=true"
        />
      </div>
      <div id="new-arrivals">
        <ProductRow
          title="New Arrivals"
          subtitle="500+ new items — explore the latest launches"
          products={newArrivals}
          viewAllHref="/collections?new=true"
        />
      </div>
      <ExploreCollectionsCTA />
      <div id="promise">
        <AssuranceSection />
      </div>
      <div id="experience">
        <ExperienceCTA />
      </div>
    </PageLayout>
  );
}
