export function getBookCoverUrl(title: string, size: "S" | "M" | "L" = "M"): string {
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-${size}.jpg`;
}
