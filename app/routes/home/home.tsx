// Home — marketing landing (hero + fresh jobs; full jobs page lands LATER)
import type { Route } from "./+types/home";
import { SiteHeader } from "@/components/globals/layout/site-header";
import { Hero } from "@/routes/home/components/hero";
import { NewJobs } from "@/routes/home/components/new-jobs";
import { useOnboardingRedirect } from "@/lib/hooks/use-onboarding-redirect";

export function meta({}: Route.MetaArgs) {
  return [{ title: "TalentHive — Freelance Marketplace" }, { name: "description", content: "Hire or get hired with escrow protection" }];
}

export default function Home() {
  useOnboardingRedirect();

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main>
        <Hero />
        <NewJobs />
      </main>
      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-zinc-500">
          <p className="font-semibold text-zinc-900">TalentHive</p>
          <p>Every milestone protected in Stripe escrow.</p>
        </div>
      </footer>
    </div>
  );
}
