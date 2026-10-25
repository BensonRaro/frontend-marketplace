// useCategories — fetch categories for job creation (public)
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Category = { id: string; name: string; slug: string };

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Category[] }>("/api/categories");
      return data.data;
    },
    staleTime: 1000 * 60 * 10,
  });
}
