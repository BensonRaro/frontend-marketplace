// MessageComposer — chat input with file attach (messageUploader) + send
import { useRef, useState } from "react";
import { Paperclip, SendHorizontal, X, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useSendMessage } from "@/lib/hooks/use-messages";

export function MessageComposer({ contractId }: { contractId: string }) {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const send = useSendMessage(contractId);
  const { startUpload, isUploading } = useUploadThing("messageUploader", {
    onClientUploadComplete: (res) => {
      const urls = res.map((f) => f.ufsUrl);
      setFiles((prev) => [...prev, ...urls].slice(0, 5));
      toast.success(urls.length === 1 ? "File attached" : `${urls.length} files attached`);
    },
    onUploadError: (e) => {
      toast.error(e.message ?? "Upload failed");
    },
  });

  const ready = body.trim().length > 0 || files.length > 0;
  const busy = send.isPending || isUploading;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || busy) return;
    send.mutate({ body: body.trim(), attachments: files }, { onSuccess: () => { setBody(""); setFiles([]); } });
  };

  const attach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (!picked.length) return;
    if (files.length + picked.length > 5) {
      toast.error("Max 5 files per message");
      return;
    }
    void startUpload(picked);
  };

  return (
    <form onSubmit={submit} className="border-t border-zinc-100 px-4 py-3">
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {files.map((u) => (
            <span key={u} className="flex items-center gap-1.5 rounded-lg border border-zinc-100 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700">
              <FileText className="h-3 w-3 text-zinc-400" />
              <span className="max-w-[120px] truncate">{u.split("/").pop() ?? "file"}</span>
              <button type="button" onClick={() => setFiles(files.filter((x) => x !== u))} className="cursor-pointer"><X className="h-3 w-3 text-zinc-400 hover:text-zinc-700" /></button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input ref={inputRef} type="file" multiple accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.zip" className="hidden" onChange={attach} />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading} aria-label="Attach file" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-zinc-100 bg-white shadow-sm hover:bg-zinc-50 disabled:opacity-60">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin text-zinc-500" /> : <Paperclip className="h-4 w-4 text-zinc-600" />}
        </button>
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message…" maxLength={2000} className="min-w-0 flex-1 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:bg-white" />
        <button type="submit" disabled={!ready || busy} aria-label="Send message" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl bg-primary text-white shadow-sm hover:bg-primary-hover disabled:opacity-50">
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
