// useUserProfile — public client profile (stats + rating source for the client sheet)
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UserProfile } from "@/types";

export function useUserProfile(userId: string | undefined) {
  return useQuery<{ data: UserProfile }>({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const { data } = await api.get<{ data: UserProfile }>(`/api/users/${userId}/profile`);
      return data;
    },
    enabled: !!userId,
  });
}
