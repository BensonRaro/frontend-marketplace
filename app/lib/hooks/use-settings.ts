// useSettings — update profile details (reuses onboarding upsert endpoints)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getOnboardingError } from "@/lib/hooks/use-onboarding";

export type ClientProfilePayload = { name: string; image?: string; company?: string; bio: string; location?: string; website?: string };
export type FreelancerProfilePayload = { name: string; image?: string; title: string; bio: string; skills: string[]; hourlyRate: number; location?: string; website?: string; portfolio?: string };

function useUpdateProfile(path: "client" | "freelancer", success: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ClientProfilePayload | FreelancerProfilePayload) => {
      const { data } = await api.post(`/api/onboarding/${path}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session"] });
      qc.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success(success);
    },
    onError: (e: unknown) => toast.error(getOnboardingError(e)),
  });
}

export function useUpdateClientProfile() {
  return useUpdateProfile("client", "Settings saved");
}

export function useUpdateFreelancerProfile() {
  return useUpdateProfile("freelancer", "Profile updated");
}
