import type { Product } from "@/types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=750&fit=crop`;

export const products: Product[] = [
  {
    id: "1",
    name: "Floral Bloom Diamond Stud Earrings",
    slug: "floral-bloom-diamond-studs",
    description:
      "Delicate floral motif studs with brilliant-cut diamonds set in 18KT yellow gold.",
    price: 45670,
    originalPrice: 48990,
    weight: 3.2,
    categoryId: "earrings",
    categorySlug: "earrings",
    metal: "Diamond",
    purity: "18KT",
    featured: true,
    trending: true,
    isNew: true,
    image: img("1535632066927-ab7c9ab60908"),
    images: [img("1535632066927-ab7c9ab60908"), img("1599643478518-a784e5dc4c8f")],
    gender: "Women",
    occasion: ["daily", "gifting"],
  },
  {
    id: "2",
    name: "Royal Heritage Gold Necklace",
    slug: "royal-heritage-gold-necklace",
    description:
      "Temple-inspired necklace with intricate nakshi work in 22KT hallmarked gold.",
    price: 285400,
    categoryId: "necklaces",
    categorySlug: "necklaces",
    metal: "Gold",
    purity: "22KT",
    weight: 42.5,
    featured: true,
    trending: true,
    isNew: false,
    image: img("1599459183761-45c31a2b2b0e"),
    images: [img("1599459183761-45c31a2b2b0e")],
    gender: "Women",
    occasion: ["wedding", "festive"],
  },
  {
    id: "3",
    name: "Eternal Bond Diamond Ring",
    slug: "eternal-bond-diamond-ring",
    description:
      "Solitaire engagement ring with IJ-SI diamond in platinum finish 18KT gold.",
    price: 125000,
    originalPrice: 132000,
    categoryId: "rings",
    categorySlug: "rings",
    metal: "Diamond",
    purity: "18KT",
    weight: 4.1,
    featured: true,
    trending: true,
    isNew: true,
    image: img("1605100804763-247f67b3557e"),
    images: [img("1605100804763-247f67b3557e")],
    gender: "Women",
    occasion: ["wedding", "gifting"],
  },
  {
    id: "4",
    name: "Classic Gold Kada Bangles",
    slug: "classic-gold-kada-bangles",
    description: "Pair of handcrafted kada bangles with antique matte finish.",
    price: 198500,
    categoryId: "bangles",
    categorySlug: "bangles",
    metal: "Gold",
    purity: "22KT",
    weight: 56,
    featured: false,
    trending: true,
    isNew: false,
    image: img("1573408301185-9146fe634ad0"),
    images: [img("1573408301185-9146fe634ad0")],
    gender: "Women",
    occasion: ["wedding", "festive"],
  },
  {
    id: "5",
    name: "Grace Diamond Pendant",
    slug: "grace-diamond-pendant",
    description: "Teardrop pendant with micro-pavé halo on an 18KT gold chain.",
    price: 67890,
    categoryId: "pendants",
    categorySlug: "pendants",
    metal: "Diamond",
    purity: "18KT",
    weight: 5.8,
    featured: true,
    trending: false,
    isNew: true,
    image: img("1599643478518-a784e5dc4c8f"),
    images: [img("1599643478518-a784e5dc4c8f")],
    gender: "Women",
    occasion: ["gifting", "daily"],
  },
  {
    id: "6",
    name: "Sacred Union Mangalsutra",
    slug: "sacred-union-mangalsutra",
    description:
      "Contemporary black bead mangalsutra with diamond-studded pendant.",
    price: 89200,
    categoryId: "mangalsutra",
    categorySlug: "mangalsutra",
    metal: "Diamond",
    purity: "18KT",
    weight: 8.2,
    featured: true,
    trending: true,
    isNew: false,
    image: img("1611591437281-460bfbe1220a"),
    images: [img("1611591437281-460bfbe1220a")],
    gender: "Women",
    occasion: ["wedding"],
  },
  {
    id: "7",
    name: "Minimalist Gold Chain",
    slug: "minimalist-gold-chain",
    description: "Lightweight foxtail chain perfect for everyday layering.",
    price: 42500,
    categoryId: "chains",
    categorySlug: "chains",
    metal: "Gold",
    purity: "22KT",
    weight: 12.4,
    featured: false,
    trending: true,
    isNew: true,
    image: img("1515562141207-7a88fb7ce338"),
    images: [img("1515562141207-7a88fb7ce338")],
    gender: "Women",
    occasion: ["daily"],
  },
  {
    id: "8",
    name: "Celestial Tennis Bracelet",
    slug: "celestial-tennis-bracelet",
    description: "Continuous line of round diamonds in 18KT white gold.",
    price: 156000,
    categoryId: "bracelets",
    categorySlug: "bracelets",
    metal: "Diamond",
    purity: "18KT",
    weight: 11.2,
    featured: true,
    trending: true,
    isNew: true,
    image: img("1617038260897-41a9ef663135"),
    images: [img("1617038260897-41a9ef663135")],
    gender: "Women",
    occasion: ["party", "gifting"],
  },
  {
    id: "9",
    name: "Heritage Temple Earrings",
    slug: "heritage-temple-earrings",
    description: "Long jhumka earrings with ruby and emerald accents.",
    price: 112300,
    categoryId: "earrings",
    categorySlug: "earrings",
    metal: "Gold",
    purity: "22KT",
    weight: 18.6,
    featured: false,
    trending: false,
    isNew: false,
    image: img("1535632066927-ab7c9ab60908"),
    images: [img("1535632066927-ab7c9ab60908")],
    gender: "Women",
    occasion: ["festive", "wedding"],
  },
  {
    id: "10",
    name: "Gents Signet Gold Ring",
    slug: "gents-signet-gold-ring",
    description: "Bold signet ring with brushed finish in 18KT yellow gold.",
    price: 38900,
    categoryId: "rings",
    categorySlug: "rings",
    metal: "Gold",
    purity: "18KT",
    weight: 9.5,
    featured: false,
    trending: true,
    isNew: false,
    image: img("1605100804763-247f67b3557e"),
    images: [img("1605100804763-247f67b3557e")],
    gender: "Men",
    occasion: ["gifting", "daily"],
  },
  {
    id: "11",
    name: "Bridal Choker Set",
    slug: "bridal-choker-set",
    description: "Complete bridal set with choker, earrings and maang tikka.",
    price: 485000,
    categoryId: "necklaces",
    categorySlug: "necklaces",
    metal: "Gold",
    purity: "22KT",
    weight: 78,
    featured: true,
    trending: true,
    isNew: true,
    image: img("1519741497674-611481863552"),
    images: [img("1519741497674-611481863552")],
    gender: "Women",
    occasion: ["wedding"],
  },
  {
    id: "12",
    name: "Kids Star Diamond Pendant",
    slug: "kids-star-diamond-pendant",
    description: "Playful star pendant on adjustable 14KT gold chain.",
    price: 24500,
    categoryId: "pendants",
    categorySlug: "pendants",
    metal: "Diamond",
    purity: "14KT",
    weight: 2.1,
    featured: false,
    trending: false,
    isNew: true,
    image: img("1599643478518-a784e5dc4c8f"),
    images: [img("1599643478518-a784e5dc4c8f")],
    gender: "Kids",
    occasion: ["gifting"],
  },
];

