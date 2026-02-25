import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getInventory,
  getInventoryCategories,
  getMyBookings as getMyInventoryBookings,
  getAllBookings,
  getStockBatches,
  bookInventory,
} from "../services/inventory";
import { getFoodItems, getStockBoardData } from "../services/customer";

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

export const useMyBookings = (enabled = true) =>
  useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyInventoryBookings,
    enabled,
  });

export const useInventoryList = () =>
  useQuery({
    queryKey: ["inventory-list"],
    queryFn: getInventory,
  });

export const useInventoryCategories = () =>
  useQuery({
    queryKey: ["inventory-categories"],
    queryFn: getInventoryCategories,
  });

export const useOwnerAllBookings = () =>
  useQuery({
    queryKey: ["inventory-all-bookings"],
    queryFn: getAllBookings,
  });

export const useStockBatches = (variantId, enabled = true) =>
  useQuery({
    queryKey: ["inventory-stock-batches", variantId],
    queryFn: () => getStockBatches(variantId),
    enabled: enabled && !!variantId,
  });

export const useBookInventory = (options = {}) =>
  useMutation({
    mutationFn: ({ inventory_id, slots_booked }) =>
      bookInventory({ inventory_id, slots_booked }),
    ...options,
  });
