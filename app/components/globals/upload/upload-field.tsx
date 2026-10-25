// Custom UploadThing dropzone — uses useUploadThing (no UploadButton/UploadDropzone), light-only Indigo+Amber
// Shows live progress + preview, works for avatar (single) and multi-file endpoints
import { useState, useRef, useCallback } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import type { UploadEndpoint } from "@/lib/uploadthing";
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  CheckCircle2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

export type UploadedFile = { url: string; name: string };

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|svg|bmp|ico)(\?|$)/i.test(url);
}

type Props = {
  endpoint: UploadEndpoint;
  accept?: string;
  hint?: string;
  onClientUploadComplete?: (urls: string[]) => void;
  onFilesComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (e: Error) => void;
};

export function UploadField({
  endpoint,
  accept,
  hint,
  onClientUploadComplete,
  onFilesComplete,
  onUploadError,
}: Props) {
  const isSingle = endpoint === "avatarUploader";
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadBegin: () => {
      console.log("[upload] begin", endpoint);
      setProgress(5);
    },
    onClientUploadComplete: (res) => {
      console.log("[upload] complete", res);
      const files: UploadedFile[] = res.map((file) => ({ url: file.ufsUrl, name: file.name }));
      const urls = files.map((f) => f.url);
      console.log("[upload] urls", urls);
      if (urls.length) {
        setPreviews(files);
        toast.success(
          urls.length === 1
            ? "File uploaded"
            : `${urls.length} files uploaded`,
        );
        onClientUploadComplete?.(urls);
        onFilesComplete?.(files);
      }
      setProgress(100);
      setTimeout(() => setProgress(0), 600);
    },
    onUploadError: (e) => {
      console.error("[upload] error", e);
      toast.error(e.message ?? "Upload failed");
      onUploadError?.(e as unknown as Error);
      setProgress(0);
    },
  });

  // Simulate progress when useUploadThing doesn't emit it (fallback)
  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      // local previews for instant feedback
      if (isSingle && files[0]) setPreviews([{ url: URL.createObjectURL(files[0]), name: files[0].name }]);
      else setPreviews(files.map((f) => ({ url: URL.createObjectURL(f), name: f.name })));

      // fake progress tick until real complete
      let p = 5;
      const id = setInterval(() => {
        p = Math.min(90, p + Math.random() * 12);
        setProgress(Math.round(p));
      }, 250);

      try {
        await startUpload(files);
      } finally {
        clearInterval(id);
      }
    },
    [startUpload, isSingle],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
    e.target.value = "";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 text-center transition ${isDragOver ? "bg-primary-soft border-primary" : "bg-white hover:bg-zinc-50"} ${isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? (isSingle ? "image/*" : undefined)}
          multiple={!isSingle}
          className="hidden"
          onChange={onInputChange}
          disabled={isUploading}
        />

        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ${isDragOver ? "bg-primary text-white" : "bg-primary-soft text-primary"}`}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isDragOver ? (
            <Upload className="h-5 w-5" />
          ) : (
            <ImageIcon className="h-5 w-5" />
          )}
        </span>

        <p className="mt-3 text-sm font-medium text-zinc-700">
          {isUploading
            ? `Uploading ${progress}%`
            : isDragOver
              ? "Drop to upload"
              : isSingle
                ? "Drop image or click to browse"
                : "Drop files or click to browse"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {hint ?? (isSingle
            ? "PNG, JPG up to 2MB — auto-upload"
            : "Images up to 8MB, PDFs up to 16MB")}
        </p>

        {isUploading ? (
          <div className="mt-4 w-full max-w-[280px]">
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs font-medium text-primary">{progress}%</p>
          </div>
        ) : null}
      </div>

      {/* Previews — images thumbnailed, other files as chips */}
      {previews.length ? (
        <div className="border-t bg-zinc-50 p-3">
          <div className="flex flex-wrap gap-3">
            {previews.map((file, i) => (
              <div key={file.url + i} className="relative">
                {isImageUrl(file.url) ? (
                  <img
                    src={file.url}
                    alt={file.name || `preview ${i + 1}`}
                    className="h-16 w-16 rounded-xl object-cover border bg-white"
                  />
                ) : (
                  <span className="flex h-16 max-w-[160px] items-center gap-1.5 rounded-xl border bg-white px-2.5 text-xs font-medium text-zinc-700">
                    <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                    <span className="truncate">{file.name || `file ${i + 1}`}</span>
                  </span>
                )}
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />{" "}
            {previews.length === 1
              ? "Uploaded — will be saved on Complete"
              : `${previews.length} files ready`}
          </p>
        </div>
      ) : null}
    </div>
  );
}

// Avatar helper — shows current avatar + upload field
export function AvatarUploadField({
  currentUrl,
  endpoint = "avatarUploader",
  onComplete,
}: {
  currentUrl?: string | null;
  endpoint?: UploadEndpoint;
  onComplete?: (url: string) => void;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-zinc-50">
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-6 w-6 text-zinc-400" />
        )}
      </div>
      <div className="flex-1">
        <UploadField
          endpoint={endpoint}
          onClientUploadComplete={(urls) => urls[0] && onComplete?.(urls[0])}
        />
        <p className="mt-2 text-xs text-zinc-500">
          PNG, JPG up to 2MB — square works best
        </p>
      </div>
    </div>
  );
}
