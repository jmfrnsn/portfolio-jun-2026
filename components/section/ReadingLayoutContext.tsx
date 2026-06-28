"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_READING_LAYOUT,
  READING_LAYOUT_STORAGE_KEY,
  isReadingLayoutId,
  type ReadingLayoutId,
} from "@/lib/reading-layout";

type ReadingLayoutContextValue = {
  layout: ReadingLayoutId;
  setLayout: (layout: ReadingLayoutId) => void;
};

const ReadingLayoutContext = createContext<ReadingLayoutContextValue | null>(
  null,
);

function readStoredLayout(): ReadingLayoutId {
  if (typeof window === "undefined") return DEFAULT_READING_LAYOUT;
  try {
    const stored = window.localStorage.getItem(READING_LAYOUT_STORAGE_KEY);
    return stored && isReadingLayoutId(stored)
      ? stored
      : DEFAULT_READING_LAYOUT;
  } catch {
    return DEFAULT_READING_LAYOUT;
  }
}

export function ReadingLayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayoutState] =
    useState<ReadingLayoutId>(DEFAULT_READING_LAYOUT);

  useEffect(() => {
    setLayoutState(readStoredLayout());
  }, []);

  const setLayout = useCallback((next: ReadingLayoutId) => {
    setLayoutState(next);
    try {
      window.localStorage.setItem(READING_LAYOUT_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ layout, setLayout }), [layout, setLayout]);

  return (
    <ReadingLayoutContext.Provider value={value}>
      {children}
    </ReadingLayoutContext.Provider>
  );
}

export function useReadingLayout(): ReadingLayoutContextValue {
  const context = useContext(ReadingLayoutContext);
  if (!context) {
    throw new Error(
      "useReadingLayout must be used within ReadingLayoutProvider",
    );
  }
  return context;
}
