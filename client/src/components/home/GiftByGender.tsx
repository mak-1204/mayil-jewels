import { Link } from "wouter";

const genders = [
  {
    label: "Women",
    href: "/collections?gender=Women",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop",
  },
  {
    label: "Men",
    href: "/collections?gender=Men",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=600&fit=crop",
  },
  {
    label: "Kids",
    href: "/collections?gender=Kids",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop",
  },
];

export default function GiftByGender() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-[var(--brand)] text-sm font-semibold uppercase tracking-widest mb-2">
            #GiftOfChoice
          </p>
          <h2 className="font-serif text-3xl">Curated For You</h2>
          <p className="text-muted-foreground mt-2">Shop By Gender · Starting at ₹10,000</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {genders.map((g) => (
            <Link
              key={g.label}
              href={g.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm"
            >
              <img
                src={g.image}
                alt={g.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <span className="absolute bottom-6 left-6 text-white font-serif text-2xl">
                {g.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
