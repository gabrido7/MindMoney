import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../../../services/categoriesService";
import { errorMessage } from "../../../services/api";
import { colorForLabel } from "../../../utils/color";
import type { Category } from "../../../types";

const mapCategories = (apiCategories: Awaited<ReturnType<typeof categoriesService.list>>["categories"]): Category[] =>
  apiCategories.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
    type: c.type,
    builtin: c.is_builtin === 1,
    subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name, color: s.color })),
  }));

/**
 * Categorias/subcategorias vêm da API (por usuário, seedadas no cadastro),
 * cacheadas via TanStack Query -- Dashboard, Metas e os modais de
 * categoria compartilham a mesma busca em vez de cada um refazer a
 * chamada ao montar.
 */
export function useCategories() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { categories } = await categoriesService.list();
      return mapCategories(categories);
    },
  });

  const categories = useMemo(() => data ?? [], [data]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  const createMutation = useMutation({
    mutationFn: (input: { name: string; type: Category["type"] }) =>
      categoriesService.create({ name: input.name, type: input.type === "ambos" ? "ambos" : input.type }),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (categoryId: number) => categoriesService.remove(categoryId),
    onSuccess: invalidate,
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: (input: { categoryId: number; name: string }) =>
      categoriesService.createSubcategory(input.categoryId, input.name),
    onSuccess: invalidate,
  });

  const removeSubcategoryMutation = useMutation({
    mutationFn: (input: { categoryId: number; subId: number }) =>
      categoriesService.removeSubcategory(input.categoryId, input.subId),
    onSuccess: invalidate,
  });

  const addCategory = async (name: string, type: Category["type"]) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await createMutation.mutateAsync({ name: trimmed, type });
  };

  const removeCategory = async (name: string) => {
    const category = categories.find((c) => c.name === name);
    if (!category?.id) return;
    await removeMutation.mutateAsync(category.id);
  };

  const addSubcategory = async (categoryName: string, subName: string) => {
    const trimmed = subName.trim();
    const category = categories.find((c) => c.name === categoryName);
    if (!trimmed || !category?.id) return;
    await createSubcategoryMutation.mutateAsync({ categoryId: category.id, name: trimmed });
  };

  const removeSubcategory = async (categoryName: string, subName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    const subcategory = category?.subcategories.find((s) => s.name === subName);
    if (!category?.id || !subcategory?.id) return;
    await removeSubcategoryMutation.mutateAsync({ categoryId: category.id, subId: subcategory.id });
  };

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

  const getColor = (label: string) => colorMap[label] || colorForLabel(label);

  return {
    categories,
    loading: isLoading,
    error: errorMessage(error),
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    getColor,
  };
}
