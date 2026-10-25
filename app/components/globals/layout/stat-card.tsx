// StatCard — shared dashboard metric card (client + freelancer overviews)
import type { Briefcase } from "lucide-react";

type Props = {
  label: string;
  value: string;
  sub: string;
  icon: typeof Briefcase;
  accent: string;
};

export function StatCard({ label, value, sub, icon: Icon, accent }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${accent}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-sm font-medium text-zinc-900">{label}</div>
      <div className="text-xs text-zinc-500">{sub}</div>
    </div>
  );
}
