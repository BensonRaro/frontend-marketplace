// Freelancer onboarding form — avatar, name, title, bio, skills, hourlyRate, location, website, portfolio
import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Briefcase, MapPin, Globe, DollarSign, Link2, X } from "lucide-react";
import { useCompleteFreelancerOnboarding, useOnboardingStatus } from "@/lib/hooks/use-onboarding";
import { UploadField } from "@/components/globals/upload/upload-field";

export function FreelancerOnboardingForm() {
  const nav = useNavigate();
  const { data: status } = useOnboardingStatus();
  const p = (status?.profile ?? {}) as { title?: string; bio?: string; skills?: string[]; hourlyRate?: number; location?: string; website?: string; portfolio?: string };
  const m = useCompleteFreelancerOnboarding();

  const [name, setName] = useState(status?.name ?? "");
  const [image, setImage] = useState(status?.image ?? "");
  const [title, setTitle] = useState(p.title ?? "");
  const [bio, setBio] = useState(p.bio ?? "");
  const [skills, setSkills] = useState<string[]>(p.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [hourlyRate, setHourlyRate] = useState(p.hourlyRate ? String(p.hourlyRate / 100) : "");
  const [location, setLocation] = useState(p.location ?? "");
  const [website, setWebsite] = useState(p.website ?? "");
  const [portfolio, setPortfolio] = useState(p.portfolio ?? "");

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v) || skills.length >= 10) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    m.mutate(
      { name, image: image || undefined, title, bio, skills, hourlyRate: Number(hourlyRate), location, website, portfolio },
      { onSuccess: () => nav("/") },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold tracking-widest text-zinc-500">PROFILE PHOTO</label>
        <UploadField endpoint="avatarUploader" onClientUploadComplete={(urls) => urls[0] && setImage(urls[0])} />
        {image ? (
          <div className="mt-3 flex items-center gap-3">
            <img src={image} alt="avatar" className="h-16 w-16 rounded-2xl object-cover border" />
            <span className="text-xs font-medium text-emerald-600">✓ Uploaded — will be saved</span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">Choose image above — button shows % progress. Or paste URL below.</p>
        )}
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://utfs.io/f/... or https://..." className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900 placeholder:text-zinc-400" />
        <p className="mt-1 text-xs text-zinc-400">If upload fails, paste URL manually</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">FULL NAME</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Alex Morgan" className="w-full rounded-xl border border-zinc-200 bg-[#fafaf8] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900 focus:bg-white" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">PROFESSIONAL TITLE</label>
          <div className="relative">
            <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Senior React Developer" className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900" />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">BIO</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows={3} placeholder="What do you do? Key achievements, tools you love…" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900" />
        <p className="mt-1 text-xs text-zinc-400">{bio.length}/800</p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">SKILLS ({skills.length}/10)</label>
        <div className="flex gap-2">
          <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="React, Node.js, Figma" className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900" />
          <button type="button" onClick={addSkill} className="cursor-pointer rounded-xl border bg-white px-4 text-sm font-medium hover:bg-zinc-50">Add</button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              {s} <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">HOURLY RATE (USD)</label>
          <div className="relative">
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required type="number" min={5} max={500} placeholder="45" className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">LOCATION</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote — Nairobi" className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">WEBSITE</label>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://your.site" className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">PORTFOLIO</label>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://portfolio.link" className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-zinc-900" />
          </div>
        </div>
      </div>

      <button disabled={m.isPending} className="cursor-pointer w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
        {m.isPending ? "Saving…" : "Complete setup →"}
      </button>
    </form>
  );
}
