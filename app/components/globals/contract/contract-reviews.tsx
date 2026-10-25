// ContractReviews — mark-complete (client) + two-way post-completion rating with author edit/delete
import { useState } from "react";
import { CheckCircle2, Pencil } from "lucide-react";
import { Stars } from "@/components/globals/feedback/star-rating";
import { ConfirmInline } from "@/components/globals/feedback/confirm-inline";
import { useSession } from "@/lib/hooks/use-session";
import { useCompleteContract, useContractReviews, useCreateReview } from "@/lib/hooks/use-reviews";
import { useUpdateReview, useDeleteReview } from "@/lib/hooks/use-review-actions";
import { ContractReviewForm } from "./contract-review-form";
import type { Milestone } from "@/types";

type Props = { contractId: string; milestones: Milestone[]; isCompleted: boolean; viewerRole: "client" | "freelancer" };

export function ContractReviews({ contractId, milestones, isCompleted, viewerRole }: Props) {
  const { data: session } = useSession();
  const complete = useCompleteContract();
  const { data: reviews } = useContractReviews(contractId, isCompleted);
  const create = useCreateReview(contractId);
  const update = useUpdateReview();
  const remove = useDeleteReview();
  const [editing, setEditing] = useState(false);

  // Pre-completion: client closes the books once nothing payable remains
  if (!isCompleted) {
    const blocking = milestones.filter((m) => m.status !== "released" && m.status !== "unfunded");
    if (viewerRole !== "client" || !milestones.length || blocking.length) return null;
    return (
      <div className="mt-3 flex justify-end">
        <button onClick={() => complete.mutate(contractId)} disabled={complete.isPending} className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          <CheckCircle2 className="h-4 w-4" /> {complete.isPending ? "Completing…" : "Mark complete"}
        </button>
      </div>
    );
  }

  const list = reviews?.data ?? [];
  const mine = list.find((r) => r.authorId === session?.user.id);
  const theirs = list.find((r) => r.authorId !== session?.user.id);

  return (
    <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
      <h4 className="text-xs font-semibold tracking-widest text-zinc-500">REVIEWS</h4>
      {mine ? (
        <div className="mt-2">
          {editing ? (
            <ContractReviewForm
              initialRating={mine.rating}
              initialComment={mine.comment}
              pending={update.isPending}
              submitLabel="Save changes"
              onSubmit={(input) => update.mutate({ reviewId: mine.id, ...input }, { onSuccess: () => setEditing(false) })}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <>
              <Stars value={mine.rating} />
              {mine.comment ? <p className="mt-1 text-sm leading-6 text-zinc-600">“{mine.comment}”</p> : null}
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="text-[11px] text-zinc-400">Your review</span>
                <button type="button" onClick={() => setEditing(true)} className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-primary">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <ConfirmInline pending={remove.isPending} onConfirm={() => remove.mutate(mine.id)} />
              </div>
            </>
          )}
        </div>
      ) : (
        <ContractReviewForm pending={create.isPending} submitLabel="Submit review" onSubmit={(input) => create.mutate(input)} />
      )}
      {theirs ? (
        <div className="mt-3 border-t border-zinc-100 pt-3">
          <Stars value={theirs.rating} />
          {theirs.comment ? <p className="mt-1 text-sm leading-6 text-zinc-600">“{theirs.comment}”</p> : null}
          <p className="mt-0.5 text-[11px] text-zinc-400">{theirs.author.name ?? "Partner"}’s review</p>
        </div>
      ) : null}
    </div>
  );
}
