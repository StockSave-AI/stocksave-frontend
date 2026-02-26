import { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import CartSummaryModal from "./CartSummaryModal";
import BookingConfirmationModal from "./BookingConfirmationModal";
import BookingHistoryModal from "./BookingHistoryModal";
import BookFoodHeader from "./BookFoodHeader";
import BookFoodSummaryCards from "./BookFoodSummaryCards";
import AvailableFoodSection from "./AvailableFoodSection";
import BookFoodFooterActions from "./BookFoodFooterActions";
import {
  useBookInventory,
  useFoodItems,
  useInventoryList,
  useMyBookings,
} from "../../hooks/useInventory";
import { useCustomerSummary } from "../../hooks/useCustomerSummary";
import useSavingsBalance from "../../hooks/useSavingsBalance";
import { canAfford, normalizeFoodItems } from "./bookFoodUtils";
import { pushCustomerBookingNotification } from "../../services/notificationsService";

const BookFood = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [cart, setCart] = useState([]);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingPendingMessage, setBookingPendingMessage] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const foodItemsQuery = useFoodItems();
  const inventoryListQuery = useInventoryList();
  const myBookingsQuery = useMyBookings(showHistory);
  const bookInventoryMutation = useBookInventory();
  const summaryQuery = useCustomerSummary();
  const savingsBalanceQuery = useSavingsBalance();

  const inventoryLookup = useMemo(() => {
    const raw = inventoryListQuery.data?.data || inventoryListQuery.data || [];
    const items =
      raw?.items ||
      raw?.inventory ||
      (Array.isArray(raw) ? raw : raw?.data) ||
      [];

    const map = {};
    if (Array.isArray(items)) {
      items.forEach((item) => {
        const inventoryId = item?.inventory_id ?? item?.id ?? null;
        const variantId =
          item?.product_variant_id ??
          item?.variant_id ??
          item?.variantId ??
          item?.product_variant ??
          null;
        if (inventoryId && variantId) {
          map[Number(variantId)] = Number(inventoryId);
        }
      });
    }
    return map;
  }, [inventoryListQuery.data]);

  const foodItems = useMemo(() => {
    const source = foodItemsQuery.data?.data || foodItemsQuery.data || [];
    return normalizeFoodItems(source, inventoryLookup);
  }, [foodItemsQuery.data, inventoryLookup]);
  const savingsBalance = Number(
    savingsBalanceQuery.data?.data?.balance ??
      savingsBalanceQuery.data?.balance ??
      summaryQuery.data?.data?.summary_cards?.total_savings ??
      0,
  );
  const insufficientBalanceMessage =
    "Insufficient balance. Please make an extra deposit to book this item.";

  const currentUserId =
    summaryQuery.data?.data?.profile?.id ||
    summaryQuery.data?.data?.profile?.user_id ||
    "guest";
  const cartStorageKey = `book-cart-${currentUserId}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(cartStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch {
      /* ignore parse errors */
    }
  }, [cartStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch {
      /* ignore storage errors */
    }
  }, [cart, cartStorageKey]);

  const addToCart = (item, selectedSize, qty) => {
    if (qty < 1) return;
    const unitPrice = Number(selectedSize?.price || 0);
    const addQuantity = Number(qty || 0);
    const currentCartTotal = cart.reduce(
      (sum, cartItem) => sum + Number(cartItem?.size?.price || 0) * Number(cartItem?.qty || 0),
      0,
    );
    const projectedTotal = currentCartTotal + unitPrice * addQuantity;

    if (!canAfford(unitPrice, savingsBalance)) {
      toast.error("This item is currently not bookable. Insufficient balance.");
      return;
    }
    if (projectedTotal > Number(savingsBalance || 0)) {
      toast.error(insufficientBalanceMessage);
      return;
    }
    let inventoryId = Number(selectedSize?.inventory_id);

    if (!Number.isFinite(inventoryId) || inventoryId <= 0) {
      const inventoryRaw =
        inventoryListQuery.data?.data || inventoryListQuery.data || [];
      const items =
        inventoryRaw?.items ||
        inventoryRaw?.inventory ||
        (Array.isArray(inventoryRaw) ? inventoryRaw : inventoryRaw?.data) ||
        [];

      if (Array.isArray(items)) {
        const match = items.find((inv) => {
          const variantMatch =
            Number(inv?.product_variant_id) === Number(selectedSize?.variant_id) ||
            Number(inv?.variant_id) === Number(selectedSize?.variant_id);
          const nameMatch =
            (inv?.product_name || inv?.name || "").toLowerCase() ===
              (item?.name || "").toLowerCase() &&
            (inv?.size_label || "").toLowerCase() ===
              (selectedSize?.label || "").toLowerCase();
          return variantMatch || nameMatch;
        });
        if (match?.inventory_id) {
          inventoryId = Number(match.inventory_id);
        }
      }

      if (!Number.isFinite(inventoryId) || inventoryId <= 0) {
        toast.error(
          "This item is not currently bookable. Please try another size or check back soon.",
        );
        return;
      }
    }

    const normalizedSize = {
      ...selectedSize,
      inventory_id: inventoryId,
    };

    const existing = cart.find(
      (c) => c.id === item.id && c.size.label === normalizedSize.label,
    );

    if (existing) {
      setCart(
        cart.map((c) => (c === existing ? { ...c, qty: c.qty + qty } : c)),
      );
      toast.success(`${item.name} quantity updated!`);
    } else {
      setCart([
        ...cart,
        { id: item.id, name: item.name, size: normalizedSize, qty },
      ]);
      toast.success(`${item.name} added to cart!`);
    }
  };

  const bookingTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.size.price * item.qty, 0),
    [cart],
  );

  const remainingBalance = savingsBalance - bookingTotal;
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart],
  );

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(foodItems.map((item) => item.category).filter(Boolean)),
    );
    return ["All", ...uniqueCategories];
  }, [foodItems]);

  const handleConfirmBooking = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    if (remainingBalance < 0) {
      toast.error("You have reached the limit. Please top up your balance.");
      return;
    }

    setShowCart(true);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 lg:p-6 bg-neutral-50 min-h-screen pb-32 relative">
      {cart.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium">You have unconfirmed items in your cart.</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCart(true)}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700"
            >
              Complete Booking
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-2 rounded-lg text-sm font-semibold border border-amber-300 text-amber-800 hover:bg-amber-100"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}

      <BookFoodHeader
        cartCount={cartCount}
        onOpenCart={() => setShowCart(true)}
        onOpenHistory={() => setShowHistory(true)}
      />
      <BookFoodSummaryCards
        savingsBalance={savingsBalance}
        bookingTotal={bookingTotal}
        remainingBalance={remainingBalance}
      />
      <AvailableFoodSection
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isLoading={foodItemsQuery.isLoading}
        isError={foodItemsQuery.isError}
        foodItems={foodItems}
        onAddToCart={addToCart}
        userBalance={savingsBalance}
        onLockedAction={(payload) => {
          if (payload?.reason === "not_bookable") {
            toast.error("This item is currently not bookable.");
            return;
          }
          toast.error(insufficientBalanceMessage);
        }}
      />

      {showCart && (
        <CartSummaryModal
          cart={cart}
          setCart={setCart}
          total={bookingTotal}
          savingsBalance={savingsBalance}
          onClose={() => setShowCart(false)}
          onCheckout={async () => {
            try {
              const pendingNotifications = [];
              for (const item of cart) {
                const inventoryId = Number(item?.size?.inventory_id);
                const availableSlots = Number(item?.size?.available_slots ?? 0);

                if (!Number.isFinite(inventoryId) || inventoryId <= 0) {
                  throw new Error(
                    `${item?.name || "Item"} is unavailable for booking right now.`,
                  );
                }

                if (availableSlots > 0 && item.qty > availableSlots) {
                  throw new Error(
                    `${item?.name || "Item"} does not have enough available slots.`,
                  );
                }

                const bookingResponse = await bookInventoryMutation.mutateAsync({
                  inventory_id: inventoryId,
                  slots_booked: item.qty,
                });

                const bookingId =
                  bookingResponse?.data?.id ??
                  bookingResponse?.id ??
                  bookingResponse?.data?.booking_id ??
                  bookingResponse?.booking_id ??
                  null;

                pendingNotifications.push({
                  id: bookingId,
                  itemName: item?.name || "your item",
                  sizeLabel: item?.size?.label || "",
                });
              }

              for (const pendingItem of pendingNotifications) {
                const itemName = `${pendingItem.itemName}${
                  pendingItem.sizeLabel ? ` (${pendingItem.sizeLabel})` : ""
                }`;
                await pushCustomerBookingNotification({
                  notificationId: pendingItem.id
                    ? `booking-pending-${pendingItem.id}`
                    : undefined,
                  type: "booking_pending",
                  entityId: pendingItem.id,
                  statusAtCreation: "pending",
                  title: "Booking Pending",
                  message: `Your booking for ${itemName} is pending owner confirmation.`,
                });
              }
              await Promise.all([
                foodItemsQuery.refetch(),
                summaryQuery.refetch(),
                queryClient.invalidateQueries({ queryKey: ["stock-board"] }),
                queryClient.invalidateQueries({
                  queryKey: ["customer-summary"],
                }),
                queryClient.invalidateQueries({ queryKey: ["my-bookings"] }),
                queryClient.invalidateQueries({ queryKey: ["savings-balance"] }),
              ]);
              localStorage.removeItem(cartStorageKey);
              setBookingPendingMessage(
                "Booking confirmed and pending. The owner will notify you when it is available for pickup.",
              );
              setShowCart(false);
              setShowBookingConfirmation(true);
            } catch (error) {
              console.error("Inventory booking failed", {
                message: error?.message,
                status: error?.status,
                data: error?.data,
              });

              if (error?.status === 401) {
                toast.error("Session expired. Please log in again.");
                navigate("/login", { replace: true });
                return;
              }

              if (error?.status === 403) {
                toast.error("Customers only.");
                return;
              }

              if (error?.status === 400) {
                toast.error(error?.message || "Unable to book selected item.");
                return;
              }

              toast.error(error?.message || "Failed to complete booking.");
            }
          }}
          showToast={toast}
        />
      )}

      {showBookingConfirmation && (
        <BookingConfirmationModal
          cart={cart}
          total={bookingTotal}
          pendingMessage={bookingPendingMessage}
          onClose={() => {
            setShowBookingConfirmation(false);
            setCart([]);
            toast.success("Booking successfully confirmed!");
          }}
        />
      )}

      <BookingHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        query={myBookingsQuery}
      />

      <BookFoodFooterActions
        canConfirm={
          cart.length > 0 &&
          remainingBalance >= 0 &&
          !bookInventoryMutation.isLoading
        }
        onConfirm={() => {
          if (bookInventoryMutation.isLoading) return;
          handleConfirmBooking();
        }}
        isSubmitting={bookInventoryMutation.isLoading}
      />
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h4 className="text-lg font-semibold text-neutral-800">Clear cart?</h4>
            <p className="text-sm text-neutral-600">
              This will remove all unconfirmed items from your cart.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm border border-neutral-200 text-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCart([]);
                  localStorage.removeItem(cartStorageKey);
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFood;
