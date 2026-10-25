// ClientVerifyCard — save a card via Setup Checkout to fund escrow milestones
import { Link } from "react-router";
import { CreditCard, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";
import { useClientPaymentStatus, useClientSetup, useClientSync } from "@/lib/hooks/use-client-verification";

export function ClientVerifyCard({ onRefresh }: { onRefresh: () => void }) {
  const { data: status, isLoading } = useClientPaymentStatus();
  const setup = useClientSetup();
  const sync = useClientSync();
  const verified = status?.stripePaymentVerified;

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
        <h3 className="mt-3 font-semibold text-emerald-900">Verified client</h3>
        <p className="mt-1 text-sm text-emerald-700">
          Card on file{status?.stripeCardBrand ? ` — ${status.stripeCardBrand} •• ${status.stripeCardLast4}` : ""}. You can fund milestones.
        </p>
        <Link to="/dashboard/client" className="mt-4 inline-flex rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black">
          Go to dashboard
        </Link>
      </div>
    );
  }
  const refresh = () => {
    sync.mutate();
    onRefresh();
  };
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 flex gap-3">
        <CreditCard className="h-5 w-5 shrink-0 text-sky-600" />
        <div className="text-sm">
          <p className="font-medium text-sky-900">Add a card to make payments</p>
          <p className="text-sky-700">We save your card securely with Stripe. It is only charged when you fund a milestone.</p>
        </div>
      </div>
      <button onClick={() => setup.mutate()} disabled={setup.isPending} className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
        {setup.isPending ? "Redirecting…" : "Verify card with Stripe"} <ExternalLink className="h-4 w-4" />
      </button>
      <button onClick={refresh} disabled={sync.isPending} className="cursor-pointer w-full rounded-xl border border-zinc-100 bg-white py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60">
        {sync.isPending ? "Syncing…" : "I added my card — refresh status"}
      </button>
    </div>
  );
}
