// Pagination — reusable, light-only, shows page numbers + prev/next
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2));

  return (
    <div className="flex items-center justify-between gap-2 border-t border-zinc-100 bg-white px-4 py-3">
      <p className="text-xs text-zinc-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="cursor-pointer grid h-8 w-8 place-items-center rounded-xl border border-zinc-100 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`cursor-pointer h-8 min-w-8 rounded-xl px-2 text-xs font-medium ${p === page ? "bg-primary text-white" : "border border-zinc-100 bg-white text-zinc-600 hover:bg-zinc-50"}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="cursor-pointer grid h-8 w-8 place-items-center rounded-xl border border-zinc-100 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
