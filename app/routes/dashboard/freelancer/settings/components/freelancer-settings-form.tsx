// FreelancerSettingsForm — edit profile details (prefilled); payouts stay in the card above
import { useState } from "react";
import { User, Briefcase, MapPin, Globe, DollarSign, Link2, X } from "lucide-react";
import { useUpdateFreelancerProfile, type FreelancerProfilePayload } from "@/lib/hooks/use-settings";
import { UploadField } from "@/components/globals/upload/upload-field";

type Initial = Omit<FreelancerProfilePayload, "hourlyRate"> & { image?: string; hourlyRateDollars: string };

export function FreelancerSettingsForm({ initial }: { initial: Initial }) {
  const m = useUpdateFreelancerProfile();
  const [name, setName] = useState(initial.name ?? "");
  const [image, setImage] = useState(initial.image ?? "");
  const [title, setTitle] = useState(initial.title ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [skills, setSkills] = useState<string[]>(initial.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [hourlyRate, setHourlyRate] = useState(initial.hourlyRateDollars);
  const [location, setLocation] = useState(initial.location ?? "");
  const [website, setWebsite] = useState(initial.website ?? "");
  const [portfolio, setPortfolio] = useState(initial.portfolio ?? "");

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v) || skills.length >= 10) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    m.mutate({ name, image: image || undefined, title, bio, skills, hourlyRate: Number(hourlyRate), location, website, portfolio });
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
          <div className="relative"><User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={name} onChange={(e) => setName(e.target.value)} required className={withIcon} /></div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">PROFESSIONAL TITLE</label>
          <div className="relative"><Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className={withIcon} /></div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">BIO</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows={3} maxLength={800} className={input} />
        <p className="mt-1 text-right text-xs text-zinc-400">{bio.length}/800</p>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">SKILLS ({skills.length}/10)</label>
        <div className="flex gap-2">
          <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="React, Node.js, Figma" className="flex-1 rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
          <button type="button" onClick={addSkill} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-4 text-sm font-medium hover:bg-zinc-50">Add</button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              {s} <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="cursor-pointer"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">HOURLY RATE (USD)</label>
          <div className="relative"><DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required type="number" min={5} max={500} className={withIcon} /></div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">LOCATION</label>
          <div className="relative"><MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={withIcon} /></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">WEBSITE</label>
          <div className="relative"><Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={website} onChange={(e) => setWebsite(e.target.value)} className={withIcon} /></div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">PORTFOLIO</label>
          <div className="relative"><Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className={withIcon} /></div>
        </div>
      </div>
      <button disabled={m.isPending} className="cursor-pointer w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
        {m.isPending ? "Saving…" : "Save changes →"}
      </button>
    </form>
  );
}
