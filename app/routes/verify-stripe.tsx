// Verify Stripe — role-aware: client saves a card (pay), freelancer connects (receive)
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { useStripeStatus } from "@/lib/hooks/use-stripe";
import { useClientPaymentStatus, useClientSync } from "@/lib/hooks/use-client-verification";
import { FreelancerVerifyCard } from "./verify-stripe/components/freelancer-verify";
import { ClientVerifyCard } from "./verify-stripe/components/client-verify";
import type { Route } from "./+types/verify-stripe";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Verify with Stripe — TalentHive" }];
}

export default function VerifyStripe() {
  const [params] = useSearchParams();
  const success = params.get("success") === "true";
  const refresh = params.get("refresh") === "true";
  const { data: session } = useSession();
  const role = session?.user.role;
  const isClient = role !== "freelancer";

  const connectQuery = useStripeStatus(!isClient);
  const cardQuery = useClientPaymentStatus(isClient);
  const sync = useClientSync();

  useEffect(() => {
    if (success || refresh) {
      if (isClient) {
        sync.mutate();
        cardQuery.refetch();
      } else connectQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, refresh]);

  const verified = isClient ? cardQuery.data?.stripePaymentVerified : connectQuery.data?.stripeVerified;
  const refetchAll = () => {
    if (isClient) cardQuery.refetch();
    else connectQuery.refetch();
  };

  return (
    <main className="min-h-screen bg-[#f0f2f3] px-4 py-10">
      <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.12)]">
        <div className="border-b bg-gradient-to-b from-primary-soft to-white p-8">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">TalentHive</span>
            <span className="ml-auto rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-white">STRIPE VERIFY</span>
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">{isClient ? "Verify to make payments" : "Verify to receive payouts"}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {verified ? "You’re verified." : isClient ? "Save a card with Stripe to fund milestones." : "Complete Connect onboarding to receive escrow releases."}
          </p>
        </div>
        <div className="p-8">
          {isClient ? <ClientVerifyCard onRefresh={refetchAll} /> : <FreelancerVerifyCard onRefresh={refetchAll} />}
          {success && !verified ? <p className="mt-4 text-center text-xs text-amber-600">Return detected — Stripe may still be processing. Click refresh.</p> : null}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[640px] text-center text-xs text-zinc-400">Powered by Stripe — test mode</p>
    </main>
  );
}
