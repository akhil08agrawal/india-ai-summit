import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Preferences {
  persona: string | null;
  interests: string[];
  visitDay: number | null; // 1-5 or null for "show all"
}

interface PreferencesContextType {
  preferences: Preferences | null;
  setPreferences: (prefs: Preferences) => void;
  clearPreferences: () => void;
  hasCompleted: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEY = "india-ai-summit-prefs";

function loadFromSession(): Preferences | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveToSession(prefs: Preferences | null) {
  try {
    if (prefs) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<Preferences | null>(loadFromSession);

  const setPreferences = useCallback((prefs: Preferences) => {
    setPreferencesState(prefs);
    saveToSession(prefs);
  }, []);

  const clearPreferences = useCallback(() => {
    setPreferencesState(null);
    saveToSession(null);
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
