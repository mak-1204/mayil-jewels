import { useState, useEffect } from "react";
import { getFirebaseDeliverySettings, updateFirebaseDeliverySettings, DeliverySettings } from "@/lib/firebase";

export function useDeliverySettings() {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getFirebaseDeliverySettings();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: DeliverySettings) => {
    await updateFirebaseDeliverySettings(newSettings);
    setSettings(newSettings);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    refetch: fetchSettings,
    updateSettings,
  };
}