export function getProductById(id: string, list: Product[] = products) {
  return list.find((p) => p.id === id);
}

export function getProductBySlug(slug: string, list: Product[] = products) {
  return list.find((p) => p.slug === slug);
}

export function filterProducts(
  opts: {
    category?: string;
    metal?: string;
    world?: string;
    occasion?: string;
    gender?: string;
    query?: string;
    trending?: boolean;
    isNew?: boolean;
  },
  customProducts?: Product[]
) {
  let list = customProducts ? [...customProducts] : [...products];
  if (opts.category) {
    list = list.filter((p) => p.categorySlug === opts.category);
  }
  if (opts.metal) {
    list = list.filter((p) => p.metal === opts.metal);
  }
  if (opts.world === "wedding") {
    list = list.filter((p) => p.occasion?.includes("wedding"));
  }
  if (opts.occasion === "daily") {
    list = list.filter((p) => p.occasion?.includes("daily"));
  }
  if (opts.gender) {
    list = list.filter((p) => p.gender === opts.gender);
  }
  if (opts.trending) {
    list = list.filter((p) => p.trending);
  }
  if (opts.isNew) {
    list = list.filter((p) => p.isNew);
  }
  if (opts.query) {
    const q = opts.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.metal.toLowerCase().includes(q) ||
        p.categorySlug.includes(q)
    );
  }
  return list;
}
