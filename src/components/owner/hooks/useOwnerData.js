import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchOwnerAllBookings,
  fetchOwnerRecentCash,
  fetchOwnerSearchUsers,
  fetchOwnerStats,
  recordOwnerDeposit,
} from "../services/ownerApi";

export const useOwnerStats = () =>
  useQuery({
    queryKey: ["owner-stats"],
    queryFn: fetchOwnerStats,
  });

export const useOwnerRecentCash = () =>
  useQuery({
    queryKey: ["owner-recent-cash"],
    queryFn: fetchOwnerRecentCash,
  });

export const useOwnerAllBookings = () =>
  useQuery({
    queryKey: ["owner-all-bookings"],
    queryFn: fetchOwnerAllBookings,
  });

export const useOwnerSearchUsers = (searchTerm) =>
  useQuery({
    queryKey: ["owner-search-users", searchTerm],
    queryFn: () => fetchOwnerSearchUsers(searchTerm),
    enabled: !!searchTerm,
  });

export const useOwnerRecordDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordOwnerDeposit,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["owner-recent-cash"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-stats"] }),
      ]);
    },
  });
};
