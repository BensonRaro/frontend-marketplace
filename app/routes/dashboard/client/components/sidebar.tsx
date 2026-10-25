// Client sidebar — floating card, lighter border + shadow, only relevant client links + verified check
import { NavLink } from "react-router";
import { LayoutDashboard, Briefcase, FileText, Handshake, MessageSquare, Settings, LifeBuoy, X, Plus } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { useIsVerified } from "@/lib/hooks/use-verification";
import { useClientJobs } from "@/lib/hooks/use-jobs";
import { useClientProposals } from "@/lib/hooks/use-proposals";
import { VerifiedBadge } from "@/components/globals/feedback/verified-badge";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  countKey?: "jobs" | "proposals";
};

const main: NavItem[] = [
  { to: "/dashboard/client", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/client/jobs/new", label: "Create Job", icon: Plus, end: true },
  { to: "/dashboard/client/jobs", label: "Jobs", icon: Briefcase, countKey: "jobs" as const, end: true },
  { to: "/dashboard/client/proposals", label: "Proposals", icon: FileText, countKey: "proposals" as const },
  { to: "/dashboard/client/contracts", label: "Contracts", icon: Handshake },
  { to: "/dashboard/client/messages", label: "Messages", icon: MessageSquare },
];

export function ClientSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const { verified } = useIsVerified();
  // Live badge counts — totals only (limit 1 keeps the payload tiny)
  const { data: jobsData } = useClientJobs({ limit: 1 });
  const { data: proposalsData } = useClientProposals();
  const counts = {
    jobs: jobsData?.pagination.total,
    proposals: proposalsData?.data.length,
  };
  return (
    <>
      {open && <button aria-label="Close" onClick={onClose} className="cursor-pointer fixed inset-0 z-30 bg-primary/10 backdrop-blur-sm lg:hidden" />}

      <div className={`fixed inset-y-0 left-0 z-40 w-[300px] p-3 transition duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <aside className="cursor-pointer flex h-full w-full flex-col rounded-2xl border border-zinc-100 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-white">
                <span className="grid grid-cols-2 gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-white/70" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-white/70" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                </span>
              </span>
              <span className="text-sm font-semibold tracking-tight">TalentHive</span>
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-white">CLIENT</span>
            </div>
            <button onClick={onClose} className="cursor-pointer grid h-7 w-7 place-items-center rounded-lg hover:bg-zinc-50 lg:hidden">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {/* Main — only relevant client links */}
            <nav className="space-y-1">
              {main.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end as boolean | undefined}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-primary text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"}`
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.countKey !== undefined && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.label === "Proposals" ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-600"}`}>
                      {counts[item.countKey] ?? "—"}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="my-4 border-t border-zinc-100" />

            <nav className="space-y-1">
              <NavLink to="/dashboard/client/settings" className={({ isActive }) => `cursor-pointer flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${isActive ? "bg-primary text-white" : "text-zinc-600 hover:bg-zinc-50"}`}>
                <LifeBuoy className="h-4 w-4" /> Support
              </NavLink>
              <NavLink to="/dashboard/client/settings" className="cursor-pointer flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                <Settings className="h-4 w-4" /> Settings
              </NavLink>
            </nav>
          </div>

          {/* Create Job CTA + User — now shows real session */}
          <div className="p-3">
            <NavLink to="/dashboard/client/jobs/new" className="cursor-pointer mb-3 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
              <Plus className="h-4 w-4" /> Create Job
            </NavLink>

            <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 p-2">
              <div className="relative shrink-0">
                {session?.user.image ? (
                  <img src={session.user.image} alt={session.user.name ?? "avatar"} className="h-8 w-8 rounded-full object-cover border border-white shadow-sm" />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-white">{(session?.user.name ?? "C").slice(0, 2).toUpperCase()}</span>
                )}
                {verified ? <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-white ring-2 ring-white"><VerifiedBadge size={10} className="bg-primary" /></span> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 truncate text-sm font-medium leading-none">
                  {session?.user.name ?? session?.user.email ?? "Client"} {verified ? <VerifiedBadge size={12} /> : null}
                </div>
                <div className="truncate text-xs text-zinc-500">{verified ? "Verified • " : "Unverified • "}{session?.user.email ?? ""}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
