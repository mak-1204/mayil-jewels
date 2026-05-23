import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

const slides = [
  {
    title: "New Arrivals",
    subtitle: "500+ new designs dropping daily",
    cta: "Shop Now",
    href: "/collections?new=true",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=600&fit=crop",
  },
  {
    title: "Wedding Collection",
    subtitle: "Bridal sets crafted for your big day",
    cta: "Explore Wedding",
    href: "/collections?world=wedding",
    image:
      "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=1400&h=600&fit=crop",
  },
  {
    title: "Diamond Styling 101",
    subtitle: "Trendsetting pieces for every occasion",
    cta: "Shop Diamonds",
    href: "/collections?metal=Diamond",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&h=600&fit=crop",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-[50vh] md:h-[65vh] min-h-[320px] overflow-hidden bg-black">
      {slides.map((s, i) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center">
        <div className="container text-white max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] mb-3 text-white/80">
            Mayil Collections
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            {slide.title}
          </h1>
          <p className="text-lg text-white/90 mb-8">{slide.subtitle}</p>
          <Button
            asChild
            size="lg"
            className="bg-white text-[var(--brand)] hover:bg-white/90 rounded-sm uppercase tracking-wider text-xs h-12 px-8"
          >
            <Link href={slide.href}>{slide.cta}</Link>
          </Button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-4 bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
