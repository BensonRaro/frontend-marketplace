// useSignin — TanStack Query mutation for Auth.js Credentials via Axios
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type SigninPayload = { email: string; password: string };
type Session = { user: { id: string; email: string; name: string; role: string; image: string | null } };

export function useSignin() {
  const qc = useQueryClient();
  return useMutation<Session, string, SigninPayload>({
    mutationFn: async ({ email, password }) => {
      const { data: csrfData } = await api.get<{ csrfToken: string }>("/api/auth/csrf");
      const body = new URLSearchParams({ csrfToken: csrfData.csrfToken, email, password });

      // Auth.js on Express issues a 302 to FRONTEND_URL (cross-origin) on success.
      // In the browser Axios/XHR follows the redirect automatically — the 302 itself
      // triggers a CORS Network Error even though Set-Cookie was already applied.
      // So we swallow Network/CORS errors here and rely on the session check below.
      try {
        const resp = await api.post("/api/auth/callback/credentials", body, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          maxRedirects: 0,
          validateStatus: (s) => s >= 200 && s < 400,
        });
        // Node-like environments may expose the redirect location without following it
        const loc = (resp.headers?.location as string | undefined) ?? (resp.headers?.Location as string | undefined) ?? "";
        if (loc.includes("EMAIL_NOT_VERIFIED")) throw new Error("Please verify your email — check your inbox (link valid 24h)");
        const respUrl = (resp.data as { url?: string })?.url ?? "";
        if (respUrl.includes("EMAIL_NOT_VERIFIED")) throw new Error("Please verify your email — check your inbox (link valid 24h)");
      } catch (e) {
        if (isAxiosError(e)) {
          const loc = (e.response?.headers?.location as string | undefined) ?? (e.response?.headers?.Location as string | undefined) ?? "";
          const bodyUrl = (e.response?.data as { url?: string })?.url ?? "";
          if (loc.includes("EMAIL_NOT_VERIFIED") || bodyUrl.includes("EMAIL_NOT_VERIFIED")) {
            throw new Error("Please verify your email — check your inbox (link valid 24h)");
          }
          // Swallow CORS/Network errors from the cross-origin 302 — session check below decides success
          const isNetwork = e.message === "Network Error" || e.code === "ERR_NETWORK" || !e.response;
          if (isNetwork) {
            // fall through to session check
          } else if (e.response?.status && e.response.status >= 400 && e.response.status < 500) {
            // credential failure — also fall through to session check for precise message
          } else {
            throw e;
          }
        } else {
          throw e;
        }
      }

      const { data: session } = await api.get<Session | null>("/api/auth/session");
      if (session?.user) return session;
      throw new Error("Invalid email or password — or please verify your email (check inbox)");
    },
    onSuccess: (data) => {
      qc.setQueryData(["session"], data);
      qc.invalidateQueries({ queryKey: ["session"] });
      toast.success(`Welcome back, ${data.user.name ?? data.user.email}!`);
    },
    onError: (err) => toast.error(getSigninError(err)),
  });
}

export function getSigninError(e: unknown): string {
  if (isAxiosError(e)) {
    const msg = (e.response?.data as { error?: { message?: string } })?.error?.message ?? e.message;
    if (msg === "Network Error" || e.code === "ERR_NETWORK") return "Something went wrong — please try again";
    return msg;
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
