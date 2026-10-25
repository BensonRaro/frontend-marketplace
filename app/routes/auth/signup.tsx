// Signup page — Versa design adapted for freelance marketplace (split card)
import type { Route } from "./+types/signup";
import { SignupLeft } from "@/routes/auth/components/signup-left";
import { SignupForm } from "@/routes/auth/components/signup-form";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create account — TalentHive" }, { name: "description", content: "Create your TalentHive account" }];
}

export default function Signup() {
  return (
    <main className="min-h-screen bg-[#f0f2f3] px-4 py-8 lg:p-6">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <SignupLeft />
        <SignupForm />
      </div>
      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-zinc-400">© {new Date().getFullYear()} TalentHive — escrow-protected marketplace</p>
    </main>
  );
}
