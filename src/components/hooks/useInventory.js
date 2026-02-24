import { useQuery } from "@tanstack/react-query";
import { getFoodItems, getMyBookings, getStockBoardData } from "../services/customer";

export const useStockBoardData = () =>
  useQuery({
    queryKey: ["stock-board"],
    queryFn: getStockBoardData,
  });

export const useFoodItems = () =>
  useQuery({
    queryKey: ["food-items"],
    queryFn: getFoodItems,
  });

export const useMyBookings = () =>
  useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });
