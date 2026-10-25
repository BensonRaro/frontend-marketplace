// FreelancerStats — live work metrics (open jobs, bids, contracts, earnings)
import { Briefcase, FileText, Handshake, Wallet } from "lucide-react";
import { useJobs } from "@/lib/hooks/use-jobs";
import { useMyProposals } from "@/lib/hooks/use-proposals";
import { useMyContracts } from "@/lib/hooks/use-contracts";
import { StatCard } from "@/components/globals/layout/stat-card";
import { money } from "@/components/globals/job/job-detail";

export function FreelancerStats() {
  const { data: jobs } = useJobs({ limit: 1 });
  const { data: proposals } = useMyProposals();
  const { data: contracts } = useMyContracts();

  const loaded = !!jobs && !!proposals && !!contracts;
  const bids = proposals?.data ?? [];
  const pending = bids.filter((p) => p.status === "pending").length;
  const cons = contracts?.data ?? [];
  const active = cons.filter((c) => !c.isCompleted).length;
  const all = cons.flatMap((c) => c.milestones);
  const earned = all.filter((m) => m.status === "released").reduce((s, m) => s + m.amount, 0);
  const incoming = all.filter((m) => m.status === "funded" || m.status === "submitted").reduce((s, m) => s + m.amount, 0);
  const v = (s: string) => (loaded ? s : "—");

  const stats = [
    { label: "Open Jobs", value: v(String(jobs?.pagination.total ?? "—")), sub: "across all categories", icon: Briefcase, accent: "bg-primary-soft text-primary" },
    { label: "My Proposals", value: v(String(bids.length)), sub: `${pending} awaiting decision`, icon: FileText, accent: "bg-amber-50 text-accent" },
    { label: "Active Contracts", value: v(String(active)), sub: `${cons.length - active} completed`, icon: Handshake, accent: "bg-emerald-50 text-emerald-600" },
    { label: "Escrow Earned", value: v(money(earned)), sub: `${money(incoming)} locked in escrow`, icon: Wallet, accent: "bg-zinc-50 text-zinc-700" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
