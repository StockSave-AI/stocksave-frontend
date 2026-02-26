import { useState } from "react";
import { FiImage } from "react-icons/fi";
import { canAfford, isBookableSize } from "./bookFoodUtils";

const FoodItemCard = ({
  item,
  onAddToCart,
  userBalance,
  onLockedAction,
}) => {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]);

  const handleQtyChange = (value) => {
    const number = parseInt(value);
    if (!isNaN(number) && number > 0) {
      setQty(number);
    } else if (value === "") {
      setQty("");
    }
  };

  const total = Number(selectedSize?.price || 0) * (qty || 0);
  const itemName = String(item?.name || "").trim().toLowerCase();
  const isUnavailable =
    itemName === "salt" &&
    (item?.bookable === false || !isBookableSize(selectedSize));
  const isLockedByBalance = !canAfford(selectedSize?.price, userBalance);
  const isLocked = isUnavailable || isLockedByBalance;

  return (
    <div
      className={`relative w-full max-w-sm mx-auto rounded-2xl transition duration-300 overflow-hidden border ${
        isLocked
          ? "bg-white border-neutral-200 cursor-not-allowed"
          : "bg-white border-neutral-200 shadow-sm hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      <div className="h-48 w-full overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <FiImage size={30} />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4 relative z-10">
        <h4 className="text-lg font-semibold text-neutral-800">{item.name}</h4>

        <div className="flex flex-col gap-2">
          <select
            className="w-full border border-neutral-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400 outline-none"
            value={selectedSize.label}
            onChange={(e) =>
              setSelectedSize(
                item.sizes.find((size) => size.label === e.target.value),
              )
            }
          >
            {item.sizes.map((size) => (
              <option key={size.label} value={size.label}>
                {size.label} — ₦{Number(size.price || 0).toLocaleString()}
              </option>
            ))}
          </select>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Price per unit</span>
            <span className="font-semibold text-[#10B981]">
              ₦{Number(selectedSize?.price || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-gray-500">Quantity</span>

          <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 border border-r-dark-100"
            >
              -
            </button>

            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => handleQtyChange(e.target.value)}
              className="w-24 text-center outline-none"
            />

            <button
              type="button"
              onClick={() => setQty((qty || 0) + 1)}
              className="px-3 py-2 text-white bg-[#10B981] hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="bg-[#F0FDF4] rounded-xl p-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-bold text-[#10B981]">
            ₦{total.toLocaleString()}
          </span>
        </div>

        {/* Button */}
        <button
          type="button"
          disabled={!qty || qty < 1}
          onClick={() => {
            if (isUnavailable) {
              onLockedAction?.({ reason: "not_bookable", item, selectedSize });
              return;
            }
            if (isLockedByBalance) {
              onLockedAction?.({ reason: "insufficient_balance", item, selectedSize });
              return;
            }
            onAddToCart(item, selectedSize, qty);
          }}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            isLocked
              ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
              : "bg-[#10B981] text-white hover:bg-green-600 disabled:opacity-50"
          }`}
        >
          Add to Cart
        </button>
        {isLocked ? (
          <button
            type="button"
            onClick={() =>
              onLockedAction?.({
                reason: isUnavailable ? "not_bookable" : "insufficient_balance",
                item,
                selectedSize,
              })
            }
            className="w-full text-xs text-neutral-500 text-left"
          >
            {isUnavailable
              ? "This item is currently not bookable."
              : "Balance too low for this item."}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default FoodItemCard;
