import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCustomerNotification,
  fetchCustomerNotifications,
  fetchCustomerStockAlerts,
  markAllCustomerNotificationsRead,
  markCustomerNotificationRead,
} from "../services/customerNotificationsApi";

export const useCustomerNotifications = (params = {}) =>
  useQuery({
    queryKey: ["customer-notifications", params],
    queryFn: () => fetchCustomerNotifications(params),
    staleTime: 30 * 1000,
  });

export const useCustomerStockAlerts = (params = {}) =>
  useQuery({
    queryKey: ["customer-notifications-stock-alerts", params],
    queryFn: () => fetchCustomerStockAlerts(params),
    staleTime: 30 * 1000,
  });

export const useMarkAllCustomerNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllCustomerNotificationsRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer-notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-notifications-unread"] }),
      ]);
    },
  });
};

export const useMarkCustomerNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markCustomerNotificationRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer-notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-notifications-unread"] }),
      ]);
    },
  });
};

export const useDeleteCustomerNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomerNotification,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer-notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-notifications-unread"] }),
      ]);
    },
  });
};

export function useCustomerUnreadNotifications(enabled = true) {
  return useQuery({
    queryKey: ["customer-notifications-unread"],
    queryFn: async () => {
      const payload = await fetchCustomerNotifications({
        unread: true,
        page: 1,
        limit: 1,
      });
      const stats = payload?.stats || payload?.data?.stats || {};
      return Number(stats?.unread || 0);
    },
    enabled,
    staleTime: 30 * 1000,
  });
}
