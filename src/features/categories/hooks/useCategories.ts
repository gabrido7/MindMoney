import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState";
import { colorForLabel } from "../../../utils/color";
import type { Category } from "../../../types";
import { defaultCategories } from "../data/defaultCategories";

const isCategoryArray = (value: unknown): value is Category[] =>
  Array.isArray(value) &&
  value.every(
    (c) =>
      c &&
      typeof c.name === "string" &&
      typeof c.color === "string" &&
      Array.isArray(c.subcategories)
  );

export function useCategories() {
  const [categories, setCategories] = useLocalStorageState<Category[]>(
    "categories",
    defaultCategories,
    isCategoryArray
  );

  const addCategory = useCallback(
    (name: string, type: Category["type"]) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCategories((prev) => {
        if (prev.some((c) => c.name.toLowerCase() === trimmed.toLowerCase()))
          return prev;
        return [
          ...prev,
          { name: trimmed, color: colorForLabel(trimmed), type, subcategories: [] },
        ];
      });
    },
    [setCategories]
  );

  const removeCategory = useCallback(
    (name: string) => {
      setCategories((prev) => prev.filter((c) => c.name !== name || c.builtin));
    },
    [setCategories]
  );

  const addSubcategory = useCallback(
    (categoryName: string, subName: string) => {
      const trimmed = subName.trim();
      if (!trimmed) return;
      setCategories((prev) =>
        prev.map((c) =>
          c.name === categoryName &&
          !c.subcategories.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
            ? {
                ...c,
                subcategories: [
                  ...c.subcategories,
                  { name: trimmed, color: colorForLabel(trimmed) },
                ],
              }
            : c
        )
      );
    },
    [setCategories]
  );

  const removeSubcategory = useCallback(
    (categoryName: string, subName: string) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.name === categoryName
            ? { ...c, subcategories: c.subcategories.filter((s) => s.name !== subName) }
            : c
        )
      );
    },
    [setCategories]
  );

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c.name] = c.color;
      c.subcategories.forEach((s) => {
        map[s.name] = s.color;
      });
    });
    return map;
  }, [categories]);

  const getColor = useCallback(
    (label: string) => colorMap[label] || colorForLabel(label),
    [colorMap]
  );

  const replaceAll = useCallback(
    (next: Category[]) => {
      setCategories(next);
    },
    [setCategories]
  );

  return {
    categories,
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    getColor,
    replaceAll,
  };
}
