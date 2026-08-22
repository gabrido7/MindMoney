import type { SearchDocument } from "../types";

const STOPWORDS = new Set([
  "a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "em", "um", "uma", "uns", "umas",
  "por", "para", "com", "sem", "como", "que", "no", "na", "nos", "nas", "ao", "aos", "à", "às",
  "é", "são", "meu", "minha", "meus", "minhas", "seu", "sua", "seus", "suas", "você", "voce",
  "quero", "gostaria", "eu", "me", "mim", "tem", "ter", "isso", "esse", "essa", "este", "esta",
]);

const DIACRITICS_REGEX = new RegExp(`[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`, "g");

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(DIACRITICS_REGEX, "");
}

export function tokenize(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

export interface SearchResult extends SearchDocument {
  score: number;
}

/** Pontua cada documento pela soma de ocorrências dos termos da busca, com peso maior para match no título. */
export function search(query: string, index: SearchDocument[], limit = 8): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored: SearchResult[] = index.map((doc) => {
    const title = normalize(doc.title);
    const haystack = normalize(doc.keywords);
    let score = 0;
    for (const token of tokens) {
      if (title.includes(token)) score += 5;
      const occurrences = haystack.split(token).length - 1;
      score += occurrences;
    }
    return { ...doc, score };
  });

  return scored
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
