// Hero — light-only panel with soft glows, escrow-first pitch + floating product cards
import { Link } from "react-router";
import { ArrowRight, BadgeCheck, Lock, Star, Zap } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";

export function Hero() {
  const { data: session } = useSession();
  const role = session?.user.role;
  const primary = role === "client" ? { to: "/dashboard/client/jobs/new", label: "Post a job" } : role === "freelancer" ? { to: "/dashboard/freelancer/jobs", label: "Find work" } : { to: "/signup", label: "Start earning" };
  const dashboard = role === "client" ? "/dashboard/client" : role === "freelancer" ? "/dashboard/freelancer" : null;

  return (
    <section className="relative overflow-hidden bg-white">
      {/* soft glows */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-soft blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-accent-soft blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-primary-muted/60 bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary">
            <Lock className="h-3.5 w-3.5" /> Escrow-protected freelance marketplace
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Hire fast. Work safe. <span className="text-primary">Get paid</span> on delivery.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-6 text-zinc-600">
            TalentHive holds every milestone in Stripe escrow — clients release funds only on approval, and freelancers always get paid for approved work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={primary.to} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-hover">
              {primary.label} <ArrowRight className="h-4 w-4" />
            </Link>
            {dashboard ? (
              <Link to={dashboard} className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50">
                Go to dashboard
              </Link>
            ) : (
              <Link to="/jobs" className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50">
                Browse all jobs
              </Link>
            )}
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
            <li className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-accent-hover" /> Stripe-verified payments</li>
            <li className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-accent-hover" /> Real-time messaging</li>
            <li className="flex items-center gap-1.5"><Star className="h-4 w-4 text-accent-hover" /> Two-way reviews</li>
          </ul>
        </div>

        {/* floating product cards */}
        <div aria-hidden className="relative hidden lg:block">
          <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.10)]">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">Milestone released</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">Landing page + CMS setup</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full w-full rounded-full bg-accent" />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-accent-hover">$1,850.00</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Approved</span>
            </div>
          </div>
          <div className="absolute -left-10 -top-8 rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl">
            <p className="text-xs text-zinc-500">New proposal</p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-900">$1,700 • 12 days</p>
          </div>
          <div className="absolute -bottom-8 -right-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl">
            <p className="flex items-center gap-1 text-sm font-semibold text-zinc-900"><Star className="h-4 w-4 fill-accent text-accent" /> 5.0</p>
            <p className="mt-0.5 text-xs text-zinc-500">“Flawless delivery”</p>
          </div>
        </div>
      </div>
    </section>
  );
}
