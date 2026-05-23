import { getLoginUrl } from "@/const";
import { onFirebaseAuthStateChanged, signoutFirebase } from "@/lib/firebase";
import { useCallback, useEffect, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onFirebaseAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
      localStorage.setItem("manus-runtime-user-info", JSON.stringify(u));
    });
    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signoutFirebase();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    const target = redirectPath ?? getLoginUrl();
    if (window.location.pathname === target) return;

    window.location.href = target;
  }, [redirectOnUnauthenticated, redirectPath, loading, user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    refresh: async () => {},
    logout,
  };
}
