// Sheet primitive — right slide-over panel, hand-built, light-only (used for proposal details)
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Sheet({ open, onOpenChange, title, description, children }: Props) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => setShown(true));
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close panel" onClick={() => onOpenChange(false)} className="absolute inset-0 cursor-pointer bg-primary/10 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-zinc-100 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)] transition-transform duration-200 ease-out ${shown ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="border-b border-zinc-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="sheet-title" className="truncate text-lg font-semibold tracking-tight">
                {title}
              </h2>
              {description ? <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p> : null}
            </div>
            <button onClick={() => onOpenChange(false)} className="cursor-pointer grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-zinc-100 bg-white shadow-sm hover:bg-zinc-50">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
