import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SETTINGS, type Settings } from "../types";
import { KEYS, loadJSON, saveJSON } from "../lib/storage";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() =>
    loadJSON<Settings>(KEYS.SETTINGS, DEFAULT_SETTINGS),
  );

  useEffect(() => {
    saveJSON(KEYS.SETTINGS, settings);
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return { settings, update };
}
