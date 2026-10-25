// Check-email page — shown after credentials signup (Resend verification)
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { useResendVerification } from "@/lib/hooks/use-verify-email";
import type { Route } from "./+types/check-email";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Check your email — TalentHive" }];
}

export default function CheckEmail() {
  const [params] = useSearchParams();
  const initialEmail = params.get("email") ?? "";
  const [email, setEmail] = useState(initialEmail);
  const m = useResendVerification();

  return (
    <main className="min-h-screen bg-[#f0f2f3] px-4 py-10">
      <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[24px] bg-white shadow-[0_20px_48px_rgba(0,0,0,0.08)]">
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
          </div>

          <div className="mt-6 flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
              <Mail className="h-6 w-6 text-primary" />
            </span>
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight">Check your email</h1>
              <p className="mt-1 max-w-[360px] text-sm leading-6 text-zinc-500">
                We sent a verification link to <span className="font-medium text-zinc-900">{initialEmail || "your inbox"}</span>. Click the link to activate your account — it expires in 24 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="rounded-xl border bg-amber-50/60 p-3 text-xs leading-5 text-zinc-600">
            <span className="font-semibold text-zinc-900">Didn’t get it?</span> Check spam, or wait a minute and resend. Google sign-ins are auto-verified and don’t need this step.
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) m.mutate({ email: email.trim() });
            }}
            className="mt-6 space-y-3"
          >
            <label className="block text-[11px] font-semibold tracking-widest text-zinc-500">EMAIL</label>
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@company.com"
                className="flex-1 rounded-xl border border-zinc-200 bg-[#fafaf8] px-3 py-2.5 text-sm outline-none focus:border-zinc-900 focus:bg-white"
              />
              <button
                disabled={m.isPending}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {m.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                {m.isPending ? "Sending…" : "Resend link"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Back to sign in <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-xs text-zinc-400">Link valid 24h</span>
          </div>
        </div>

        <p className="border-t px-8 py-4 text-center text-xs text-zinc-400">© {new Date().getFullYear()} TalentHive — escrow-protected marketplace</p>
      </div>
    </main>
  );
}
