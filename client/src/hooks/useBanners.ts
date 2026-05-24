import { useState, useEffect, useCallback } from "react";
import { getFirebaseBanners } from "@/lib/firebase";
import type { HeroBanner } from "@/types";

export function useBanners(activeOnly = false) {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFirebaseBanners();
      setBanners(activeOnly ? data.filter((b) => b.active) : data);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => { refetch(); }, [refetch]);

  return { banners, loading, refetch };
}
