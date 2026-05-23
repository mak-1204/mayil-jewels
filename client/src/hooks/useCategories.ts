import { useState, useEffect } from "react";
import { getFirebaseCategories } from "@/lib/firebase";
import type { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getFirebaseCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load categories from Firebase:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
