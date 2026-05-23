import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "earrings",
    name: "Earrings",
    slug: "earrings",
    description: "Studs, drops & jhumkas",
    image:
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=500&fit=crop",
  },
  {
    id: "rings",
    name: "Finger Rings",
    slug: "rings",
    description: "Engagement & daily wear",
    image:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=500&fit=crop",
  },
  {
    id: "pendants",
    name: "Pendants",
    slug: "pendants",
    description: "Elegant neck pieces",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a9ef663135?w=400&h=500&fit=crop",
  },
  {
    id: "mangalsutra",
    name: "Mangalsutra",
    slug: "mangalsutra",
    description: "Traditional & modern",
    image:
      "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=400&h=500&fit=crop",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    slug: "bracelets",
    description: "Chains & tennis styles",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a9ef663135?w=400&h=500&fit=crop",
  },
  {
    id: "bangles",
    name: "Bangles",
    slug: "bangles",
    description: "Kadas & traditional",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop",
  },
  {
    id: "chains",
    name: "Chains",
    slug: "chains",
    description: "Classic gold chains",
    image:
      "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=400&h=500&fit=crop",
  },
  {
    id: "necklaces",
    name: "Necklaces",
    slug: "necklaces",
    description: "Temple & bridal sets",
    image:
      "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=400&h=500&fit=crop",
  },
];

export const worldCollections = [
  {
    id: "wedding",
    title: "Wedding",
    subtitle: "Bridal & ceremony",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
    href: "/collections?world=wedding",
  },
  {
    id: "gold",
    title: "Gold",
    subtitle: "22K & 18K classics",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a9ef663135?w=600&h=800&fit=crop",
    href: "/collections?metal=Gold",
  },
  {
    id: "diamond",
    title: "Diamond",
    subtitle: "Certified brilliance",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=800&fit=crop",
    href: "/collections?metal=Diamond",
  },
  {
    id: "dailywear",
    title: "Daily Wear",
    subtitle: "Lightweight elegance",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop",
    href: "/collections?occasion=daily",
  },
];
