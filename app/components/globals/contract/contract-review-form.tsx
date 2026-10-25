// ContractReviewForm — shared create/edit form for post-completion star ratings
import { useState } from "react";
import { StarInput } from "@/components/globals/feedback/star-rating";

type Props = {
  initialRating?: number;
  initialComment?: string | null;
  pending: boolean;
  submitLabel: string;
  onSubmit: (input: { rating: number; comment?: string }) => void;
  onCancel?: () => void;
};

export function ContractReviewForm({ initialRating = 5, initialComment, pending, submitLabel, onSubmit, onCancel }: Props) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ rating, comment: comment.trim() || undefined });
      }}
      className="mt-2 space-y-2"
    >
      <StarInput value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="How was working together? (optional)"
        className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <div className="flex items-center justify-end gap-3">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-800">
            Cancel
          </button>
        ) : null}
        <button disabled={pending} className="cursor-pointer rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
