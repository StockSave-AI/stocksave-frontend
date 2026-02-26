import { useQuery } from "@tanstack/react-query";
import { getSavingsBalance } from "../services/savings";

export const useSavingsBalance = () =>
  useQuery({
    queryKey: ["savings-balance"],
    queryFn: getSavingsBalance,
  });

export default useSavingsBalance;
