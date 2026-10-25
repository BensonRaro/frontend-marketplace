// useSignout — Auth.js signout (POST /api/auth/signout with csrf) + clear session
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export function useSignout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<{ csrfToken: string }>("/api/auth/csrf");
      // Use fetch with manual redirect to avoid XHR auto-follow to frontend HTML (which can appear as error)
      const res = await fetch(`${api.defaults.baseURL}/api/auth/signout`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ csrfToken: data.csrfToken }),
        credentials: "include",
        redirect: "manual",
      });
      // 302 to FRONTEND_URL is success — backend has cleared cookie
      if (res.type === "opaqueredirect" || (res.status >= 200 && res.status < 400)) return;
      // Fallback: also try via api for non-redirect cases
      if (!res.ok && res.status !== 302) throw new Error(`Signout failed: ${res.status}`);
    },
    onSuccess: async () => {
      qc.setQueryData(["session"], null);
      await qc.invalidateQueries({ queryKey: ["session"] });
      // Ensure header updates instantly even before refetch
      qc.setQueryData(["session"], null);
      toast.success("Signed out successfully");
    },
    onError: async (e) => {
      console.error("signout error", e);
      // Backend may have cleared cookie even if fetch threw (e.g., opaque redirect) — still clear local state
      qc.setQueryData(["session"], null);
      await qc.invalidateQueries({ queryKey: ["session"] });
      qc.setQueryData(["session"], null);
      // After refetch, if session is actually null, show success, else error
      try {
        const { data } = await api.get("/api/auth/session");
        if (!data) toast.success("Signed out successfully");
        else toast.error("Failed to sign out");
      } catch {
        toast.error("Failed to sign out");
      }
    },
  });
}
