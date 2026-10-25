// ClientSettingsForm — edit name, avatar, company, bio, location, website (prefilled)
import { useState } from "react";
import { Building2, MapPin, Globe, User } from "lucide-react";
import { useUpdateClientProfile, type ClientProfilePayload } from "@/lib/hooks/use-settings";
import { UploadField } from "@/components/globals/upload/upload-field";

type Initial = ClientProfilePayload & { image?: string };

export function ClientSettingsForm({ initial }: { initial: Initial }) {
  const m = useUpdateClientProfile();
  const [name, setName] = useState(initial.name ?? "");
  const [image, setImage] = useState(initial.image ?? "");
  const [company, setCompany] = useState(initial.company ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [location, setLocation] = useState(initial.location ?? "");
  const [website, setWebsite] = useState(initial.website ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    m.mutate({ name, image: image || undefined, company, bio, location, website });
  };

  const input = "w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary";
  const withIcon = "w-full rounded-xl border border-zinc-100 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">PROFILE PHOTO</label>
        <div className="flex items-center gap-3">
          {image ? <img src={image} alt="avatar" className="h-14 w-14 rounded-2xl object-cover border border-zinc-100" /> : null}
          <div className="flex-1">
            <UploadField endpoint="avatarUploader" onClientUploadComplete={(urls) => urls[0] && setImage(urls[0])} />
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="…or paste image URL" className={`${input} mt-2`} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">FULL NAME</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Alex Morgan" className={withIcon} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">COMPANY</label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." className={withIcon} />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">ABOUT YOU / TEAM</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows={3} maxLength={500} className={input} />
        <p className="mt-1 text-right text-xs text-zinc-400">{bio.length}/500</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">LOCATION</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" className={withIcon} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">WEBSITE</label>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://acme.com" className={withIcon} />
          </div>
        </div>
      </div>
      <button disabled={m.isPending} className="cursor-pointer w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
        {m.isPending ? "Saving…" : "Save changes →"}
      </button>
    </form>
  );
}
