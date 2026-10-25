//useVerifyEmail + useResendVerification — TanStack Query hooks for email verification (Resend)
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export function useVerifyEmail(token: string | null) {
  return useQuery({
    queryKey: ["verify-email", token],
    enabled: !!token,
    retry: false,
    queryFn: async () => {
      const { data } = await api.get<{ message: string; email?: string }>(`/api/auth/verify-email?token=${encodeURIComponent(token!)}`);
      return data;
    },
  });
}

export function useResendVerification() {
  return useMutation<{ message: string }, string, { email: string }>({
    mutationFn: async ({ email }) => {
      const { data } = await api.post<{ message: string }>("/api/auth/resend-verification", { email });
      return data;
    },
    onSuccess: (d) => toast.success(d.message),
    onError: (e) => toast.error(getVerifyError(e)),
  });
}

export function getVerifyError(e: unknown): string {
  if (isAxiosError(e)) return (e.response?.data as { error?: { message?: string } })?.error?.message ?? e.message;
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
