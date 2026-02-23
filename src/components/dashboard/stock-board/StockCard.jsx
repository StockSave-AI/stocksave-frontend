import { FiBox } from "react-icons/fi";

export const StockCard = ({ item }) => (
  <div className="bg-white p-4 rounded-lg border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-16 h-16 bg-neutral-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <FiBox className="w-8 h-8 text-neutral-400" />
      )}
    </div>
    <h3 className="text-neutral-800 font-semibold mb-6">{item.name}</h3>
    <div className="flex justify-between items-center text-sm">
      <span className="text-neutral-400 font-medium">Quantity:</span>
      <span className="text-neutral-700 font-bold">{item.quantity}</span>
    </div>
  </div>
);
