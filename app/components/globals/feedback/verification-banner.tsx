// VerificationBanner — Stripe verify nudge (amber) or verified confirmation (emerald)
import { Link } from "react-router";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { useIsVerified } from "@/lib/hooks/use-verification";

export function VerificationBanner() {
  const { data: session } = useSession();
  const { verified, payLabel } = useIsVerified();

  if (verified === false) {
    const freelancer = session?.user.role === "freelancer";
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-900">{freelancer ? "Verify to receive payouts" : "Verify to make payments"}</p>
            <p className="text-xs text-amber-700">{freelancer ? "Stripe Connect required for escrow releases." : "Save a card with Stripe to fund milestones."}</p>
          </div>
        </div>
        <Link to="/verify-stripe" className="cursor-pointer shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
          Verify
        </Link>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <ShieldCheck className="h-4 w-4" /> Verified with Stripe — {payLabel}
      </div>
    );
  }

  return null;
}
