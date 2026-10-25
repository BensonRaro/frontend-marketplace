// Left showcase panel — dark, stats + chart (Versa-inspired, adapted for freelance marketplace)
export function SignupLeft() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-[#0B0F1E] p-8 text-white lg:p-10">
      {/* indigo glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-primary/25 blur-[60px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
            <span className="grid grid-cols-2 gap-0.5">
              <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
              <span className="h-1.5 w-1.5 rounded-[1px] bg-white/70" />
              <span className="h-1.5 w-1.5 rounded-[1px] bg-white/70" />
              <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
            </span>
          </span>
          <span className="text-sm font-semibold tracking-tight">TalentHive</span>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[10px] font-semibold tracking-widest text-primary-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
          TRUSTED BY 50K+ FREELANCERS
        </div>

        <h1 className="mt-6 text-[34px] font-semibold leading-[0.95] tracking-tight">
          Your next gig,
          <br />
          <span className="font-serif italic font-normal text-accent">fully</span> in view.
        </h1>
        <p className="mt-3 max-w-[320px] text-sm leading-6 text-white/60">
          Real-time proposals, escrow protection, and talent matching built for modern clients & freelancers.
        </p>
      </div>

      <div className="relative mt-8">
        <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04] backdrop-blur">
          {[
            ["$2.4B", "Paid out"],
            ["98k", "Freelancers"],
            ["4.9★", "Rating"],
          ].map(([v, l]) => (
            <div key={v} className="px-4 py-4 text-center">
              <div className="text-sm font-semibold">{v}</div>
              <div className="text-[10px] tracking-wide text-white/50">{l}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="flex items-center justify-between text-[10px] tracking-widest text-white/40">
            <span>ESCROW VOLUME — 12 MONTHS</span>
            <span className="text-primary-muted">↑ +34.2%</span>
          </div>
          <div className="mt-3 flex h-[52px] items-end gap-[4px]">
            {[8, 12, 18, 14, 20, 16, 28, 22, 18, 24, 18, 32].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${[6, 11].includes(i) ? "bg-primary" : i === 5 ? "bg-primary-hover" : "bg-white/12"}`}
                style={{ height: `${h * 1.5}px` }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-white/25">
            <span>Jan</span>
            <span>Apr</span>
            <span>Jul</span>
            <span>Oct</span>
          </div>
        </div>
      </div>
    </div>
  );
}
