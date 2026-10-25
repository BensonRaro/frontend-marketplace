// One AI-ranked bid — score badge, verdict, strengths/concerns (client job shortlist)
import { AlertTriangle, Check } from "lucide-react";
import { money } from "@/components/globals/job/job-detail";
import type { JobProposal } from "@/lib/hooks/use-jobs";
import type { ProposalRecommendation } from "@/types";

// Colour follows the fit band so a glance at the list is enough
function tone(score: number) {
  if (score >= 75) return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (score >= 50) return "border-amber-100 bg-amber-50 text-amber-700";
  return "border-zinc-100 bg-zinc-50 text-zinc-600";
}

export function RecommendationRow({
  rank,
  rec,
  proposal,
  onSelect,
}: {
  rank: number;
  rec: ProposalRecommendation;
  proposal: JobProposal;
  onSelect: () => void;
}) {
  const name = proposal.freelancer?.name ?? "Freelancer";
  return (
    <li>
      <button
        onClick={onSelect}
        className="block w-full cursor-pointer rounded-xl border border-zinc-100 p-4 text-left transition hover:border-primary-muted hover:shadow-sm"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-xs font-bold text-primary">
            #{rank}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {proposal.freelancer?.image ? (
                <img src={proposal.freelancer.image} alt={name} className="h-5 w-5 rounded-full object-cover" />
              ) : (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <span className="text-sm font-medium">{name}</span>
              <span className="text-zinc-400">{money(proposal.bidAmount)}</span>
              {proposal.duration ? <span className="text-zinc-500">• {proposal.duration}d</span> : null}
            </div>

            {rec.summary ? <p className="mt-1.5 text-sm leading-6 text-zinc-600">{rec.summary}</p> : null}

            {(rec.strengths.length || rec.concerns.length) ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {rec.strengths.slice(0, 2).map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    <Check className="h-3 w-3" /> {s}
                  </span>
                ))}
                {rec.concerns.slice(0, 2).map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    <AlertTriangle className="h-3 w-3" /> {c}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <span className={`shrink-0 rounded-xl border px-2.5 py-1 text-center ${tone(rec.score)}`}>
            <span className="block text-sm font-bold leading-4">{rec.score}</span>
            <span className="block text-[9px] font-medium uppercase tracking-wide opacity-70">fit</span>
          </span>
        </div>
      </button>
    </li>
  );
}
