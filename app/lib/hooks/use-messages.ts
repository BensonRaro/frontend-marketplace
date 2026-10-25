// useMessages — contract thread history + send (SSE invalidates live, polling backfills)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError } from "@/lib/hooks/use-jobs";
import type { ChatMessage } from "@/types";

export type SendMessagePayload = { body: string; attachments: string[] };

// Deep link to a chat thread — role-aware dashboard path + contract selection
export function chatThreadPath(role: string | undefined, contractId: string) {
  const base = role === "freelancer" ? "/dashboard/freelancer/messages" : "/dashboard/client/messages";
  return `${base}?contractId=${contractId}`;
}

export function useMessages(contractId: string | null) {
  return useQuery<{ data: ChatMessage[] }>({
    queryKey: ["messages", contractId],
    queryFn: async () => {
      const { data } = await api.get<{ data: ChatMessage[] }>(`/api/contracts/${contractId}/messages`);
      return data;
    },
    enabled: !!contractId,
    refetchInterval: 15_000,
  });
}

export function useSendMessage(contractId: string) {
  const qc = useQueryClient();
  return useMutation<{ data: ChatMessage }, string, SendMessagePayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<{ data: ChatMessage }>(`/api/contracts/${contractId}/messages`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages", contractId] });
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}
