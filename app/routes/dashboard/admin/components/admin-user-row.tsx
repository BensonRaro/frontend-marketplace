// AdminUserRow — one directory row: identity, role, verification, status, moderation actions
import { ShieldCheck, ShieldAlert, Ban, RotateCcw } from "lucide-react";
import type { AdminUser } from "@/lib/hooks/use-admin";

const roleStyle: Record<AdminUser["role"], string> = {
  admin: "bg-zinc-900 text-white",
  client: "bg-sky-50 text-sky-700",
  freelancer: "bg-emerald-50 text-emerald-700",
};

type Props = {
  user: AdminUser;
  onBan: (user: AdminUser) => void;
  onUnban: (user: AdminUser) => void;
};

export function AdminUserRow({ user: u, onBan, onUnban }: Props) {
  const isAdmin = u.role === "admin";
  return (
    <tr className="transition hover:bg-zinc-50/60">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {u.image ? (
            <img src={u.image} alt={u.name ?? "user"} className="h-8 w-8 rounded-full border border-zinc-100 object-cover" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">{(u.name ?? "U").slice(0, 2).toUpperCase()}</span>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium">{u.name ?? "Unnamed"}</p>
            <p className="truncate text-xs text-zinc-500">
              {u.email ?? "—"}
              {u.clientProfile?.company ? ` • ${u.clientProfile.company}` : ""}
              {u.freelancerProfile?.title ? ` • ${u.freelancerProfile.title}` : ""}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${roleStyle[u.role]}`}>{u.role}</span>
      </td>
      <td className="px-4 py-3">{verificationCell(u)}</td>
      <td className="px-4 py-3 text-xs text-zinc-500">
        {u.role === "client" ? (
          <>{u._count.jobPostings} jobs • {u._count.contractsAsClient} contracts</>
        ) : (
          <>{u._count.contractsAsFreelancer} contracts</>
        )}
      </td>
      <td className="px-4 py-3">
        {u.isBanned ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
            <Ban className="h-3 w-3" /> Suspended
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
            <ShieldCheck className="h-3 w-3" /> Active
          </span>
        )}
        {u.isBanned && u.banReason ? <p className="mt-1 max-w-[220px] truncate text-[11px] text-zinc-500" title={u.banReason}>{u.banReason}</p> : null}
      </td>
      <td className="px-4 py-3">
        {isAdmin ? (
          <span className="text-xs text-zinc-400">—</span>
        ) : u.isBanned ? (
          <button type="button" onClick={() => onUnban(u)} className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-zinc-100 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
            <RotateCcw className="h-3 w-3" /> Restore
          </button>
        ) : (
          <button type="button" onClick={() => onBan(u)} className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100">
            <Ban className="h-3 w-3" /> Suspend
          </button>
        )}
      </td>
    </tr>
  );
}

// Verification chip — card for clients, Connect payouts for freelancers
function verificationCell(u: AdminUser) {
  if (u.role === "admin") return <span className="text-xs text-zinc-500">—</span>;
  if (u.role === "client") {
    return u.stripePaymentVerified ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> Card verified</span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><ShieldAlert className="h-3.5 w-3.5" /> Unverified</span>
    );
  }
  return u.stripeVerified ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> Payouts on</span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><ShieldAlert className="h-3.5 w-3.5" /> Unverified</span>
  );
}
