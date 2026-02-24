import { useQuery } from "@tanstack/react-query";
import { getSavingsHistory } from "../services/savings";

export const useSavingsHistory = (userId) => {
  return useQuery({
    queryKey: ["savings-history", userId ?? "self"],
    queryFn: () => getSavingsHistory(),
    enabled: userId === undefined || Boolean(userId),
  });
};
