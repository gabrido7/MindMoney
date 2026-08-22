export interface SearchDocument {
  type: "lesson" | "tool";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}
