"use client";

import { useDialKit } from "dialkit";
import { createContext, useContext, type ReactNode } from "react";

import {
  flattenCopyDialsFromPanel,
  HOME_COPY_DIAL_CONFIG,
} from "@/lib/home-copy-dials";
import {
  DEFAULT_HOME_LAYOUT_DIALS,
  HOME_LAYOUT_DIAL_CONFIG,
  type HomeLayoutDials,
} from "@/lib/home-layout-dials";

const HomeLayoutDialContext =
  createContext<HomeLayoutDials>(DEFAULT_HOME_LAYOUT_DIALS);

export function useHomeLayoutDials(): HomeLayoutDials {
  return useContext(HomeLayoutDialContext);
}

function DevHomeLayoutDialProvider({ children }: { children: ReactNode }) {
  const layout = useDialKit("Home layout", HOME_LAYOUT_DIAL_CONFIG);
  const copyPanel = useDialKit("Home copy", HOME_COPY_DIAL_CONFIG);
  const dials: HomeLayoutDials = {
    ...(layout as Omit<HomeLayoutDials, "copy">),
    copy: flattenCopyDialsFromPanel(copyPanel),
  };

  return (
    <HomeLayoutDialContext.Provider value={dials}>
      {children}
    </HomeLayoutDialContext.Provider>
  );
}

export function HomeLayoutDialProvider({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "development") {
    return <DevHomeLayoutDialProvider>{children}</DevHomeLayoutDialProvider>;
  }

  return (
    <HomeLayoutDialContext.Provider value={DEFAULT_HOME_LAYOUT_DIALS}>
      {children}
    </HomeLayoutDialContext.Provider>
  );
}
