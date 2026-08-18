import { useCallback, useEffect, useMemo, useState } from "react";
import { categoriesService } from "../../../services/categoriesService";
import { ApiError } from "../../../services/api";
import { colorForLabel } from "../../../utils/color";
import type { Category } from "../../../types";

/**
 * Categorias/subcategorias vêm da API (por usuário, seedadas no cadastro) —
 * não mais do localStorage. Uma chamada só: GET /api/categories já devolve
 * as subcategorias aninhadas (antes disso o front fazia 1 chamada de
 * categorias + N chamadas de subcategorias, uma por categoria).
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { categories: apiCategories } = await categoriesService.list();
      setCategories(
        apiCategories.map(
          (c): Category => ({
            id: c.id,
            name: c.name,
            color: c.color,
            type: c.type,
            builtin: c.is_builtin === 1,
            subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name, color: s.color })),
          })
        )
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const addCategory = useCallback(
    async (name: string, type: Category["type"]) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      await categoriesService.create({ name: trimmed, type: type === "ambos" ? "ambos" : type });
      await load();
    },
    [load]
  );

  const removeCategory = useCallback(
    async (name: string) => {
      const category = categories.find((c) => c.name === name);
      if (!category?.id) return;
      await categoriesService.remove(category.id);
      await load();
    },
    [categories, load]
  );

  const addSubcategory = useCallback(
    async (categoryName: string, subName: string) => {
      const trimmed = subName.trim();
      const category = categories.find((c) => c.name === categoryName);
      if (!trimmed || !category?.id) return;
      await categoriesService.createSubcategory(category.id, trimmed);
      await load();
    },
    [categories, load]
  );

  const removeSubcategory = useCallback(
    async (categoryName: string, subName: string) => {
      const category = categories.find((c) => c.name === categoryName);
      const subcategory = category?.subcategories.find((s) => s.name === subName);
      if (!category?.id || !subcategory?.id) return;
      await categoriesService.removeSubcategory(category.id, subcategory.id);
      await load();
    },
    [categories, load]
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

  return {
    categories,
    loading,
    error,
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    getColor,
  };
}
