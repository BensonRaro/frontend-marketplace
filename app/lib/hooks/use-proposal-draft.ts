// useProposalDraft — queues an AI cover letter in the background and polls until it is ready
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { ProposalDraft, ProposalDraftStatus } from "@/types";

// The model runs in Inngest (free models can take 30s+), so the form polls instead of waiting
const POLL_MS = 2500;

type Queued = { jobId: string; status: ProposalDraftStatus };

export function useProposalDraft(jobId: string) {
  const qc = useQueryClient();
  // Polling only starts once this session has asked for a draft — no surprise background traffic
  const [active, setActive] = useState(false);
  const queryKey = ["proposal-draft", jobId];

  const draft = useQuery<ProposalDraft>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<{ data: ProposalDraft }>("/api/proposals/draft", { params: { jobId } });
      return data.data;
    },
    enabled: active,
    // Keep asking while the job is queued; stop the moment it is ready or has failed
    refetchInterval: (query) => (query.state.data?.status === "queued" ? POLL_MS : false),
  });

  // Disabling the query is what actually ends polling — the interval alone kept firing after
  // a "ready" result, so a finished draft must also switch the query off.
  useEffect(() => {
    const status = draft.data?.status;
    if (status && status !== "queued") setActive(false);
  }, [draft.data?.status]);

  const request = useMutation<Queued, unknown, void>({
    mutationFn: async () => {
      const { data } = await api.post<{ data: Queued }>("/api/proposals/draft", { jobId });
      return data.data;
    },
    onMutate: () => setActive(true),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
    onError: (e) => {
      // Nothing was queued, so stop polling and say why (dev-server down, job closed, …)
      setActive(false);
      toast.error(draftError(e));
    },
  });

  return {
    draft: draft.data,
    isDrafting: request.isPending || draft.data?.status === "queued",
    request,
  };
}

// Model/queue failures are recoverable — translate them instead of leaking a raw 503
function draftError(e: unknown) {
  const body = isAxiosError(e) ? (e.response?.data as { error?: { code?: string; message?: string } }) : undefined;
  switch (body?.error?.code) {
    case "QUEUE_UNAVAILABLE":
      return "The AI queue is offline — start the Inngest dev server and try again";
    case "AI_RATE_LIMITED":
      return "Every AI model is busy right now — try again in a minute";
    case "AI_NOT_CONFIGURED":
      return "AI drafting isn't set up on this server";
  }
  if (body?.error?.message) return body.error.message;
  return e instanceof Error ? e.message : "Could not draft a proposal";
}
