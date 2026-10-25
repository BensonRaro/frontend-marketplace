// ClientProfileBody — client trust summary (spend, contracts, rating) + freelancer reviews
import { Building2, Globe, MapPin } from "lucide-react";
import { Stars } from "@/components/globals/feedback/star-rating";
import { money } from "@/components/globals/job/job-detail";
import { useSession } from "@/lib/hooks/use-session";
import { ClientReviews } from "./client-reviews";
import type { UserProfile } from "@/types";

const linkHref = (url: string) => (url.startsWith("http") ? url : `https://${url}`);

export function ClientProfileBody({ profile }: { profile: UserProfile }) {
  const cp = profile.clientProfile;
  const { data: session } = useSession();
  const reviewEligible = profile.role === "client" && session?.user.role === "freelancer";

  return (
    <div className="space-y-6">
      <section className="flex items-start gap-4">
        {profile.image ? (
          <img src={profile.image} alt={profile.name ?? "client"} className="h-14 w-14 rounded-2xl border border-zinc-100 object-cover shadow-sm" />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-lg font-bold text-white">
            {(profile.name ?? "C").slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight">{profile.name ?? "Client"}</h3>
          {cp?.company ? (
            <p className="flex items-center gap-1 text-sm text-zinc-500">
              <Building2 className="h-3.5 w-3.5" /> {cp.company}
            </p>
          ) : null}
          <p className="mt-0.5 text-xs text-zinc-400">Client since {new Date(profile.createdAt).getFullYear()}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-zinc-100 bg-emerald-50/40 p-4">
          <p className="text-[11px] font-semibold tracking-widest text-zinc-500">SPENT ON FREELANCERS</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900">{money(profile.stats.totalSpent)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="text-[11px] font-semibold tracking-widest text-zinc-500">JOBS POSTED</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900">{profile.stats.jobsPosted}</p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="text-[11px] font-semibold tracking-widest text-zinc-500">COMPLETED</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900">{profile.stats.contractsCompleted}</p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="text-[11px] font-semibold tracking-widest text-zinc-500">RATING</p>
          <div className="mt-1"><Stars value={profile.rating.average} count={profile.rating.count} /></div>
        </div>
      </section>

      {cp?.location || cp?.website ? (
        <section className="flex flex-wrap gap-3 text-sm text-zinc-600">
          {cp.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-zinc-400" /> {cp.location}
            </span>
          ) : null}
          {cp.website ? (
            <a href={linkHref(cp.website)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              <Globe className="h-4 w-4" /> {cp.website}
            </a>
          ) : null}
        </section>
      ) : null}

      {cp?.bio ? (
        <section>
          <h4 className="mb-1 text-xs font-semibold tracking-widest text-zinc-500">ABOUT</h4>
          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-600">{cp.bio}</p>
        </section>
      ) : null}

      <ClientReviews clientId={profile.id} reviewEligible={reviewEligible} />
    </div>
  );
}
