// Admin sidebar — floating card with platform navigation (admin role only)
import { NavLink } from "react-router";
import { LayoutDashboard, Users, ScrollText, Settings, ExternalLink, X } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";

const main = [
  { to: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/admin/users", label: "Users", icon: Users },
  { to: "/dashboard/admin/activity-logs", label: "Activity Logs", icon: ScrollText },
  { to: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session } = useSession();

  return (
    <>
      {open && <button aria-label="Close" onClick={onClose} className="cursor-pointer fixed inset-0 z-30 bg-primary/10 backdrop-blur-sm lg:hidden" />}

      <div className={`fixed inset-y-0 left-0 z-40 w-[300px] p-3 transition duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <aside className="flex h-full w-full flex-col rounded-2xl border border-zinc-100 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-900 text-white">
                <span className="grid grid-cols-2 gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-white/70" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-white/70" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                </span>
              </span>
              <span className="text-sm font-semibold tracking-tight">TalentHive</span>
              <span className="ml-1 rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-white">ADMIN</span>
            </div>
            <button onClick={onClose} className="cursor-pointer grid h-7 w-7 place-items-center rounded-lg hover:bg-zinc-50 lg:hidden">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <nav className="space-y-1">
              {main.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={(item as { end?: boolean }).end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"}`
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Footer — back to site + signed-in admin */}
          <div className="p-3">
            <NavLink to="/" className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-zinc-100 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
              <ExternalLink className="h-4 w-4" /> Back to site
            </NavLink>

            <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 p-2">
              {session?.user.image ? (
                <img src={session.user.image} alt="avatar" className="h-8 w-8 shrink-0 rounded-full border border-white object-cover shadow-sm" />
              ) : (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white">{(session?.user.name ?? "A").slice(0, 2).toUpperCase()}</span>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium leading-none">{session?.user.name ?? session?.user.email ?? "Admin"}</div>
                <div className="truncate text-xs text-zinc-500">{session?.user.email ?? ""}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
