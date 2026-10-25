// Auth error page — displays Auth.js error (e.g. Configuration, OAuthCallback) and links back
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/error";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Authentication error — TalentHive" }];
}

const messages: Record<string, string> = {
  Configuration: "There was a problem with the server configuration. Check that Google OAuth is set up correctly.",
  AccessDenied: "Access denied. You did not grant the required permissions.",
  Verification: "The verification link is invalid or has expired.",
  Default: "An unexpected authentication error occurred. Please try again.",
};

export default function AuthError() {
  const [params] = useSearchParams();
  const err = params.get("error") ?? "Default";
  const msg = messages[err] ?? messages.Default;

  return (
    <main className="grid min-h-screen place-items-center bg-[#f0f2f3] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">!</div>
        <h1 className="mt-4 text-xl font-semibold">Authentication error</h1>
        <p className="mt-2 text-sm text-zinc-500">{msg}</p>
        <p className="mt-1 text-xs text-zinc-400">Code: {err}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">
            Back to sign in
          </Link>
          <Link to="/" className="cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
