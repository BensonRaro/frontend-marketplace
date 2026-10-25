// DraftButton — queues the AI cover letter and hands the finished text back to the bid form
import { useEffect, useRef } from "react";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useProposalDraft } from "@/lib/hooks/use-proposal-draft";

export function DraftButton({ jobId, onDraft }: { jobId: string; onDraft: (coverLetter: string) => void }) {
  const { draft, isDrafting, request } = useProposalDraft(jobId);
  // Each finished draft is delivered exactly once, so later edits by the freelancer survive
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!draft || handled.current === draft.updatedAt) return;
    if (draft.status === "ready" && draft.coverLetter) {
      handled.current = draft.updatedAt;
      onDraft(draft.coverLetter);
    }
    if (draft.status === "failed") {
      handled.current = draft.updatedAt;
      toast.error(draft.error ?? "The draft could not be written — try again");
    }
  }, [draft, onDraft]);

  return (
    <button
      type="button"
      onClick={() => request.mutate()}
      disabled={isDrafting}
      title="Write a first draft from this job post and your profile"
      className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-zinc-100 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDrafting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      {isDrafting ? "Drafting…" : draft?.status === "failed" ? "Try AI again" : "Draft with AI"}
    </button>
  );
}
