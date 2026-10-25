// Signin form — right panel, Versa-inspired (Welcome back)
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { getSigninError, useSignin } from "@/lib/hooks/use-signin";

export function SigninForm() {
  const [email, setEmail] = useState("alex@talenthive.work");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const nav = useNavigate();
  const m = useSignin();
  const err = m.isError ? getSigninError(m.error) : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    m.mutate({ email, password }, { onSuccess: () => nav("/") });
  };

  return (
    <div className="flex flex-col p-8 lg:p-10">
      <div className="mb-6">
        <h2 className="text-[24px] font-semibold tracking-tight">Welcome back</h2>
        <p className="mt-1 text-sm text-zinc-500">Sign in to your TalentHive account</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-[11px] font-semibold tracking-widest text-zinc-500">EMAIL</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-xl border border-zinc-200 bg-[#fafaf8] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900 focus:bg-white" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold tracking-widest text-zinc-500">PASSWORD</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} required placeholder="••••••••" className="w-full rounded-xl border border-zinc-200 bg-[#fafaf8] py-2.5 pl-10 pr-10 text-sm outline-none focus:border-zinc-900 focus:bg-white" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-zinc-600">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-3.5 w-3.5 rounded border-zinc-300 text-primary accent-primary" />
            Remember me
          </label>
          <Link to="#" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {err && (
          <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <div>{err}</div>
            {err.toLowerCase().includes("verify") ? (
              <Link to={`/check-email?email=${encodeURIComponent(email)}`} className="mt-1 inline-block font-medium text-primary underline">
                Resend verification link →
              </Link>
            ) : null}
          </div>
        )}

        <button disabled={m.isPending} className="cursor-pointer w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
          {m.isPending ? "Signing in..." : "Sign in to Dashboard"}
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-400">or</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>

        <button
          type="button"
          onClick={async () => {
            const base = (api.defaults.baseURL as string) ?? "http://localhost:5000";
            const { data } = await api.get<{ csrfToken: string }>("/api/auth/csrf");
            const form = document.createElement("form");
            form.method = "POST";
            form.action = `${base}/api/auth/signin/google`;
            const cb = document.createElement("input");
            cb.type = "hidden";
            cb.name = "callbackUrl";
            cb.value = window.location.origin;
            const tok = document.createElement("input");
            tok.type = "hidden";
            tok.name = "csrfToken";
            tok.value = data.csrfToken;
            form.appendChild(cb);
            form.appendChild(tok);
            document.body.appendChild(form);
            form.submit();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-medium hover:bg-zinc-50"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="" className="h-4 w-4" />
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Don&apos;t have an account? <Link to="/signup" className="font-semibold text-primary hover:underline">Create one free</Link>
      </p>
      <div className="mt-6 flex items-center justify-center gap-3 border-t pt-4 text-[10px] tracking-wide text-zinc-400">
        <span>256-bit SSL</span>•<span>SOC 2 Type II</span>•<span>99.9% uptime</span>
      </div>
    </div>
  );
}
