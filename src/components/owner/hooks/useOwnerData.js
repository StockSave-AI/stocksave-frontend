import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  fetchOwnerAllBookings,
  fetchOwnerRecentCash,
  fetchOwnerStats,
  fetchOwnerUsers,
  fetchOwnerUserDetails,
  fetchOwnerSearchUsers,
  fetchOwnerTransactions,
  fetchOwnerWithdrawals,
  completeOwnerWithdrawal,
  recordOwnerDeposit,
} from "../services/ownerApi";
import { updateBookingStatus } from "../../services/inventory";

export const useOwnerStats = () =>
  useQuery({
    queryKey: ["owner-stats"],
    queryFn: fetchOwnerStats,
  });

export const useOwnerRecentCash = (params = {}) =>
  useQuery({
    queryKey: ["owner-recent-cash", params],
    queryFn: () => fetchOwnerRecentCash(params),
  });

export const useOwnerAllBookings = () =>
  useQuery({
    queryKey: ["owner-all-bookings"],
    queryFn: fetchOwnerAllBookings,
  });

export const useOwnerUsers = (params = {}) =>
  useQuery({
    queryKey: ["owner-users", params],
    queryFn: () => fetchOwnerUsers(params),
  });

export const useOwnerSearchUsers = (params = {}) =>
  useQuery({
    queryKey: ["owner-search-users", params],
    queryFn: () => fetchOwnerSearchUsers(params),
    enabled: Boolean(params?.q),
  });

export const useOwnerUserDetail = (id, enabled = true) =>
  useQuery({
    queryKey: ["owner-user-detail", id],
    queryFn: () => fetchOwnerUserDetails(id),
    enabled: enabled && !!id,
  });

export const useOwnerTransactions = (params = {}) =>
  useQuery({
    queryKey: ["owner-transactions", params],
    queryFn: () => fetchOwnerTransactions(params),
  });

export const useOwnerRecordDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordOwnerDeposit,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["owner-recent-cash"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-users"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-balance"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-savings"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-history"] }),
      ]);
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["owner-all-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-balance"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-savings"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-history"] }),
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-notifications-unread"] }),
      ]);
    },
  });
};

export const useOwnerWithdrawals = (params = {}) =>
  useQuery({
    queryKey: ["owner-withdrawals", params],
    queryFn: () => fetchOwnerWithdrawals(params),
  });

export const useCompleteOwnerWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeOwnerWithdrawal,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["owner-withdrawals"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-history"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-savings"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-balance"] }),
      ]);
      toast.success("Withdrawal marked as completed");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to complete withdrawal");
    },
  });
};
