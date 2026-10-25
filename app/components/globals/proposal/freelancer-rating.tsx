// FreelancerRating — hiring trust block (stars + latest client testimonial)
import { Stars } from "@/components/globals/feedback/star-rating";
import { useRatingSummary, useUserReviews } from "@/lib/hooks/use-reviews";
import type { RatingSummary } from "@/types";

export function FreelancerRating({ freelancerId, summary }: { freelancerId: string; summary?: RatingSummary }) {
  // Embedded on proposal lists; fetched when opened from an unrated surface
  const { data: fetched } = useRatingSummary(summary ? undefined : freelancerId);
  const { data: reviews } = useUserReviews(freelancerId, 5);
  const s = summary ?? fetched?.data;
  const quote = reviews?.data.find((r) => r.comment?.trim());

  return (
    <section className="rounded-2xl border border-zinc-100 bg-amber-50/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-semibold tracking-widest text-zinc-500">CLIENT RATING</h4>
        <Stars value={s?.average} count={s?.count} />
      </div>
      {quote?.comment ? (
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          “{quote.comment}” <span className="text-xs text-zinc-400">— {quote.author.name ?? "client"}</span>
        </p>
      ) : null}
    </section>
  );
}
