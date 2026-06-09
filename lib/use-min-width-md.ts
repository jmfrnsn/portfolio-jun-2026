"use client";

import { useEffect, useState } from "react";

export function useMinWidthMd(): boolean {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMd(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMd;
}
