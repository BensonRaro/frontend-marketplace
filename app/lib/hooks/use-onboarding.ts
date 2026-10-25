// useOnboarding — hooks for onboarding status + complete (client/freelancer)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useSession } from "@/lib/hooks/use-session";

export type OnboardingStatus = {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  email: string | null;
  profile: Record<string, unknown> | null;
};

export function useOnboardingStatus() {
  const { data: session } = useSession();
  return useQuery<OnboardingStatus>({
    queryKey: ["onboarding-status"],
    queryFn: async () => {
      const { data } = await api.get<{ data: OnboardingStatus }>("/api/onboarding/status");
      return data.data;
    },
    enabled: !!session?.user && session.user.role !== "admin",
    retry: false,
    staleTime: 1000 * 30,
  });
}

export function useCompleteClientOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; image?: string; company?: string; bio: string; location?: string; website?: string }) => {
      const { data } = await api.post("/api/onboarding/client", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session"] });
      qc.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success("Welcome to TalentHive!");
    },
    onError: (e: unknown) => toast.error(getOnboardingError(e)),
  });
}

export function useCompleteFreelancerOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; image?: string; title: string; bio: string; skills: string[]; hourlyRate: number; location?: string; website?: string; portfolio?: string }) => {
      const { data } = await api.post("/api/onboarding/freelancer", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session"] });
      qc.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success("Profile ready — let’s find your first gig!");
    },
    onError: (e: unknown) => toast.error(getOnboardingError(e)),
  });
}

export function getOnboardingError(e: unknown): string {
  if (isAxiosError(e)) return (e.response?.data as { error?: { message?: string } })?.error?.message ?? e.message;
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
