// Freelancer Dashboard — live work overview (stats + recommended jobs + checklist)
import { Link } from "react-router";
import { FileText, ShieldCheck, UserCheck } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { useOnboardingStatus } from "@/lib/hooks/use-onboarding";
import { useIsVerified } from "@/lib/hooks/use-verification";
import { useMyProposals } from "@/lib/hooks/use-proposals";
import { VerifiedInline } from "@/components/globals/feedback/verified-badge";
import { VerificationBanner } from "@/components/globals/feedback/verification-banner";
import { FreelancerStats } from "./components/dashboard-stats";
import { EarningsChart } from "./components/earnings-chart";
import { RecommendedJobs } from "./components/recommended-jobs";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Freelancer Dashboard — TalentHive" }];
}

export default function FreelancerDashboard() {
  const { data: session } = useSession();
  const { data: status } = useOnboardingStatus();
  const { verified } = useIsVerified();
  const { data: proposals } = useMyProposals();
  const name = session?.user.name?.split(" ")[0] ?? "there";
  const onboarded = status?.onboardingCompleted ?? false;

  return (
    <div className="space-y-6">
      <VerificationBanner />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Welcome back, {name} 👋 <VerifiedInline verified={verified} />
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Here’s the work waiting for your skills today.</p>
        </div>
        <Link to="/dashboard/freelancer/jobs" className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
          Find Work
        </Link>
      </div>

      <FreelancerStats />

      <EarningsChart />

      <div className="grid gap-6 lg:grid-cols-3">
        <RecommendedJobs />
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Get hired checklist</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <ChecklistRow done={onboarded} icon={UserCheck} title="Complete your profile" to="/onboarding" />
            <ChecklistRow done={verified} icon={ShieldCheck} title="Verify payouts with Stripe" to="/verify-stripe" />
            <ChecklistRow done={(proposals?.data.length ?? 0) > 0} icon={FileText} title="Submit your first proposal" to="/dashboard/freelancer/jobs" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function ChecklistRow({ done, icon: Icon, title, to }: { done?: boolean; icon: typeof FileText; title: string; to: string }) {
  return (
    <li>
      <Link to={to} className="flex items-center gap-3 rounded-xl border border-zinc-100 px-3 py-2.5 hover:bg-zinc-50">
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${done ? "bg-emerald-50 text-emerald-600" : "bg-zinc-50 text-zinc-400"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="flex-1 font-medium text-zinc-800">{title}</span>
        <span className={`text-xs font-medium ${done ? "text-emerald-600" : "text-zinc-400"}`}>{done ? "Done" : "Todo"}</span>
      </Link>
    </li>
  );
}
