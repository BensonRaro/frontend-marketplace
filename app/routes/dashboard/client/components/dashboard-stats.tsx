// ClientStats — live hiring metrics (open jobs, bids, contracts, escrow spend)
import { Briefcase, FileText, Handshake, Wallet } from "lucide-react";
import { useClientJobs } from "@/lib/hooks/use-jobs";
import { useClientProposals } from "@/lib/hooks/use-proposals";
import { useMyContracts } from "@/lib/hooks/use-contracts";
import { StatCard } from "@/components/globals/layout/stat-card";
import { money } from "@/components/globals/job/job-detail";

export function ClientStats() {
  const { data: jobs } = useClientJobs({ limit: 50 });
  const { data: proposals } = useClientProposals();
  const { data: contracts } = useMyContracts();

  const loaded = !!jobs && !!proposals && !!contracts;
  const list = jobs?.data ?? [];
  const open = list.filter((j) => j.isOpen).length;
  const bids = proposals?.data ?? [];
  const pending = bids.filter((p) => p.status === "pending").length;
  const cons = contracts?.data ?? [];
  const active = cons.filter((c) => !c.isCompleted).length;
  const all = cons.flatMap((c) => c.milestones);
  const escrow = all.filter((m) => m.status === "funded" || m.status === "submitted").reduce((s, m) => s + m.amount, 0);
  const spent = all.filter((m) => m.status === "released").reduce((s, m) => s + m.amount, 0);
  const v = (s: string) => (loaded ? s : "—");

  const stats = [
    { label: "Active Jobs", value: v(String(open)), sub: `${list.length} total postings`, icon: Briefcase, accent: "bg-primary-soft text-primary" },
    { label: "Proposals", value: v(String(bids.length)), sub: `${pending} awaiting review`, icon: FileText, accent: "bg-amber-50 text-accent" },
    { label: "Contracts", value: v(String(active)), sub: `${cons.length - active} completed`, icon: Handshake, accent: "bg-emerald-50 text-emerald-600" },
    { label: "Total Spent", value: v(money(spent)), sub: `${money(escrow)} held in escrow`, icon: Wallet, accent: "bg-zinc-50 text-zinc-700" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
