"use client";

import { DialRoot } from "dialkit";
import "dialkit/styles.css";

export function DialKitDev() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <DialRoot />;
}
