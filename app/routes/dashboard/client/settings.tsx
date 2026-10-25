// Client Settings — edit profile details (prefilled from onboarding status)
import { useOnboardingStatus } from "@/lib/hooks/use-onboarding";
import { ClientSettingsForm } from "./settings/components/client-settings-form";
import type { Route } from "./+types/settings";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Settings — TalentHive" }];
}

export default function ClientSettings() {
  const { data: status, isLoading, isError } = useOnboardingStatus();
  const profile = (status?.profile ?? {}) as { company?: string; bio?: string; location?: string; website?: string };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500">Update how clients see you — changes go live instantly.</p>
      </div>
      <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-zinc-50" />
        ) : isError || !status ? (
          <p className="text-sm text-zinc-500">Failed to load your profile — please try again later.</p>
        ) : (
          <ClientSettingsForm
            key={status.id}
            initial={{ name: status.name ?? "", image: status.image ?? "", company: profile.company ?? "", bio: profile.bio ?? "", location: profile.location ?? "", website: profile.website ?? "" }}
          />
        )}
      </div>
    </div>
  );
}
