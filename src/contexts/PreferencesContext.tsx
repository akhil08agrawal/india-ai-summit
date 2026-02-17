import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device-id";

export interface Preferences {
  persona: string | null;
  interests: string[];
  visitDay: number | null; // 1-5 or null for "show all"
  whatsapp: string | null;
  workingOn: string | null;
  lookingFor: string[];
}

interface PreferencesContextType {
  preferences: Preferences | null;
  setPreferences: (prefs: Preferences) => void;
  clearPreferences: () => void;
  hasCompleted: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEY = "india-ai-summit-prefs";

const DEFAULTS: Pick<Preferences, "whatsapp" | "workingOn" | "lookingFor"> = {
  whatsapp: null,
  workingOn: null,
  lookingFor: [],
};

function loadFromStorage(): Preferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Backward-compatible: fill in new fields if missing
    return { ...DEFAULTS, ...parsed };
  } catch {
    return null;
  }
}

function saveToStorage(prefs: Preferences | null) {
  try {
    if (prefs) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

async function syncToSupabase(prefs: Preferences) {
  const deviceId = getDeviceId();
  const payload: Record<string, unknown> = {
    device_id: deviceId,
    persona: prefs.persona,
    interests: prefs.interests,
    visit_day: prefs.visitDay,
    whatsapp: prefs.whatsapp,
    working_on: prefs.workingOn,
    looking_for: prefs.lookingFor,
  };

  // Attach user_id if the user is signed in
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.id) {
      payload.user_id = data.session.user.id;
    }
  } catch {}

  supabase
    .from("profiles")
    .upsert(payload, { onConflict: "device_id" })
    .then(({ error }) => {
      if (error) console.warn("Profile sync failed:", error.message);
    });
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<Preferences | null>(loadFromStorage);

  const setPreferences = useCallback((prefs: Preferences) => {
    const full = { ...DEFAULTS, ...prefs };
    setPreferencesState(full);
    saveToStorage(full);
    syncToSupabase(full);
  }, []);

  const clearPreferences = useCallback(() => {
    setPreferencesState(null);
    saveToStorage(null);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setPreferences,
        clearPreferences,
        hasCompleted: preferences !== null,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
