// AdminStatsGrid — platform-wide metric tiles (users, jobs, escrow, disputes)
import { Users, Briefcase, Handshake, Wallet, Scale, Activity } from "lucide-react";
import { StatCard } from "@/components/globals/layout/stat-card";
import { money } from "@/components/globals/job/job-detail";
import type { AdminStats } from "@/lib/hooks/use-admin";

export function AdminStatsGrid({ stats }: { stats: AdminStats }) {
  const tiles = [
    { label: "Users", value: String(stats.users.total), sub: `${stats.users.clients} clients • ${stats.users.freelancers} freelancers • ${stats.users.banned} suspended`, icon: Users, accent: "bg-primary/10 text-primary" },
    { label: "Open jobs", value: String(stats.jobs.open), sub: `${stats.jobs.total} posted • ${stats.proposals.pending} pending proposals`, icon: Briefcase, accent: "bg-amber-100 text-amber-700" },
    { label: "Contracts", value: String(stats.contracts.total), sub: `${stats.contracts.completed} completed • ${stats.reviews.total} reviews`, icon: Handshake, accent: "bg-emerald-100 text-emerald-700" },
    { label: "Escrow held", value: money(stats.escrow.held), sub: `${money(stats.escrow.released)} released to date`, icon: Wallet, accent: "bg-sky-100 text-sky-700" },
    { label: "Disputed milestones", value: String(stats.escrow.disputed), sub: stats.escrow.disputed ? "Needs admin review" : "No open disputes", icon: Scale, accent: "bg-rose-100 text-rose-700" },
    { label: "Activity (24h)", value: String(stats.activity.last24h), sub: `${stats.escrow.feePercent}% platform fee on escrow`, icon: Activity, accent: "bg-zinc-100 text-zinc-700" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tiles.map((t) => (
        <StatCard key={t.label} label={t.label} value={t.value} sub={t.sub} icon={t.icon} accent={t.accent} />
      ))}
    </div>
  );
}
