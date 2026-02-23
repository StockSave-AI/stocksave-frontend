import { useQuery } from "@tanstack/react-query";
import { getCustomerSummary } from "../services/customer";

export const useCustomerSummary = () => {
  return useQuery({
    queryKey: ["customer-summary"],
    queryFn: () => getCustomerSummary(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
