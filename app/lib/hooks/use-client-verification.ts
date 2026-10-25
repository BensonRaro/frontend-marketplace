// useClientVerification — saved-card status + Setup Checkout (client: fund escrow)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import type { ClientPaymentStatus } from "@/types";

export function useClientPaymentStatus(enabled = true) {
  return useQuery<ClientPaymentStatus>({
    queryKey: ["client-payment-status"],
    queryFn: async () => {
      const { data } = await api.get<{ data: ClientPaymentStatus }>("/api/stripe/client/status");
      return data.data;
    },
    staleTime: 1000 * 30,
    retry: false,
    enabled,
  });
}

export function useClientSetup() {
  const qc = useQueryClient();
  return useMutation<{ data: { url: string; customerId: string } }, unknown, void>({
    mutationFn: async () => {
      const { data } = await api.post<{ data: { url: string; customerId: string } }>("/api/stripe/client/setup");
      return data;
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["client-payment-status"] });
      window.location.href = res.data.url;
    },
    onError: (e) => {
      const msg = (e as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ?? (e as Error).message;
      toast.error(msg ?? "Failed to start card setup");
    },
  });
}

export function useClientSync() {
  const qc = useQueryClient();
  return useMutation<{ data: { verified: boolean } }, unknown, void>({
    mutationFn: async () => {
      const { data } = await api.post<{ data: { verified: boolean } }>("/api/stripe/client/sync");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-payment-status"] });
    },
  });
}
