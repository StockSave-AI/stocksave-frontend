import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  approveCashDeposit,
  generateCashApprovalCode,
  getSavingsBanks,
  getSavingsRedeem,
  submitSavingsDeposit,
  updateSavingsStatus,
} from "../services/savings";

const invalidateSavingsQueries = (
  queryClient,
  { includeOwnerRecentCash = true } = {},
) => {
  const queries = [
    queryClient.invalidateQueries({ queryKey: ["customer-summary"] }),
    queryClient.invalidateQueries({ queryKey: ["recent-savings"] }),
    queryClient.invalidateQueries({ queryKey: ["savings-history"] }),
    queryClient.invalidateQueries({ queryKey: ["plans"] }),
    queryClient.invalidateQueries({ queryKey: ["owner-stats"] }),
    queryClient.invalidateQueries({ queryKey: ["customer-notifications"] }),
    queryClient.invalidateQueries({ queryKey: ["customer-notifications-unread"] }),
  ];

  if (includeOwnerRecentCash) {
    queries.push(queryClient.invalidateQueries({ queryKey: ["owner-recent-cash"] }));
  }

  return Promise.all(queries);
};

export const useSavingsDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => submitSavingsDeposit(payload),
    onSuccess: () => invalidateSavingsQueries(queryClient),
    onError: (error) => {
      toast.error(error.message || "Failed to submit savings deposit.");
    },
  });
};

export const useSavingsStatusUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateSavingsStatus(payload),
    onSuccess: async (_data, variables) => {
      const targetId = Number(variables?.transactionId ?? variables?.depositId);
      const nextStatus = variables?.status ?? variables?.nextStatus ?? "Completed";

      queryClient.setQueryData(["owner-recent-cash"], (previous) => {
        const source = previous?.data ?? previous;
        if (!Array.isArray(source)) return previous;
        const updated = source.map((item) =>
          Number(item?.id) === targetId ? { ...item, status: nextStatus } : item,
        );
        return previous?.data ? { ...previous, data: updated } : updated;
      });

      queryClient.setQueriesData({ queryKey: ["owner-users"] }, (previous) => {
        if (!Array.isArray(previous)) return previous;
        return previous.map((user) => {
          const transactions = Array.isArray(user?.transactions)
            ? user.transactions.map((tx) =>
                Number(tx?.id) === targetId ? { ...tx, status: nextStatus } : tx,
              )
            : [];
          const latest = transactions[0];
          return {
            ...user,
            transactions,
            status: latest?.status || user?.status,
          };
        });
      });

      const skipRecentCashInvalidation = Boolean(variables?.skipRecentCashInvalidation);
      await invalidateSavingsQueries(queryClient, {
        includeOwnerRecentCash: !skipRecentCashInvalidation,
      });
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["owner-stats"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["customer-summary"], type: "active" }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update transaction status.");
    },
  });
};

export const useGenerateCashCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => generateCashApprovalCode(payload),
    onSuccess: () => invalidateSavingsQueries(queryClient),
    onError: (error) => {
      toast.error(error.message || "Failed to generate approval code.");
    },
  });
};

export const useApproveCashDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => approveCashDeposit(payload),
    onSuccess: () => invalidateSavingsQueries(queryClient),
    onError: (error) => {
      toast.error(error.message || "Failed to approve cash deposit.");
    },
  });
};

export const useSavingsBanks = () => {
  return useQuery({
    queryKey: ["savings-banks"],
    queryFn: getSavingsBanks,
  });
};

export const useSavingsRedeem = () => {
  return useQuery({
    queryKey: ["savings-redeem"],
    queryFn: getSavingsRedeem,
  });
};
