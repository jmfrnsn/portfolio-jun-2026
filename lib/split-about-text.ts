function splitIntoSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);
  if (!sentences?.length) return [trimmed];

  return sentences.map((sentence) => sentence.trim()).filter(Boolean);
}

export function splitAboutTextIntoColumns(text: string): {
  left: string[];
  right: string[];
} {
  const sentences = splitIntoSentences(text);
  if (sentences.length <= 1) {
    const words = text.trim().split(/\s+/);
    const mid = Math.ceil(words.length / 2);
    return {
      left: [words.slice(0, mid).join(" ")],
      right: [words.slice(mid).join(" ")],
    };
  }

  const mid = Math.ceil(sentences.length / 2);
  return {
    left: sentences.slice(0, mid),
    right: sentences.slice(mid),
  };
}
