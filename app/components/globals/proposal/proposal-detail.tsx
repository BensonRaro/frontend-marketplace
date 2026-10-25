// Proposal detail content — freelancer profile + rating + full bid, inside Sheet
import { DollarSign, Clock, MapPin, Globe, CalendarDays } from "lucide-react";
import { money } from "@/components/globals/job/job-detail";
import { FreelancerRating } from "./freelancer-rating";
import { ProposalAccept } from "./proposal-accept";
import type { JobProposal } from "@/lib/hooks/use-jobs";

export function ProposalDetail({ proposal, jobTitle, jobId, onAccepted }: { proposal: JobProposal; jobTitle?: string; jobId?: string; onAccepted?: () => void }) {
  const f = proposal.freelancer;
  const profile = f?.freelancerProfile;
  const canAccept = proposal.status === "pending" && !!jobId;

  return (
    <div className="space-y-6">
      {/* Freelancer */}
      <section className="flex items-start gap-4">
        {f?.image ? (
          <img src={f.image} alt={f.name ?? "freelancer"} className="h-14 w-14 rounded-2xl object-cover border border-zinc-100 shadow-sm" />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-lg font-bold text-white">{(f?.name ?? "F").slice(0, 2).toUpperCase()}</span>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight">{f?.name ?? "Freelancer"}</h3>
          {profile?.title ? <p className="text-sm text-zinc-500">{profile.title}</p> : null}
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
            {profile?.hourlyRate ? <span className="font-semibold text-zinc-800">${(profile.hourlyRate / 100).toFixed(0)}/hr</span> : null}
            {profile?.location ? (
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile.location}</span>
            ) : null}
          </div>
        </div>
        <span className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${proposal.status === "pending" ? "bg-amber-50 text-amber-700" : proposal.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{proposal.status}</span>
      </section>

      {f ? <FreelancerRating freelancerId={f.id} summary={proposal.freelancerRating} /> : null}

      {profile?.skills?.length ? (
        <section>
          <h4 className="mb-2 text-xs font-semibold tracking-widest text-zinc-500">SKILLS</h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((s) => (
              <span key={s} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">{s}</span>
            ))}
          </div>
        </section>
      ) : null}

      {profile?.bio ? (
        <section>
          <h4 className="mb-1 text-xs font-semibold tracking-widest text-zinc-500">ABOUT</h4>
          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-600">{profile.bio}</p>
        </section>
      ) : null}

      {profile?.website ? (
        <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <Globe className="h-4 w-4" /> {profile.website}
        </a>
      ) : null}

      {/* Proposal */}
      <section className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
        <h4 className="mb-3 text-xs font-semibold tracking-widest text-zinc-500">PROPOSAL{jobTitle ? ` — ${jobTitle}` : ""}</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-white border border-zinc-100 px-2.5 py-1 font-semibold">
            <DollarSign className="h-3 w-3" /> {money(proposal.bidAmount)}
          </span>
          {proposal.duration ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-zinc-100 px-2.5 py-1">
              <Clock className="h-3 w-3" /> {proposal.duration} days delivery
            </span>
          ) : null}
          {proposal.createdAt ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-zinc-100 px-2.5 py-1 text-zinc-500">
              <CalendarDays className="h-3 w-3" /> {new Date(proposal.createdAt).toLocaleDateString()}
            </span>
          ) : null}
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{proposal.coverLetter}</p>
      </section>

      {canAccept ? (
        <ProposalAccept proposalId={proposal.id} jobId={jobId} bidAmount={proposal.bidAmount} freelancerName={f?.name ?? "this freelancer"} onAccepted={onAccepted} />
      ) : null}
    </div>
  );
}
