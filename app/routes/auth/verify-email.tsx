// Verify email page — handles ?token= from Resend email (light-only, Indigo+Amber)
import { Link, useSearchParams } from "react-router";
import { CheckCircle2, XCircle, Mail, Loader2, ArrowRight } from "lucide-react";
import { useVerifyEmail, useResendVerification } from "@/lib/hooks/use-verify-email";
import type { Route } from "./+types/verify-email";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Verify email — TalentHive" }];
}

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const q = useVerifyEmail(token);
  const resend = useResendVerification();

  // no token — show entry state
  if (!token) {
    return <VerifyShell state="no-token" />;
  }

  if (q.isLoading) {
    return (
      <VerifyShell state="loading">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-zinc-500">Verifying your email…</p>
      </VerifyShell>
    );
  }

  if (q.isError) {
    const msg = (q.error as Error)?.message ?? "Verification failed";
    const isExpired = msg.toLowerCase().includes("expired");
    return (
      <VerifyShell state="error">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
          <XCircle className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">{isExpired ? "Link expired" : "Verification failed"}</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">{msg}</p>
        {q.data ? null : (
          <ResendBlock resend={resend} />
        )}
        <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          Back to sign in <ArrowRight className="h-4 w-4" />
        </Link>
      </VerifyShell>
    );
  }

  if (q.data) {
    return (
      <VerifyShell state="success">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Email verified!</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
          {q.data.message} You can now sign in to TalentHive and start hiring or freelancing with escrow protection.
        </p>
        <Link to="/login" className="cursor-pointer mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
          Continue to sign in <ArrowRight className="h-4 w-4" />
        </Link>
      </VerifyShell>
    );
  }

  return null;
}

function VerifyShell({ children, state }: { children?: React.ReactNode; state: string }) {
  return (
    <main className="min-h-screen bg-[#f0f2f3] px-4 py-10">
      <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[24px] border bg-white p-8 shadow-[0_20px_48px_rgba(0,0,0,0.08)]">
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
          <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold tracking-widest text-primary">VERIFY EMAIL</span>
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          {state === "no-token" ? (
            <>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-accent">
                <Mail className="h-7 w-7" />
              </span>
              <h1 className="mt-4 text-xl font-semibold tracking-tight">Check your email</h1>
              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Open the verification link we sent you. If you don’t see it, check spam or request a new link below.
              </p>
              <ResendBlock resend={useResendVerification()} />
            </>
          ) : (
            children
          )}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">© {new Date().getFullYear()} TalentHive — escrow-protected marketplace</p>
      </div>
    </main>
  );
}

function ResendBlock({ resend }: { resend: ReturnType<typeof useResendVerification> }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
        if (email) resend.mutate({ email });
      }}
      className="mt-6 w-full max-w-sm space-y-3 rounded-xl border bg-zinc-50 p-4 text-left"
    >
      <p className="text-xs font-semibold tracking-widest text-zinc-500">RESEND LINK</p>
      <div className="flex gap-2">
        <input name="email" type="email" required placeholder="you@company.com" className="flex-1 rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900" />
        <button disabled={resend.isPending} className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
          {resend.isPending ? "…" : "Resend"}
        </button>
      </div>
      <p className="text-[11px] text-zinc-500">Link expires in 24 hours. Google sign-ins don’t need this.</p>
    </form>
  );
}
