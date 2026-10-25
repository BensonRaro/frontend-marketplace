// EarningsChart — freelancer released earnings by month (hand-built SVG, no chart lib)
import { useMemo } from "react";
import { useMyContracts } from "@/lib/hooks/use-contracts";
import { money } from "@/components/globals/job/job-detail";

const MONTHS = 6;
const W = 600;
const H = 210;
const PAD_TOP = 16;
const PAD_BOTTOM = 30;

type Bucket = { key: string; label: string; total: number };

// Month slots ending with the current month (released milestones never mutate after release,
// so updatedAt is the release month)
function lastMonths(n: number): Bucket[] {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("default", { month: "short" }), total: 0 };
  });
}

export function EarningsChart() {
  const { data, isLoading } = useMyContracts();
  const buckets = useMemo(() => {
    const bs = lastMonths(MONTHS);
    const byKey = new Map(bs.map((b) => [b.key, b]));
    for (const m of (data?.data ?? []).flatMap((c) => c.milestones)) {
      if (m.status !== "released") continue;
      const d = new Date(m.updatedAt);
      const b = byKey.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (b) b.total += m.amount;
    }
    return bs;
  }, [data]);

  const total = buckets.reduce((s, b) => s + b.total, 0);
  const max = Math.max(...buckets.map((b) => b.total), 1);
  const slot = W / MONTHS;
  const barW = Math.min(52, slot * 0.55);
  const chartH = H - PAD_TOP - PAD_BOTTOM;

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="font-semibold">Earnings</h2>
          <p className="text-xs text-zinc-500">Released escrow • last {MONTHS} months</p>
        </div>
        <p className="text-xl font-semibold tracking-tight">{isLoading ? "—" : money(total)}</p>
      </div>
      {isLoading ? (
        <div className="mt-4 h-[210px] animate-pulse rounded-xl bg-zinc-50" />
      ) : total === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed bg-zinc-50 px-4 py-10 text-center text-xs leading-5 text-zinc-500">No earnings yet — released escrow will chart here by month.</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Monthly earnings chart" className="mt-4 w-full">
          {[0.5, 1].map((f) => {
            const y = PAD_TOP + chartH * (1 - f);
            return (
              <g key={f}>
                <line x1="0" x2={W} y1={y} y2={y} stroke="#f4f4f5" strokeWidth="1" />
                <text x="2" y={y - 4} fontSize="10" fill="#a1a1aa">{money(Math.round(max * f))}</text>
              </g>
            );
          })}
          <line x1="0" x2={W} y1={PAD_TOP + chartH} y2={PAD_TOP + chartH} stroke="#e4e4e7" strokeWidth="1" />
          {buckets.map((b, i) => {
            const h = b.total > 0 ? Math.max(3, (b.total / max) * chartH) : 0;
            const x = i * slot + (slot - barW) / 2;
            return (
              <g key={b.key}>
                <rect x={x} y={PAD_TOP + chartH - h} width={barW} height={h} rx="6" className="fill-primary">
                  <title>{`${b.label}: ${money(b.total)}`}</title>
                </rect>
                <text x={x + barW / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="#71717a">{b.label}</text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
