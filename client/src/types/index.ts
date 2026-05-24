export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type ProductStyle =
  | "Antique"
  | "Imitation"
  | "Temple"
  | "Kundan"
  | "Oxidised";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  weight?: number;
  categoryId: string;
  categorySlug: string;
  style: ProductStyle;
  finish?: string;
  featured: boolean;
  trending: boolean;
  isNew: boolean;
  image: string;
  images: string[];
  gender?: "Women" | "Men" | "Kids";
  occasion?: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Store = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  distance?: string;
};

export type WorldCollection = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  bannerImage?: string;
  href: string;
  order?: number;
};

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
  active: boolean;
  order?: number;
};

export type Coupon = {
  id: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  active: boolean;
};
