import { worldCollections } from "@/data/categories";
import { Link } from "wouter";

export default function WorldCollections() {
  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl mb-2">Mayil World</h2>
          <p className="text-muted-foreground">A companion for every occasion</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {worldCollections.map((w) => (
            <Link
              key={w.id}
              href={w.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm"
            >
              <img
                src={w.image}
                alt={w.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-serif text-xl md:text-2xl">{w.title}</h3>
                <p className="text-xs text-white/80 mt-1">{w.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
