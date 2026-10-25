// Dialog primitive — hand-built, light-only, Indigo, no library (used for Create Job)
import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, title, description, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close dialog" onClick={() => onOpenChange(false)} className="absolute inset-0 bg-primary/10 backdrop-blur-sm" />
      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
        {/* Header — now contains title + description */}
        <div className="border-b border-zinc-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="dialog-title" className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
              {description ? <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p> : null}
            </div>
            <button onClick={() => onOpenChange(false)} className="cursor-pointer grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-zinc-100 bg-white shadow-sm hover:bg-zinc-50">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
