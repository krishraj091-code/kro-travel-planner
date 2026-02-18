import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Settings = Record<string, any>;

export function useSiteSettings(pageKey: string): { settings: Settings; loading: boolean } {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("settings")
      .eq("page_key", pageKey)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data?.settings) {
          setSettings(data.settings as Settings);
        }
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [pageKey]);

  return { settings, loading };
}
