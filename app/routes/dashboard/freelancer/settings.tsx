// Freelancer Settings — payout verification status + editable profile details
import { Link } from "react-router";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useIsVerified } from "@/lib/hooks/use-verification";
import { useOnboardingStatus } from "@/lib/hooks/use-onboarding";
import { FreelancerSettingsForm } from "./settings/components/freelancer-settings-form";
import type { Route } from "./+types/settings";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Settings — TalentHive" }];
}

export default function FreelancerSettings() {
  const { verified } = useIsVerified();
  const { data: status, isLoading, isError } = useOnboardingStatus();
  const p = (status?.profile ?? {}) as { title?: string; bio?: string; skills?: string[]; hourlyRate?: number; location?: string; website?: string; portfolio?: string };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <div className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 ${verified ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
        <div className="flex items-center gap-3">
          {verified ? <ShieldCheck className="h-5 w-5 text-emerald-600" /> : <ShieldAlert className="h-5 w-5 text-amber-600" />}
          <div>
            <p className={`text-sm font-medium ${verified ? "text-emerald-900" : "text-amber-900"}`}>
              {verified ? "Payouts enabled" : "Finish payout setup"}
            </p>
            <p className={`text-xs ${verified ? "text-emerald-700" : "text-amber-700"}`}>
              {verified ? "Escrow releases land in your Stripe Connect account." : "Verify with Stripe Connect to receive escrow releases."}
            </p>
          </div>
        </div>
        {!verified ? (
          <Link to="/verify-stripe" className="cursor-pointer shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            Verify
          </Link>
        ) : null}
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Profile details</h2>
        {isLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-zinc-50" />
        ) : isError || !status ? (
          <p className="text-sm text-zinc-500">Failed to load your profile — please try again later.</p>
        ) : (
          <FreelancerSettingsForm
            key={status.id}
            initial={{ name: status.name ?? "", image: status.image ?? "", title: p.title ?? "", bio: p.bio ?? "", skills: p.skills ?? [], hourlyRateDollars: p.hourlyRate ? String(p.hourlyRate / 100) : "", location: p.location ?? "", website: p.website ?? "", portfolio: p.portfolio ?? "" }}
          />
        )}
      </div>
    </div>
  );
}
