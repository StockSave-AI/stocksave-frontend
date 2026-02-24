import { FiAlertCircle } from "react-icons/fi";

export const StockAlerts = ({ alerts = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <div className="flex items-center gap-2 mb-4 text-neutral-500 font-semibold">
        <FiAlertCircle className="w-4 h-4 text-red-500" />
        <span>Stock Alerts</span>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div
            key={alert.id || idx}
            className={`p-4 rounded-lg flex items-center gap-3 border ${
              idx === 0
                ? "bg-red-500 text-white border-none"
                : "bg-white border-neutral-200 text-neutral-700"
            }`}
          >
            <div className="w-2 h-2 bg-neutral-400 rounded-sm"></div>
            <div>
              <p className="font-bold text-sm">{alert.item}</p>
              <p className="text-xs opacity-80">{alert.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
