// ClientReviewForm — freelancer creates or edits their review of a client (client sheet)
import { useState } from "react";
import { StarInput } from "@/components/globals/feedback/star-rating";
import { useCreateClientReview } from "@/lib/hooks/use-client-reviews";
import { useUpdateReview } from "@/lib/hooks/use-review-actions";
import type { Review } from "@/lib/hooks/use-reviews";

type Props = { clientId: string; review?: Review; onDone?: () => void };

export function ClientReviewForm({ clientId, review, onDone }: Props) {
  const create = useCreateClientReview(clientId);
  const update = useUpdateReview();
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [comment, setComment] = useState(review?.comment ?? "");
  const pending = create.isPending || update.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = { rating, comment: comment.trim() || undefined };
    if (review) update.mutate({ reviewId: review.id, ...input }, { onSuccess: () => onDone?.() });
    else create.mutate(input);
  };

  return (
    <form onSubmit={submit} className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <p className="text-xs font-semibold text-zinc-700">{review ? "Edit your review" : "Worked with this client? Leave a review."}</p>
      {review ? null : <p className="mt-0.5 text-[11px] text-zinc-500">Only freelancers with a completed contract can review.</p>}
      <div className="mt-2">
        <StarInput value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="How was the brief, communication and payment? (optional)"
        className="mt-2 w-full rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[11px] text-zinc-400">{comment.length}/500</span>
        <div className="flex items-center gap-3">
          {review ? (
            <button type="button" onClick={onDone} className="cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-800">
              Cancel
            </button>
          ) : null}
          <button disabled={pending} className="cursor-pointer rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
            {pending ? "Saving…" : review ? "Save changes" : "Post review"}
          </button>
        </div>
      </div>
    </form>
  );
}
