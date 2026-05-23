import { useState, useEffect } from "react";
import { getFirebaseProducts } from "@/lib/firebase";
import type { Product } from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getFirebaseProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load products from Firebase:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
