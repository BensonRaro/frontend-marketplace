// useNotifications — inbox list + unread badge + mark-read (server state via Query)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Notification } from "@/types";

export function useNotifications(limit = 20) {
  return useQuery<{ data: Notification[] }>({
    queryKey: ["notifications", limit],
    queryFn: async () => {
      const { data } = await api.get<{ data: Notification[] }>(`/api/notifications?limit=${limit}`);
      return data;
    },
    refetchInterval: 60_000, // SSE invalidates live; polling covers missed streams
  });
}

export function useUnreadCount() {
  return useQuery<{ data: { count: number } }>({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      const { data } = await api.get<{ data: { count: number } }>("/api/notifications/unread-count");
      return data;
    },
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation<{ data: Notification }, unknown, string>({
    mutationFn: async (id) => {
      const { data } = await api.patch<{ data: Notification }>(`/api/notifications/${id}/read`);
      return data;
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation<{ data: { count: number } }, unknown, void>({
    mutationFn: async () => {
      const { data } = await api.post<{ data: { count: number } }>("/api/notifications/read-all");
      return data;
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}
