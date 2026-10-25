// AdminSettingsForm — admin account basics (name + avatar)
import { useState } from "react";
import { User } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { useUpdateMyProfile } from "@/lib/hooks/use-admin-actions";
import { UploadField } from "@/components/globals/upload/upload-field";

export function AdminSettingsForm() {
  const { data: session } = useSession();
  const m = useUpdateMyProfile();
  const [name, setName] = useState(session?.user.name ?? "");
  const [image, setImage] = useState(session?.user.image ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    m.mutate({ name, image: image || undefined });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">PROFILE PHOTO</label>
        <div className="flex items-center gap-3">
          {image ? <img src={image} alt="avatar" className="h-14 w-14 rounded-2xl border border-zinc-100 object-cover" /> : null}
          <div className="flex-1">
            <UploadField endpoint="avatarUploader" onClientUploadComplete={(urls) => urls[0] && setImage(urls[0])} />
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="…or paste image URL" className="mt-2 w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900" />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">FULL NAME</label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Admin" className="w-full rounded-xl border border-zinc-100 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900" />
        </div>
        <p className="mt-1 text-xs text-zinc-400">Your email and role are managed by the platform — they can’t be edited here.</p>
      </div>

      <button disabled={m.isPending} className="cursor-pointer w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60">
        {m.isPending ? "Saving…" : "Save changes →"}
      </button>
    </form>
  );
}
