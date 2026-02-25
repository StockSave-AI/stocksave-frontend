import { useState } from "react";
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from "react-icons/fi";

const CartSummaryModal = ({
  cart,
  setCart,
  total,
  onClose,
  onCheckout,
  savingsBalance,
  showToast,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const increaseQty = (id, sizeLabel) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size.label === sizeLabel
          ? { ...item, qty: item.qty + 1 }
          : item,
      ),
    );
    showToast.success("Quantity increased!");
  };

  const decreaseQty = (id, sizeLabel) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size.label === sizeLabel
            ? { ...item, qty: Math.max(item.qty - 1, 0) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
    showToast.success("Quantity decreased!");
  };

  const removeItem = (id, sizeLabel) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.size.label === sizeLabel)),
    );
    showToast.success("Item removed from cart");
  };

  const handleCheckout = async () => {
    if (isCheckingOut) return;

    if (total > savingsBalance) {
      showToast.error("Insufficient funds. Please deposit more.");
      return;
    }

    setIsCheckingOut(true);
    try {
      await onCheckout();
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-5 sm:p-6 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-red-500 transition"
        >
          <FiX size={24} />
        </button>

        <div className="flex items-center justify-center mb-4 gap-2">
          <FiShoppingCart size={24} className="text-primary-500" />
          <h2 className="text-2xl font-bold text-neutral-800">Cart Summary</h2>
        </div>

        {cart.length === 0 ? (
          <p className="text-neutral-500 text-center mt-4">
            Your cart is empty.
          </p>
        ) : (
          <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size.label}`}
                className="flex justify-between items-center p-2 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-base">{item.name}</p>
                  <p className="text-xs text-neutral-500">{item.size.label}</p>
                  <p className="text-primary-600 font-semibold mt-1 text-sm">
                    ₦{item.size.price.toLocaleString()} × {item.qty}
                  </p>
                  <p className="text-neutral-400 text-xs mt-1">
                    Subtotal: ₦{(item.size.price * item.qty).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => decreaseQty(item.id, item.size.label)}
                      className="p-1.5 rounded-full border hover:bg-neutral-100 transition"
                    >
                      <FiMinus size={14} />
                    </button>

                    <span className="font-semibold text-sm">{item.qty}</span>

                    <button
                      onClick={() => increaseQty(item.id, item.size.label)}
                      className="p-1.5 rounded-full border text-green-600 hover:bg-green-100 transition"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.size.label)}
                    className="text-red-500 p-1 hover:bg-red-100 rounded-full transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center text-lg font-bold text-neutral-800">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Your balance: ₦{savingsBalance.toLocaleString()}
        </div>

        <button
          onClick={handleCheckout}
          disabled={isCheckingOut || cart.length === 0 || total > savingsBalance}
          className="w-full mt-4 bg-primary-500 text-white py-2.5 rounded-2xl font-semibold disabled:opacity-50 hover:bg-primary-600 transition"
        >
          {isCheckingOut ? "Processing booking..." : "Proceed to Booking"}
        </button>
      </div>
    </div>
  );
};

export default CartSummaryModal;
