import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOwnerSettings } from "../../services/auth";

export const useUpdateOwnerSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => updateOwnerSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
      queryClient.invalidateQueries({ queryKey: ["owner-stats"] });
    },
  });
};
