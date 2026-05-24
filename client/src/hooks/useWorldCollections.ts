import { useState, useEffect, useCallback } from "react";
import { getFirebaseWorldCollections } from "@/lib/firebase";
import type { WorldCollection } from "@/types";

export function useWorldCollections() {
  const [collections, setCollections] = useState<WorldCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFirebaseWorldCollections();
      setCollections(data);
    } catch (err) {
      console.error("Failed to fetch world collections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { collections, loading, refetch };
}
