import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { submitSavingsDeposit } from "../services/savings";
import { pushCustomerBookingNotification } from "../services/notificationsService";

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => submitSavingsDeposit(data),
    onSuccess: async (response, variables) => {
      const transactionId =
        response?.data?.id ??
        response?.id ??
        response?.data?.transaction_id ??
        response?.transaction_id ??
        null;
      const amount = Number(variables?.amount || 0);
      const amountLabel = Number.isFinite(amount)
        ? `₦${amount.toLocaleString("en-NG")}`
        : "your deposit";

      await pushCustomerBookingNotification({
        notificationId: transactionId ? `deposit-pending-${transactionId}` : undefined,
        type: "deposit_pending",
        entityId: transactionId,
        statusAtCreation: "pending",
        title: "Deposit Pending",
        message: `${amountLabel} cash deposit is pending owner approval.`,
      });

      queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
      queryClient.invalidateQueries({ queryKey: ["recent-savings"] });
      queryClient.invalidateQueries({ queryKey: ["savings-history"] });
      queryClient.invalidateQueries({ queryKey: ["savings-balance"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["customer-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["customer-notifications-unread"] });
    },
    onError: (error) => {
      toast.error(error.message || "Deposit failed");
    },
  });
};
