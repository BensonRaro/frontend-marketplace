// Signup form — right panel (Versa-inspired, marketplace copy)
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { api } from "@/lib/api";
import { getSignupError, useSignup } from "@/lib/hooks/use-signup";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "freelancer">("client");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(true);
  const nav = useNavigate();
  const m = useSignup();
  const err = m.isError ? getSignupError(m.error) : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    m.mutate({ name, email, password, role }, { onSuccess: () => nav(`/check-email?email=${encodeURIComponent(email)}`) });
  };

  return (
    <div className="flex flex-col p-8 lg:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Create account</h2>
        <p className="mt-1 text-sm text-zinc-500">Join TalentHive — hire or get hired in minutes</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-[11px] font-semibold tracking-widest text-zinc-500">FULL NAME</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" required className="w-full rounded-xl border border-zinc-200 bg-[#fafaf8] py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold tracking-widest text-zinc-500">EMAIL</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@talenthive.work" type="email" required className="w-full rounded-xl border border-zinc-200 bg-[#fafaf8] py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold tracking-widest text-zinc-500">PASSWORD</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder="••••••••" required className="w-full rounded-xl border border-zinc-200 bg-[#fafaf8] py-2.5 pl-10 pr-10 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(["client", "freelancer"] as const).map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)} className={`rounded-xl border py-2.5 text-sm font-medium capitalize transition ${role === r ? "border-zinc-900 bg-primary text-white" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"}`}>
              {r}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-zinc-600">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-zinc-900" />
          I agree to the <Link to="#" className="font-medium text-zinc-900 underline">Terms</Link> and <Link to="#" className="font-medium text-zinc-900 underline">Privacy</Link>
        </label>

        {err && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

        <button disabled={m.isPending || !agree} className="cursor-pointer w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60">
          {m.isPending ? "Creating..." : "Create account"}
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
        Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
      <div className="mt-6 flex items-center justify-center gap-3 border-t pt-4 text-[10px] tracking-wide text-zinc-400">
        <span>256-bit SSL</span>•<span>SOC 2 Type II</span>•<span>99.9% uptime</span>
      </div>
    </div>
  );
}
