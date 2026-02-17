import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface BookmarkEntry {
  dayId: number;
  time: string;
  title: string;
  venue?: string;
  speakers?: string;
  tags?: string[];
  is_highlight?: boolean;
}

interface BookmarksContextType {
  toggle: (entry: BookmarkEntry) => void;
  isBookmarked: (id: string) => boolean;
  getAll: () => Record<string, BookmarkEntry>;
  clear: () => void;
  count: number;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

const STORAGE_KEY = "bookmarked-sessions";

function makeId(entry: BookmarkEntry): string {
  return `${entry.dayId}::${entry.time}::${entry.title}`;
}

function loadFromStorage(): Record<string, BookmarkEntry> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

function saveToStorage(data: Record<string, BookmarkEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export { makeId as makeBookmarkId };

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Record<string, BookmarkEntry>>(loadFromStorage);

  const toggle = useCallback((entry: BookmarkEntry) => {
    setBookmarks(prev => {
      const id = makeId(entry);
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = entry;
      }
      saveToStorage(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return !!bookmarks[id];
  }, [bookmarks]);

  const getAll = useCallback(() => bookmarks, [bookmarks]);

  const clear = useCallback(() => {
    setBookmarks({});
    saveToStorage({});
  }, []);

  return (
    <BookmarksContext.Provider value={{ toggle, isBookmarked, getAll, clear, count: Object.keys(bookmarks).length }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarksProvider");
  return ctx;
}
