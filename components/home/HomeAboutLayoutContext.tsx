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
  DEFAULT_HOME_ABOUT_LAYOUT,
  HOME_ABOUT_LAYOUT_STORAGE_KEY,
  isHomeAboutLayoutId,
  type HomeAboutLayoutId,
} from "@/lib/home-about-layout";

type HomeAboutLayoutContextValue = {
  layout: HomeAboutLayoutId;
  setLayout: (layout: HomeAboutLayoutId) => void;
};

const HomeAboutLayoutContext =
  createContext<HomeAboutLayoutContextValue | null>(null);

function readStoredLayout(): HomeAboutLayoutId {
  if (typeof window === "undefined") return DEFAULT_HOME_ABOUT_LAYOUT;
  try {
    const stored = window.localStorage.getItem(HOME_ABOUT_LAYOUT_STORAGE_KEY);
    return stored && isHomeAboutLayoutId(stored)
      ? stored
      : DEFAULT_HOME_ABOUT_LAYOUT;
  } catch {
    return DEFAULT_HOME_ABOUT_LAYOUT;
  }
}

export function HomeAboutLayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayoutState] =
    useState<HomeAboutLayoutId>(DEFAULT_HOME_ABOUT_LAYOUT);

  useEffect(() => {
    setLayoutState(readStoredLayout());
  }, []);

  const setLayout = useCallback((next: HomeAboutLayoutId) => {
    setLayoutState(next);
    try {
      window.localStorage.setItem(HOME_ABOUT_LAYOUT_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ layout, setLayout }), [layout, setLayout]);

  return (
    <HomeAboutLayoutContext.Provider value={value}>
      {children}
    </HomeAboutLayoutContext.Provider>
  );
}

export function useHomeAboutLayout(): HomeAboutLayoutContextValue {
  const context = useContext(HomeAboutLayoutContext);
  if (!context) {
    throw new Error(
      "useHomeAboutLayout must be used within HomeAboutLayoutProvider",
    );
  }
  return context;
}
