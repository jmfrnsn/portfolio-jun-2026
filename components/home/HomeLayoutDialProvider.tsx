"use client";

import { useDialKit } from "dialkit";
import { createContext, useContext, useRef, type ReactNode } from "react";

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

async function bakeToCode(dials: HomeLayoutDials): Promise<void> {
  const response = await fetch("/api/dev/bake-home-layout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      section: dials.section,
      contents: dials.contents,
      dropCap: dials.dropCap,
      typography: dials.typography,
      copy: dials.copy,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to bake DialKit values to code.");
  }
}

function DevHomeLayoutDialProvider({ children }: { children: ReactNode }) {
  const bakedRef = useRef(false);

  const layout = useDialKit(
    "Home layout",
    {
      ...HOME_LAYOUT_DIAL_CONFIG,
      bakeToCode: { type: "action", label: "Bake to code" },
    },
    {
      onAction: async (actionPath) => {
        if (actionPath !== "bakeToCode" || bakedRef.current) return;
        bakedRef.current = true;
        try {
          await bakeToCode(dialsRef.current);
          window.alert("Baked DialKit values to code. You can commit now.");
        } catch {
          window.alert("Failed to bake values. Is the dev server running?");
        } finally {
          bakedRef.current = false;
        }
      },
    },
  );

  const copyPanel = useDialKit("Home copy", HOME_COPY_DIAL_CONFIG);
  const dialsRef = useRef<HomeLayoutDials>(DEFAULT_HOME_LAYOUT_DIALS);

  const dials: HomeLayoutDials = {
    ...(layout as Omit<HomeLayoutDials, "copy">),
    copy: flattenCopyDialsFromPanel(copyPanel),
  };
  dialsRef.current = dials;

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
