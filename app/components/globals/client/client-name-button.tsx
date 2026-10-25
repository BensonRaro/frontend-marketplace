// ClientNameButton — client name that opens the client details sheet (job cards)
import { useState } from "react";
import { ClientProfileSheet } from "./client-profile-sheet";

export function ClientNameButton({ clientId, name, className = "" }: { clientId?: string | null; name?: string | null; className?: string }) {
  const [open, setOpen] = useState(false);

  if (!clientId) return <span className={className}>{name ?? "client"}</span>;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${name ?? "client"} details`}
        className={`cursor-pointer font-medium text-primary hover:underline ${className}`}
      >
        {name ?? "client"}
      </button>
      <ClientProfileSheet clientId={clientId} open={open} onOpenChange={setOpen} />
    </>
  );
}
