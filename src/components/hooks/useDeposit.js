import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { submitSavingsDeposit } from "../services/savings";

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => submitSavingsDeposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
      queryClient.invalidateQueries({ queryKey: ["recent-savings"] });
      queryClient.invalidateQueries({ queryKey: ["savings-history"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => {
      toast.error(error.message || "Deposit failed");
    },
  });
};
