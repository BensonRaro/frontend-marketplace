// useJobs — create + list jobs (client)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { Milestone, MilestoneDraft, RatingSummary } from "@/types";

export type JobPosting = {
  id: string;
  title: string;
  description: string;
  budgetType: "fixed" | "hourly";
  budget: number;
  skills: string[];
  categoryId?: string | null;
  isOpen: boolean;
  createdAt: string;
  milestones?: Milestone[];
  escrowStatus?: string;
  fundedAt?: string | null;
};

// Funded = whole-job escrow locked OR at least one funded milestone (mirrors backend rule)
export function isJobFunded(job: { escrowStatus?: string | null; milestones?: { status: string }[] | null }) {
  return job.escrowStatus === "funded" || (job.milestones ?? []).some((m) => m.status !== "unfunded");
}

export type JobProposal = {
  id: string;
  coverLetter: string;
  bidAmount: number;
  duration?: number | null;
  status: string;
  freelancerId: string;
  freelancerRating?: RatingSummary;
  createdAt?: string;
  freelancer?: {
    id: string;
    name: string | null;
    image: string | null;
    freelancerProfile?: {
      title: string | null;
      bio: string | null;
      skills: string[];
      hourlyRate: number | null;
      location: string | null;
      website: string | null;
    } | null;
  } | null;
};

export type JobDetail = JobPosting & {
  category?: { name: string } | null;
  client?: { id: string; name: string | null; image: string | null } | null;
  contract?: { id: string } | null;
  _count?: { proposals: number };
  proposals?: JobProposal[];
};

export type CreateJobPayload = {
  title: string;
  description: string;
  budgetType: "fixed" | "hourly";
  budget: number;
  skills: string[];
  categoryId?: string;
  milestones?: MilestoneDraft[];
};

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation<{ data: JobPosting }, string, CreateJobPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<{ data: JobPosting }>("/api/job-postings", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job posted — freelancers can now propose");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export type JobsQuery = { search?: string; category?: string; skill?: string; budgetType?: string; minBudget?: number; maxBudget?: number; page?: number; limit?: number };
export type PaginatedJobs = { data: (JobPosting & { category?: { name: string } | null; client?: { id: string; name: string | null; image: string | null } | null; clientRating?: RatingSummary; _count?: { proposals: number } })[]; pagination: { page: number; limit: number; total: number; totalPages: number } };

export function useClientJobs(query: JobsQuery = {}) {
  return useQuery<PaginatedJobs>({
    queryKey: ["client-jobs", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.category) params.set("category", query.category);
      if (query.skill) params.set("skill", query.skill);
      if (query.budgetType) params.set("budgetType", query.budgetType);
      if (query.page) params.set("page", String(query.page));
      if (query.limit) params.set("limit", String(query.limit));
      const qs = params.toString();
      const { data } = await api.get<PaginatedJobs>(`/api/job-postings/client/mine${qs ? `?${qs}` : ""}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useJobs(query: JobsQuery = {}) {
  return useQuery<PaginatedJobs>({
    queryKey: ["jobs", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.category) params.set("category", query.category);
      if (query.skill) params.set("skill", query.skill);
      if (query.budgetType) params.set("budgetType", query.budgetType);
      if (query.minBudget != null) params.set("minBudget", String(query.minBudget));
      if (query.maxBudget != null) params.set("maxBudget", String(query.maxBudget));
      if (query.page) params.set("page", String(query.page));
      if (query.limit) params.set("limit", String(query.limit));
      const qs = params.toString();
      const { data } = await api.get<PaginatedJobs>(`/api/job-postings${qs ? `?${qs}` : ""}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useJob(id: string) {
  return useQuery<{ data: JobDetail }>({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await api.get<{ data: JobDetail }>(`/api/job-postings/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation<{ data: JobPosting }, string, { id: string; payload: Partial<CreateJobPayload & { isOpen?: boolean }> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.patch<{ data: JobPosting }>(`/api/job-postings/${id}`, payload);
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["client-jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["job", id] });
      toast.success("Job updated");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation<{ data: { id: string } }, string, string>({
    mutationFn: async (id) => {
      const { data } = await api.delete<{ data: { id: string } }>(`/api/job-postings/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job deleted");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function getJobError(e: unknown): string {
  if (isAxiosError(e)) return (e.response?.data as { error?: { message?: string } })?.error?.message ?? e.message;
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
