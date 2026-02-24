import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { verifySavings } from "../services/savings";

export const useVerifySavings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference) => verifySavings(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
      queryClient.invalidateQueries({ queryKey: ["recent-savings"] });
      queryClient.invalidateQueries({ queryKey: ["savings-history"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Payment verified successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify payment.");
    },
  });
};
