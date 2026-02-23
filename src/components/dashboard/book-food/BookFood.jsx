import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import CartSummaryModal from "./CartSummaryModal";
import BookingConfirmationModal from "./BookingConfirmationModal";
import BookFoodHeader from "./BookFoodHeader";
import BookFoodSummaryCards from "./BookFoodSummaryCards";
import AvailableFoodSection from "./AvailableFoodSection";
import BookFoodFooterActions from "./BookFoodFooterActions";
import { bookFoodSlot } from "../../services/customer";
import { useFoodItems } from "../../hooks/useInventory";
import { useCustomerSummary } from "../../hooks/useCustomerSummary";
import { normalizeFoodItems } from "./bookFoodUtils";

const BookFood = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const foodItemsQuery = useFoodItems();
  const summaryQuery = useCustomerSummary();

  const foodItems = useMemo(() => {
    const source = foodItemsQuery.data?.data || foodItemsQuery.data || [];
    return normalizeFoodItems(source);
  }, [foodItemsQuery.data]);
  const savingsBalance = Number(
    summaryQuery.data?.data?.summary_cards?.total_savings || 0,
  );

  const addToCart = (item, selectedSize, qty) => {
    if (qty < 1) return;
    if (!selectedSize?.inventory_id) {
      toast.error("This item is not currently bookable.");
      return;
    }

    const existing = cart.find(
      (c) => c.id === item.id && c.size.label === selectedSize.label,
    );

    if (existing) {
      setCart(
        cart.map((c) => (c === existing ? { ...c, qty: c.qty + qty } : c)),
      );
      toast.success(`${item.name} quantity updated!`);
    } else {
      setCart([
        ...cart,
        { id: item.id, name: item.name, size: selectedSize, qty },
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
      <BookFoodHeader cartCount={cartCount} onOpenCart={() => setShowCart(true)} />
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

                await bookFoodSlot({
                  inventory_id: inventoryId,
                  slots_booked: item.qty,
                });
              }
              await Promise.all([
                foodItemsQuery.refetch(),
                summaryQuery.refetch(),
                queryClient.invalidateQueries({ queryKey: ["stock-board"] }),
                queryClient.invalidateQueries({
                  queryKey: ["customer-summary"],
                }),
              ]);
              setShowCart(false);
              setShowBookingConfirmation(true);
            } catch (error) {
              toast.error(error.message || "Failed to complete booking.");
            }
          }}
          showToast={toast}
        />
      )}

      {showBookingConfirmation && (
        <BookingConfirmationModal
          cart={cart}
          total={bookingTotal}
          onClose={() => {
            setShowBookingConfirmation(false);
            setCart([]);
            toast.success("Booking successfully confirmed!");
          }}
        />
      )}

      <BookFoodFooterActions
        canConfirm={cart.length > 0 && remainingBalance >= 0}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default BookFood;
