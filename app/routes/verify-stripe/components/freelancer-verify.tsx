// FreelancerVerifyCard — Connect onboarding to receive escrow releases
import { Link } from "react-router";
import { ShieldAlert, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";
import { useStripeStatus, useStripeConnect } from "@/lib/hooks/use-stripe";

export function FreelancerVerifyCard({ onRefresh }: { onRefresh: () => void }) {
  const { data: status, isLoading } = useStripeStatus();
  const connect = useStripeConnect();
  const verified = status?.stripeVerified;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }
  if (verified) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-3 font-semibold text-emerald-900">Verified freelancer</h3>
        <p className="mt-1 text-sm text-emerald-700">Payouts enabled. You can receive escrow releases.</p>
        <p className="mt-2 text-xs text-emerald-600">Account: {status?.stripeAccountId}</p>
        <Link to="/" className="mt-4 inline-flex rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black">
          Go to dashboard
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-sm">
          <p className="font-medium text-amber-900">Verification required to receive payouts</p>
          <p className="text-amber-700">Stripe Connect verifies your identity for escrow releases. Takes ~2 minutes.</p>
          <ul className="mt-2 list-disc pl-5 text-xs text-amber-700">
            <li>Details submitted: {status?.stripeDetailsSubmitted ? "Yes" : "No"}</li>
            <li>Charges enabled: {status?.stripeChargesEnabled ? "Yes" : "No"}</li>
            <li>Payouts enabled: {status?.stripePayoutsEnabled ? "Yes" : "No"}</li>
          </ul>
        </div>
      </div>
      <button onClick={() => connect.mutate()} disabled={connect.isPending} className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
        {connect.isPending ? "Redirecting…" : "Verify with Stripe"} <ExternalLink className="h-4 w-4" />
      </button>
      <button onClick={onRefresh} className="cursor-pointer w-full rounded-xl border border-zinc-100 bg-white py-2 text-sm font-medium hover:bg-zinc-50">
        Refresh status
      </button>
    </div>
  );
}
