// useStripeVerification — Connect onboarding + status (freelancer: receive payouts)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import type { ConnectStatus } from "@/types";

export type { ConnectStatus };

export function useStripeStatus(enabled = true) {
  return useQuery<ConnectStatus>({
    queryKey: ["stripe-status"],
    queryFn: async () => {
      const { data } = await api.get<{ data: ConnectStatus }>("/api/stripe/status");
      return data.data;
    },
    staleTime: 1000 * 30,
    retry: false,
    enabled,
  });
}

export function useStripeConnect() {
  const qc = useQueryClient();
  return useMutation<{ data: { url: string; accountId: string } }, unknown, void>({
    mutationFn: async () => {
      const { data } = await api.post<{ data: { url: string; accountId: string } }>("/api/stripe/connect");
      return data;
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["stripe-status"] });
      window.location.href = res.data.url;
    },
    onError: (e) => {
      const msg = (e as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ?? (e as Error).message;
      toast.error(msg ?? "Failed to start Stripe verification");
    },
  });
}
