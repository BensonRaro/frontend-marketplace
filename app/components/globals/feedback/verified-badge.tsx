// VerifiedBadge — shows check for Stripe-verified users (client to pay, freelancer to receive)
import { BadgeCheck } from "lucide-react";

export function VerifiedBadge({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <span title="Verified with Stripe" className={`inline-flex items-center justify-center rounded-full bg-primary text-white ${className}`}>
      <BadgeCheck style={{ width: size, height: size }} className="shrink-0" />
    </span>
  );
}

export function VerifiedInline({ verified, label = "Verified" }: { verified?: boolean; label?: string }) {
  if (!verified) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
      <BadgeCheck className="h-3 w-3" /> {label}
    </span>
  );
}
