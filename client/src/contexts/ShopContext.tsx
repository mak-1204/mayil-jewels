import { getProductById } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

type ShopContextValue = {
  cart: Record<string, number>;
  wishlist: Set<string>;
  cartCount: number;
  cartItems: { product: Product; quantity: number }[];
  cartTotal: number;
  addToCart: (productId: string, qty?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearCart: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "mayil-cart";
const WISHLIST_KEY = "mayil-wishlist";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { products: dynamicProducts } = useProducts();
  const [cart, setCart] = useState<Record<string, number>>(() =>
    loadJson(CART_KEY, {})
  );
  const [wishlist, setWishlist] = useState<Set<string>>(
    () => new Set(loadJson<string[]>(WISHLIST_KEY, []))
  );

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
  }, [wishlist]);

  const addToCart = useCallback((productId: string, qty = 1) => {
    const product = getProductById(productId, dynamicProducts);
    if (!product) return;
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + qty,
    }));
    toast.success("Added to bag", { description: product.name });
  }, [dynamicProducts]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      return;
    }
    setCart((prev) => ({ ...prev, [productId]: quantity }));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
    toast.info("Removed from bag");
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        toast.info("Removed from wishlist");
      } else {
        next.add(productId);
        toast.success("Added to wishlist");
      }
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.has(productId),
    [wishlist]
  );

  const clearCart = useCallback(() => setCart({}), []);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => {
          const product = getProductById(id, dynamicProducts);
          return product ? { product, quantity } : null;
        })
        .filter(Boolean) as { product: Product; quantity: number }[],
    [cart, dynamicProducts]
  );

  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      cartItems,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      clearCart,
    }),
    [
      cart,
      wishlist,
      cartCount,
      cartItems,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      clearCart,
    ]
  );

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
