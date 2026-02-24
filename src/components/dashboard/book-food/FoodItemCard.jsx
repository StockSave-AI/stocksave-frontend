import { useState } from "react";
import { FiImage } from "react-icons/fi";

const FoodItemCard = ({ item, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]);

  const total = Number(selectedSize?.price || 0) * qty;

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition w-full min-w-0">
      <div className="h-40 w-full overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <FiImage size={28} />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-grow min-w-0">
        <h4 className="font-semibold text-neutral-800 text-base">{item.name}</h4>

        <select
          className="w-full border border-neutral-200 rounded-md p-2 text-sm"
          value={selectedSize.label}
          onChange={(e) =>
            setSelectedSize(item.sizes.find((size) => size.label === e.target.value))
          }
        >
          {item.sizes.map((size) => (
            <option key={size.label} value={size.label}>
              {size.label} - ₦{Number(size.price || 0).toLocaleString()}
            </option>
          ))}
        </select>

        <div className="bg-[#F0FDF4] rounded-xl p-2 flex justify-between items-center text-sm">
          <span className="text-gray-600">Price per unit:</span>
          <span className="text-[#10B981] font-semibold">
            ₦{Number(selectedSize?.price || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Quantity:</label>
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-lg"
            >
              -
            </button>

            <input
              type="text"
              readOnly
              value={qty}
              className="flex-1 min-w-0 h-8 sm:h-9 border border-gray-200 rounded-lg text-center text-sm font-medium outline-none"
            />

            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#10B981] rounded-lg text-white hover:bg-green-600 transition-colors text-lg"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-[#F9FAFB] rounded-xl p-2 flex justify-between items-center text-sm font-semibold">
          <span>Total:</span>
          <span className="text-[#10B981]">₦{total.toLocaleString()}</span>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(item, selectedSize, qty)}
          className="bg-[#10B981] text-white py-2 rounded-xl font-semibold hover:bg-green-600 transition text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodItemCard;
