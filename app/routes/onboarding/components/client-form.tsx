// Client onboarding form — avatar, name, company, bio, location, website
import { useState } from "react";
import { useNavigate } from "react-router";
import { Building2, MapPin, Globe, User } from "lucide-react";
import {
  useCompleteClientOnboarding,
  useOnboardingStatus,
} from "@/lib/hooks/use-onboarding";
import { UploadField } from "@/components/globals/upload/upload-field";

export function ClientOnboardingForm() {
  const nav = useNavigate();
  const { data: status } = useOnboardingStatus();
  const m = useCompleteClientOnboarding();

  const [name, setName] = useState(status?.name ?? "");
  const [image, setImage] = useState(status?.image ?? "");
  const [company, setCompany] = useState(
    (status?.profile as { company?: string })?.company ?? "",
  );
  const [bio, setBio] = useState(
    (status?.profile as { bio?: string })?.bio ?? "",
  );
  const [location, setLocation] = useState(
    (status?.profile as { location?: string })?.location ?? "",
  );
  const [website, setWebsite] = useState(
    (status?.profile as { website?: string })?.website ?? "",
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    m.mutate(
      { name, image: image || undefined, company, bio, location, website },
      { onSuccess: () => nav("/") },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold tracking-widest text-zinc-500">
          PROFILE PHOTO
        </label>
        <UploadField
          endpoint="avatarUploader"
          onClientUploadComplete={(urls) => urls[0] && setImage(urls[0])}
        />
        {image ? (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={image}
              alt="avatar"
              className="h-16 w-16 rounded-2xl object-cover border"
            />
            <span className="text-xs font-medium text-emerald-600">
              ✓ Uploaded — will be saved on Complete
            </span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">
            Choose image above. Or paste URL below.
          </p>
        )}
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900 placeholder:text-zinc-400"
        />
        <p className="mt-1 text-xs text-zinc-400">
          You can paste image URL manually
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">
          FULL NAME
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Alex Morgan"
            className="w-full rounded-xl border border-zinc-200 bg-[#fafaf8] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900 focus:bg-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">
          COMPANY (OPTIONAL)
        </label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">
          ABOUT YOU / TEAM
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          rows={3}
          placeholder="What do you build? Who do you hire?"
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900"
        />
        <p className="mt-1 text-xs text-zinc-400">{bio.length}/500</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">
            LOCATION
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">
            WEBSITE
          </label>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://acme.com"
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900"
            />
          </div>
        </div>
      </div>

      <button
        disabled={m.isPending}
        className="cursor-pointer w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {m.isPending ? "Saving…" : "Complete setup →"}
      </button>
    </form>
  );
}
