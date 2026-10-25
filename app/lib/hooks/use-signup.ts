// useSignup — TanStack Query mutation for POST /api/auth/signup via Axios
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type SignupPayload = { name: string; email: string; password: string; role: "client" | "freelancer" };
type SignupRes = { user: { id: string; email: string; name: string; role: string } };

export function useSignup() {
  return useMutation<SignupRes, string, SignupPayload>({
    mutationFn: async (data) => {
      const res = await api.post<SignupRes>("/api/auth/signup", data);
      return res.data;
    },
    onSuccess: () => toast.success("Account created — check your email to verify"),
    onError: (e) => toast.error(getSignupError(e)),
  });
}

export function getSignupError(e: unknown): string {
  if (isAxiosError(e)) return (e.response?.data as { error?: { message?: string } })?.error?.message ?? e.message;
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
