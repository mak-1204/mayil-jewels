import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "earrings",
    name: "Earrings",
    slug: "earrings",
    description: "Jhumkas, studs & drops",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
  },
  {
    id: "rings",
    name: "Finger Rings",
    slug: "rings",
    description: "Statement & daily wear",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
  },
  {
    id: "pendants",
    name: "Pendants",
    slug: "pendants",
    description: "Layered neck pieces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
  },
  {
    id: "mangalsutra",
    name: "Mangalsutra",
    slug: "mangalsutra",
    description: "Traditional & fashion styles",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    slug: "bracelets",
    description: "Kadas & cuff styles",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a9ef663135?w=400&h=400&fit=crop",
  },
  {
    id: "bangles",
    name: "Bangles",
    slug: "bangles",
    description: "Stackable & temple sets",
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
  },
  {
    id: "chains",
    name: "Chains",
    slug: "chains",
    description: "Long & short fashion chains",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
  },
  {
    id: "necklaces",
    name: "Necklaces",
    slug: "necklaces",
    description: "Antique & bridal sets",
    image:
      "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=400&h=400&fit=crop",
  },
];

export const worldCollections = [
  {
    id: "wedding",
    title: "Wedding",
    subtitle: "Bridal & ceremony looks",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
    href: "/collections?world=wedding",
  },
  {
    id: "antique",
    title: "Antique",
    subtitle: "Vintage temple & heritage",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a9ef663135?w=600&h=800&fit=crop",
    href: "/collections?style=Antique",
  },
  {
    id: "imitation",
    title: "Imitation",
    subtitle: "Fashion & party wear",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=800&fit=crop",
    href: "/collections?style=Imitation",
  },
  {
    id: "dailywear",
    title: "Daily Wear",
    subtitle: "Lightweight everyday pieces",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop",
    href: "/collections?occasion=daily",
  },
];
