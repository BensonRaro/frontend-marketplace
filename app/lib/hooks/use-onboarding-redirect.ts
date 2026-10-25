// useOnboardingRedirect — global guard: if logged-in non-admin hasn't onboarded, force /onboarding
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSession } from "@/lib/hooks/use-session";
import { useOnboardingStatus } from "@/lib/hooks/use-onboarding";

export function useOnboardingRedirect() {
  const nav = useNavigate();
  const loc = useLocation();
  const { data: session } = useSession();
  const { data: status, isLoading } = useOnboardingStatus();

  useEffect(() => {
    if (!session?.user) return;
    if (isLoading) return;
    if (loc.pathname === "/onboarding") return;
    if (session.user.role === "admin") return;
    const completed = status?.onboardingCompleted ?? (session.user as unknown as { onboardingCompleted?: boolean })?.onboardingCompleted;
    if (completed === false) nav("/onboarding", { replace: true });
  }, [session, status, isLoading, loc.pathname, nav]);
}
