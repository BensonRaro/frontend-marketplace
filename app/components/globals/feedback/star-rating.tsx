// StarRating — amber stars display + input (hiring surfaces + job cards)
import { Star } from "lucide-react";

// Read-only reputation (average + review count, or unrated state)
export function Stars({ value, count, size = 14 }: { value: number | null | undefined; count?: number; size?: number }) {
  if (value == null) return <span className="text-xs text-zinc-400">No ratings yet</span>;
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} style={{ width: size, height: size }} className={i <= full ? "fill-accent text-accent" : "fill-zinc-100 text-zinc-200"} />
        ))}
      </span>
      <span className="text-xs font-semibold">{value.toFixed(1)}</span>
      {count !== undefined ? <span className="text-xs text-zinc-400">({count})</span> : null}
    </span>
  );
}

// Tap-to-rate input for the post-completion review form
export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <span className="inline-flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} aria-label={`${i} star${i > 1 ? "s" : ""}`} className="cursor-pointer">
          <Star className={`h-6 w-6 ${i <= value ? "fill-accent text-accent" : "fill-zinc-100 text-zinc-300 hover:fill-accent-muted"}`} />
        </button>
      ))}
    </span>
  );
}
