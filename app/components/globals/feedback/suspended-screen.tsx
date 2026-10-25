// SuspendedScreen — shown to banned accounts: the reason, what it means, and a way out
import { ShieldOff } from "lucide-react";

type Props = {
  reason: string | null;
  onSignOut: () => void;
};

export function SuspendedScreen({ reason, onSignOut }: Props) {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <ShieldOff className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-lg font-semibold tracking-tight">Your account is suspended</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          An administrator has suspended this account. Posting, bidding, messaging and payments are disabled until it is restored.
        </p>

        {reason ? (
          <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-500">Reason</p>
            <p className="mt-1 text-sm leading-6 text-rose-800">{reason}</p>
          </div>
        ) : null}

        <p className="mt-5 text-xs leading-5 text-zinc-400">
          If you believe this is a mistake, contact support and include the reason shown above.
        </p>

        <button
          type="button"
          onClick={onSignOut}
          className="mt-6 w-full cursor-pointer rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
