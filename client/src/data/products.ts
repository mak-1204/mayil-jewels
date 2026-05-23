import type { Product } from "@/types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=750&fit=crop`;

export const products: Product[] = [
  {
    id: "1",
    name: "Temple Jhumka Earrings — Antique Finish",
    slug: "temple-jhumka-antique",
    description:
      "Handcrafted imitation jhumkas with antique gold-tone finish and pearl drops. Ideal for festive and wedding looks.",
    price: 1890,
    originalPrice: 2490,
    weight: 28,
    categoryId: "earrings",
    categorySlug: "earrings",
    style: "Antique",
    finish: "Antique gold-tone",
    featured: true,
    trending: true,
    isNew: true,
    image: img("1535632066927-ab7c9ab60908"),
    images: [img("1535632066927-ab7c9ab60908")],
    gender: "Women",
    occasion: ["festive", "wedding"],
  },
  {
    id: "2",
    name: "Heritage Coin Necklace Set",
    slug: "heritage-coin-necklace",
    description:
      "Antique-style layered necklace with coin motifs and matching earrings. Premium imitation craftsmanship.",
    price: 4590,
    categoryId: "necklaces",
    categorySlug: "necklaces",
    style: "Antique",
    finish: "Oxidised bronze-tone",
    weight: 95,
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
    name: "Kundan Cocktail Ring",
    slug: "kundan-cocktail-ring",
    description:
      "Statement imitation ring with kundan-style stones and adjustable band. Perfect for parties and receptions.",
    price: 890,
    originalPrice: 1190,
    categoryId: "rings",
    categorySlug: "rings",
    style: "Kundan",
    finish: "Gold-tone with stone work",
    weight: 12,
    featured: true,
    trending: true,
    isNew: true,
    image: img("1605100804763-247f67b3557e"),
    images: [img("1605100804763-247f67b3557e")],
    gender: "Women",
    occasion: ["party", "gifting"],
  },
  {
    id: "4",
    name: "Antique Kada Bangles (Pair)",
    slug: "antique-kada-bangles",
    description:
      "Wide imitation kada bangles with temple engraving and antique matte finish. Sold as a pair.",
    price: 3290,
    categoryId: "bangles",
    categorySlug: "bangles",
    style: "Antique",
    finish: "Antique matte gold-tone",
    weight: 120,
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
    name: "Pearl Drop Pendant Set",
    slug: "pearl-drop-pendant",
    description:
      "Delicate imitation pendant on a fashion chain with faux pearl centre. Includes matching studs.",
    price: 1490,
    categoryId: "pendants",
    categorySlug: "pendants",
    style: "Imitation",
    finish: "Gold-tone micro-plated",
    weight: 35,
    featured: true,
    trending: false,
    isNew: true,
    image: img("1599643478518-a784e5dc4c8f"),
    images: [img("1599643478518-a784e5dc4c8f")],
    gender: "Women",
    occasion: ["daily", "gifting"],
  },
  {
    id: "6",
    name: "Fashion Mangalsutra — Black Bead",
    slug: "fashion-mangalsutra",
    description:
      "Contemporary imitation mangalsutra with black beads and antique pendant. Lightweight for daily wear.",
    price: 990,
    categoryId: "mangalsutra",
    categorySlug: "mangalsutra",
    style: "Imitation",
    finish: "Antique gold-tone pendant",
    weight: 18,
    featured: true,
    trending: true,
    isNew: false,
    image: img("1611591437281-460bfbe1220a"),
    images: [img("1611591437281-460bfbe1220a")],
    gender: "Women",
    occasion: ["daily", "wedding"],
  },
  {
    id: "7",
    name: "Layered Fashion Chain",
    slug: "layered-fashion-chain",
    description:
      "Long imitation chain with delicate links — ideal for layering with pendants or solo wear.",
    price: 690,
    categoryId: "chains",
    categorySlug: "chains",
    style: "Imitation",
    finish: "Gold-tone",
    weight: 22,
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
    name: "Stone Line Bracelet",
    slug: "stone-line-bracelet",
    description:
      "Imitation tennis-style bracelet with high-shine crystal stones. Adjustable clasp for comfort.",
    price: 1290,
    categoryId: "bracelets",
    categorySlug: "bracelets",
    style: "Imitation",
    finish: "Silver-tone with crystals",
    weight: 24,
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
    name: "Oxidised Temple Long Earrings",
    slug: "oxidised-temple-earrings",
    description:
      "Long dangler earrings in oxidised silver-tone with traditional temple detailing.",
    price: 1190,
    categoryId: "earrings",
    categorySlug: "earrings",
    style: "Oxidised",
    finish: "Oxidised silver-tone",
    weight: 32,
    featured: false,
    trending: false,
    isNew: false,
    image: img("1535632066927-ab7c9ab60908"),
    images: [img("1535632066927-ab7c9ab60908")],
    gender: "Women",
    occasion: ["festive"],
  },
  {
    id: "10",
    name: "Antique Signet Ring — Men",
    slug: "antique-signet-ring-men",
    description:
      "Bold imitation signet ring with antique brush finish. Fashion accessory — not precious metal.",
    price: 790,
    categoryId: "rings",
    categorySlug: "rings",
    style: "Antique",
    finish: "Antique gold-tone",
    weight: 14,
    featured: false,
    trending: true,
    isNew: false,
    image: img("1605100804763-247f67b3557e"),
    images: [img("1605100804763-247f67b3557e")],
    gender: "Men",
    occasion: ["daily", "gifting"],
  },
  {
    id: "11",
    name: "Bridal Choker Set — Imitation Kundan",
    slug: "bridal-choker-kundan",
    description:
      "Full bridal set: choker, earrings, and maang tikka. High-quality imitation stones and gold-tone plating.",
    price: 8990,
    categoryId: "necklaces",
    categorySlug: "necklaces",
    style: "Kundan",
    finish: "Gold-tone kundan look",
    weight: 180,
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
    name: "Kids Star Pendant",
    slug: "kids-star-pendant",
    description:
      "Playful imitation star pendant on an adjustable chain. Safe, lightweight fashion jewellery for kids.",
    price: 490,
    categoryId: "pendants",
    categorySlug: "pendants",
    style: "Imitation",
    finish: "Gold-tone",
    weight: 8,
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
    style?: string;
    /** @deprecated use style — kept for old bookmarked URLs */
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
  const styleFilter = opts.style ?? opts.metal;
  let list = customProducts ? [...customProducts] : [...products];
  if (opts.category) {
    list = list.filter((p) => p.categorySlug === opts.category);
  }
  if (styleFilter) {
    list = list.filter((p) => p.style === styleFilter);
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
        p.style.toLowerCase().includes(q) ||
        p.finish?.toLowerCase().includes(q) ||
        p.categorySlug.includes(q)
    );
  }
  return list;
}
