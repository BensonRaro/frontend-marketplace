// useIsVerified — role-aware verified flag (client: card, freelancer: Connect)
import { useSession } from "@/lib/hooks/use-session";
import { useStripeStatus } from "@/lib/hooks/use-stripe";
import { useClientPaymentStatus } from "@/lib/hooks/use-client-verification";

export function useIsVerified() {
  const { data: session } = useSession();
  const role = session?.user.role;
  // Fire only for the matching role — undefined (still loading) fires nothing, avoiding 403 noise
  const connect = useStripeStatus(role === "freelancer" || role === "admin");
  const card = useClientPaymentStatus(role === "client" || role === "admin");

  if (role === "client") {
    const verified = card.data?.stripePaymentVerified ?? session?.user.stripePaymentVerified ?? false;
    return { role, verified, isLoading: card.isLoading, payLabel: "payments enabled", refetch: card.refetch };
  }
  const verified = connect.data?.stripeVerified ?? session?.user.stripeVerified ?? false;
  return { role, verified, isLoading: connect.isLoading, payLabel: "payouts enabled", refetch: connect.refetch };
}
