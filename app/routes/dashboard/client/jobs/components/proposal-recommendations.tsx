// AI shortlist — ranks this job's bids by fit (client job detail, above the proposal list)
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useRecommendations, useRequestRecommendations } from "@/lib/hooks/use-recommendations";
import type { JobProposal } from "@/lib/hooks/use-jobs";
import { RecommendationRow } from "./recommendation-row";

export function ProposalRecommendations({
  jobId,
  proposals,
  onSelect,
}: {
  jobId: string;
  proposals: JobProposal[];
  onSelect: (proposalId: string) => void;
}) {
  const { data: board, isLoading, isError, refetch } = useRecommendations(jobId);
  const request = useRequestRecommendations(jobId);

  // Nothing to rank — keep the job page clean
  if (!proposals.length) return null;

  const byId = new Map(proposals.map((p) => [p.id, p]));
  const rows = (board?.recommendations ?? []).filter((r) => byId.has(r.proposalId));
  const pending = !!board && board.total > board.analyzed;
  const busy = request.isPending || pending;
  const model = board?.model ? board.model.split("/").pop() : null;

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-semibold">AI shortlist</h2>
            <p className="text-xs text-zinc-500">
              {board && board.total ? `${board.analyzed} of ${board.total} bids scored` : "Ranked by fit for this job"}
              {model ? ` · ${model}` : ""}
            </p>
          </div>
        </div>
        {/* Stays clickable while a run is in flight — a failed run can always be retried */}
        <button
          onClick={() => request.mutate()}
          disabled={request.isPending}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-100 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-60"
        >
          <RefreshCw className={busy ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          {rows.length ? "Refresh" : "Analyse"}
        </button>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-zinc-100 bg-zinc-50" />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
          <p className="font-medium">Couldn’t load the shortlist</p>
          <p className="text-xs text-red-600">The analysis service may be unavailable.</p>
          <button onClick={() => refetch()} className="mt-2 cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
            Try again
          </button>
        </div>
      ) : !board || board.total === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No analysable bids on this job yet.</p>
      ) : !rows.length ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-200 px-4 py-8 text-center">
          {pending ? (
            <p className="inline-flex items-center gap-2 text-sm text-zinc-600">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Analysing {board.total} bids in the background…
            </p>
          ) : (
            <>
              <p className="text-sm font-medium">No shortlist yet</p>
              <p className="mt-1 text-xs text-zinc-500">Run the AI review to rank bids on skills, price and delivery time.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {rows.map((rec, i) => (
              <RecommendationRow
                key={rec.proposalId}
                rank={i + 1}
                rec={rec}
                proposal={byId.get(rec.proposalId)!}
                onSelect={() => onSelect(rec.proposalId)}
              />
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-zinc-400">
            {pending ? "Updating with newer bids…" : board.truncated ? `Newest ${board.total} bids analysed.` : "AI fit scores are guidance, not a hiring decision."}
          </p>
        </>
      )}
    </section>
  );
}
