import { useState, useEffect } from "react";
import { getFirebaseCoupons } from "@/lib/firebase";
import type { Coupon } from "@/types";

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getFirebaseCoupons();
      setCoupons(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load coupons from Firebase:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return {
    coupons,
    loading,
    error,
    refetch: fetchCoupons,
  };
}
