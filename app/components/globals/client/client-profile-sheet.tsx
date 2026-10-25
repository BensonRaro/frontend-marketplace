// ClientProfileSheet — slide-over client details, opened from a job card's client name
import { Sheet } from "@/components/ui/sheet";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { ClientProfileBody } from "./client-profile-body";

type Props = { clientId?: string | null; open: boolean; onOpenChange: (open: boolean) => void };

export function ClientProfileSheet({ clientId, open, onOpenChange }: Props) {
  // Only fetch while the sheet is open — keeps closed cards free of requests
  const { data, isLoading, isError } = useUserProfile(open && clientId ? clientId : undefined);
  const profile = data?.data;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={profile?.name ?? "Client"}
      description={profile?.clientProfile?.company ?? "Hiring on TalentHive"}
    >
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-zinc-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-zinc-50" />
          <div className="h-32 animate-pulse rounded-2xl bg-zinc-50" />
        </div>
      ) : isError || !profile ? (
        <p className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-10 text-center text-sm text-red-500">Couldn't load client details.</p>
      ) : (
        <ClientProfileBody profile={profile} />
      )}
    </Sheet>
  );
}
