// CreateJobDialog — button opens Dialog, while /dashboard/client/jobs/new remains a full page
import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { JobForm } from "./job-form";

type Props = {
  triggerLabel?: string;
  triggerClassName?: string;
};

export function CreateJobDialog({ triggerLabel = "New Job", triggerClassName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={triggerClassName ?? "cursor-pointer inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"}>
        <Plus className="h-4 w-4" /> {triggerLabel}
      </button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Create a new job"
        description="Title, category, description, budget and skills — freelancers will start proposing with escrow protection."
      >
        <JobForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
