import { currency } from "./analyticsUtils";

export const CurrencyChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-sm shadow-lg px-3 py-2 min-w-[170px]">
      <p className="text-xs font-semibold text-neutral-700 mb-1">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={`${item.dataKey}-${item.value}`} className="flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-600">{item.name || item.dataKey}</span>
            <span className="text-xs font-semibold text-neutral-900">{currency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
