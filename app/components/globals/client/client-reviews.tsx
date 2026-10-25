// ClientReviews — freelancer reviews about a client; authors can edit/delete their own
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Stars } from "@/components/globals/feedback/star-rating";
import { ConfirmInline } from "@/components/globals/feedback/confirm-inline";
import { useSession } from "@/lib/hooks/use-session";
import { useUserReviews } from "@/lib/hooks/use-reviews";
import { useClientReviewStatus } from "@/lib/hooks/use-client-reviews";
import { useDeleteReview } from "@/lib/hooks/use-review-actions";
import { ClientReviewForm } from "./client-review-form";

type Props = { clientId: string; reviewEligible?: boolean };

export function ClientReviews({ clientId, reviewEligible = false }: Props) {
  const { data: session } = useSession();
  const { data, isLoading, isError } = useUserReviews(clientId, 5);
  const { data: status } = useClientReviewStatus(clientId, reviewEligible);
  const remove = useDeleteReview();
  const [editingId, setEditingId] = useState<string | null>(null);
  const reviews = data?.data ?? [];
  const mine = status?.data;
  const myId = session?.user.id;

  return (
    <section>
      <h4 className="text-xs font-semibold tracking-widest text-zinc-500">REVIEWS FROM FREELANCERS</h4>
      {mine?.canReview ? <ClientReviewForm clientId={clientId} /> : null}
      {reviewEligible && mine && !mine.canReview && mine.hasReviewed ? (
        <p className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">You've reviewed this client — edit or delete it below.</p>
      ) : null}
      {isLoading ? (
        <div className="mt-3 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-50" />
          ))}
        </div>
      ) : isError ? (
        <p className="mt-3 text-sm text-red-500">Couldn't load reviews.</p>
      ) : reviews.length ? (
        <ul className="mt-3 space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-zinc-100 bg-white p-3">
              <div className="flex items-center gap-2">
                {r.author.image ? (
                  <img src={r.author.image} alt={r.author.name ?? "freelancer"} className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {(r.author.name ?? "F").slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium">{r.author.name ?? "Freelancer"}</span>
                <span className="ml-auto"><Stars value={r.rating} size={12} /></span>
              </div>
              {editingId === r.id ? (
                <ClientReviewForm clientId={clientId} review={r} onDone={() => setEditingId(null)} />
              ) : (
                <>
                  {r.comment ? <p className="mt-2 text-sm leading-6 text-zinc-600">“{r.comment}”</p> : null}
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <p className="text-[11px] text-zinc-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                    {r.authorId === myId ? (
                      <>
                        <button type="button" onClick={() => setEditingId(r.id)} className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-primary">
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <ConfirmInline pending={remove.isPending} onConfirm={() => remove.mutate(r.id)} />
                      </>
                    ) : null}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
          No reviews yet — freelancers haven't rated this client.
        </p>
      )}
    </section>
  );
}
