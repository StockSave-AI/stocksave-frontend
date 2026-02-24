import { useQuery } from "@tanstack/react-query";
import { getRecentSavings } from "../services/savings";

export const useRecentSavings = () => {
  return useQuery({
    queryKey: ["recent-savings"],
    queryFn: getRecentSavings,
  });
};
