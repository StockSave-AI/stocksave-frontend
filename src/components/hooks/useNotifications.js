import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerUnreadNotificationCount,
  getNotifications,
  markAllNotificationsRead,
} from "../services/notificationsService";

const CUSTOMER_NOTIFICATIONS_QUERY_KEY = ["customer-notifications"];

export function useNotifications() {
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: CUSTOMER_NOTIFICATIONS_QUERY_KEY,
    queryFn: getNotifications,
    staleTime: 30 * 1000,
  });

  const markAllRead = async () => {
    const updated = await markAllNotificationsRead();
    queryClient.setQueryData(CUSTOMER_NOTIFICATIONS_QUERY_KEY, updated);
    return updated;
  };

  return {
    notifications: notificationsQuery.data || [],
    loadMore: notificationsQuery.refetch,
    markAllRead,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
  };
}

export function useCustomerUnreadNotifications(enabled = true) {
  return useQuery({
    queryKey: ["customer-notifications-unread"],
    queryFn: getCustomerUnreadNotificationCount,
    enabled,
    staleTime: 30 * 1000,
  });
}
