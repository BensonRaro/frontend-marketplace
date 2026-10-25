// Client Dashboard — live hiring overview (stats + recent jobs + approval queue)
import { useSession } from "@/lib/hooks/use-session";
import { useIsVerified } from "@/lib/hooks/use-verification";
import { VerifiedInline } from "@/components/globals/feedback/verified-badge";
import { VerificationBanner } from "@/components/globals/feedback/verification-banner";
import { ClientStats } from "./components/dashboard-stats";
import { RecentJobs } from "./components/recent-jobs";
import { ApprovalQueue } from "./components/approval-queue";
import { CreateJobDialog } from "./jobs/components/create-job-dialog";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Client Dashboard — TalentHive" }];
}

export default function ClientDashboard() {
  const { data: session } = useSession();
  const { verified } = useIsVerified();
  const name = session?.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <VerificationBanner />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Welcome back, {name} 👋 <VerifiedInline verified={verified} />
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Here’s what’s happening with your hiring today.</p>
        </div>
        <CreateJobDialog triggerLabel="Post a job" />
      </div>

      <ClientStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentJobs />
        <ApprovalQueue />
      </div>
    </div>
  );
}
