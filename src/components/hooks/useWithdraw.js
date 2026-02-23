import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { submitWithdrawal } from "../services/savings";

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => submitWithdrawal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
      queryClient.invalidateQueries({ queryKey: ["recent-savings"] });
      queryClient.invalidateQueries({ queryKey: ["savings-history"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => {
      toast.error(error.message || "Withdrawal request failed");
    },
  });
};
