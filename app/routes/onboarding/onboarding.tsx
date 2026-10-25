// Onboarding route — mandatory for client/freelancer (admin bypassed), light-only Indigo+Amber
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSession } from "@/lib/hooks/use-session";
import { useOnboardingStatus } from "@/lib/hooks/use-onboarding";
import { ClientOnboardingForm } from "./components/client-form";
import { FreelancerOnboardingForm } from "./components/freelancer-form";
import type { Route } from "./+types/onboarding";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Complete your profile — TalentHive" }];
}

export default function Onboarding() {
  const nav = useNavigate();
  const { data: session, isLoading: sLoading } = useSession();
  const { data: status, isLoading: oLoading, isError: oError } = useOnboardingStatus();

  const role = (status?.role ?? session?.user.role) as string | undefined;
  // Prefer status, fallback to session (session is refreshed from DB via jwt)
  const completed =
    status?.onboardingCompleted ??
    (session?.user as unknown as { onboardingCompleted?: boolean })?.onboardingCompleted ??
    false;

  useEffect(() => {
    if (!sLoading && !session?.user) nav("/login", { replace: true });
  }, [sLoading, session, nav]);

  useEffect(() => {
    // Redirect if already completed (status is source of truth when available)
    if (status && (status.role === "admin" || status.onboardingCompleted)) nav("/", { replace: true });
    // Fallback: session says completed and status not yet loaded
    if (!status && !oLoading && !oError && completed && role !== "freelancer" && role !== "client") {
      // No-op: wait for status
    }
    if (!status && !oLoading && completed && (role === "client" || role === "freelancer")) {
      // If session says completed but status confirms, redirect
      if ((session?.user as unknown as { onboardingCompleted?: boolean })?.onboardingCompleted) nav("/", { replace: true });
    }
  }, [status, oLoading, oError, completed, role, nav, session]);

  // Only block on session, not onboarding status — show form immediately for non-completed users
  if (sLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f0f2f3]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;
  // Admin bypass — never show onboarding
  if (role === "admin") {
    nav("/", { replace: true });
    return null;
  }
  if (completed) return null;

  return (
    <main className="min-h-screen bg-[#f0f2f3] px-4 py-8">
      <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.12)]">
        <div className="border-b bg-gradient-to-b from-primary-soft to-white p-8">
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
            <span className="ml-auto rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-white">ONBOARDING</span>
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            {role === "freelancer" ? "Set up your freelancer profile" : "Tell us about your team"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {role === "freelancer" ? "Add your skills and rates — clients will find you faster." : "Complete your client profile to start posting jobs with escrow protection."}
          </p>
          <div className="mt-4 flex gap-1.5">
            <span className="h-1.5 flex-1 rounded-full bg-primary" />
            <span className="h-1.5 flex-1 rounded-full bg-zinc-200" />
          </div>
        </div>

        <div className="p-8">
          {role === "freelancer" ? <FreelancerOnboardingForm /> : <ClientOnboardingForm />}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[640px] text-center text-xs text-zinc-400">© {new Date().getFullYear()} TalentHive — escrow-protected marketplace</p>
    </main>
  );
}
