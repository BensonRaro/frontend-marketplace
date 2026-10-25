// useSession — fetches Auth.js session via Axios (JWT cookie, withCredentials)
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type SessionUser = { id: string; name: string | null; email: string | null; image: string | null; role: string; onboardingCompleted?: boolean; stripeVerified?: boolean; stripePaymentVerified?: boolean; isBanned?: boolean; banReason?: string | null };
export type SessionData = { user: SessionUser; expires: string } | null;

export function useSession() {
  return useQuery<SessionData>({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await api.get<SessionData>("/api/auth/session");
      return data ?? null;
    },
    staleTime: 1000 * 60 * 2,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
