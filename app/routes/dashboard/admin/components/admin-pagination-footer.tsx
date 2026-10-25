// AdminPaginationFooter — page X of Y with prev/next, shared by admin tables
type Props = { page: number; totalPages: number; onPage: (page: number) => void; unit?: string };

export function AdminPaginationFooter({ page, totalPages, onPage, unit = "Page" }: Props) {
  return (
    <div className="flex items-center justify-between text-xs text-zinc-500">
      <span>
        {unit} {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-3 py-1.5 font-medium shadow-sm hover:bg-zinc-50 disabled:opacity-40">
          Previous
        </button>
        <button disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-3 py-1.5 font-medium shadow-sm hover:bg-zinc-50 disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  );
}
