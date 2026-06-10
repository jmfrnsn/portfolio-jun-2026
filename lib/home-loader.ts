const HOME_LOADER_SEEN_KEY = "portfolio-home-loader-seen";

export function hasSeenHomeLoader(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(HOME_LOADER_SEEN_KEY) === "1";
}

export function markHomeLoaderSeen(): void {
  sessionStorage.setItem(HOME_LOADER_SEEN_KEY, "1");
}
