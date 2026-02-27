import { useMemo, useState } from "react";
import { BiSort } from "react-icons/bi";
import { FiColumns, FiDownload, FiPieChart, FiTrendingUp } from "react-icons/fi";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard, SectionTable } from "./AnalyticsShared";
import { exportCsv } from "./analyticsUtils";

const PIE_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#22c55e",
  "#a855f7",
  "#06b6d4",
  "#84cc16",
  "#ec4899",
];

export default function StockTurnoverSection({ turnover = [] }) {
  const [showPie, setShowPie] = useState(false);
  const [sortHighFirst, setSortHighFirst] = useState(true);

  const sortedTurnover = useMemo(() => {
    const list = [...turnover];
    list.sort((a, b) => {
      const aValue = Number(a?.turnover_rate_percent || 0);
      const bValue = Number(b?.turnover_rate_percent || 0);
      return sortHighFirst ? bValue - aValue : aValue - bValue;
    });
    return list;
  }, [turnover, sortHighFirst]);

  const maxTurnoverRate = useMemo(
    () =>
      sortedTurnover.reduce(
        (max, item) => Math.max(max, Number(item?.turnover_rate_percent || 0)),
        0,
      ),
    [sortedTurnover],
  );

  const minUnitsSold = useMemo(() => {
    if (sortedTurnover.length === 0) return 0;
    return sortedTurnover.reduce(
      (min, item) => Math.min(min, Number(item?.units_sold || 0)),
      Number.POSITIVE_INFINITY,
    );
  }, [sortedTurnover]);

  const turnoverPieData = useMemo(
    () =>
      sortedTurnover
        .slice(0, 12)
        .map((item, index) => ({
          name: `${item?.product_name || "-"} ${item?.size_label ? `(${item.size_label})` : ""}`.trim(),
          value: Number(item?.units_sold || 0),
          color: PIE_COLORS[index % PIE_COLORS.length],
        }))
        .filter((item) => item.value > 0),
    [sortedTurnover],
  );

  const handleExportTurnoverCsv = () => {
    exportCsv({
      filename: `stock-turnover-${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ["Product", "Variant", "Units Sold", "Turnover %"],
      rows: sortedTurnover.map((item) => [
        item?.product_name || "-",
        item?.size_label || "-",
        Number(item?.units_sold || 0),
        Number(item?.turnover_rate_percent || 0).toFixed(1),
      ]),
    });
  };

  const sharedActions = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setSortHighFirst((prev) => !prev)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        title={sortHighFirst ? "Sorted by highest turnover" : "Sorted by lowest turnover"}
        aria-label="Sort turnover"
      >
        {showPie ? <BiSort size={15} /> : <FiTrendingUp size={15} />}
      </button>
      <button
        type="button"
        onClick={handleExportTurnoverCsv}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        title="Export Stock Turnover CSV"
        aria-label="Export stock turnover CSV"
      >
        <FiDownload size={15} />
      </button>
      <button
        type="button"
        onClick={() => setShowPie((prev) => !prev)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        title={showPie ? "Show stock turnover table" : "Show stock turnover pie chart"}
        aria-label={showPie ? "Show stock turnover table" : "Show stock turnover pie chart"}
      >
        {showPie ? <FiColumns size={14} /> : <FiPieChart size={15} />}
      </button>
    </div>
  );

  if (showPie) {
    return (
      <ChartCard title="Stock Turnover Share (Units Sold)" headerActions={sharedActions}>
        <div className="h-[26rem] sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={turnoverPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="46%"
                outerRadius="72%"
                paddingAngle={1}
              >
                {turnoverPieData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "11px", paddingTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    );
  }

  return (
    <SectionTable
      title="Stock Turnover"
      columns={["Product", "Variant", "Units Sold", "Turnover %"]}
      headerActions={sharedActions}
      rows={sortedTurnover.map((item) => [
        item?.product_name || "-",
        item?.size_label || "-",
        Number(item?.units_sold || 0).toLocaleString(),
        `${Number(item?.turnover_rate_percent || 0).toFixed(1)}%`,
      ])}
      rowClassName={(index) => {
        const item = sortedTurnover[index];
        const turnoverRate = Number(item?.turnover_rate_percent || 0);
        const unitsSold = Number(item?.units_sold || 0);
        if (turnoverRate > 0 && turnoverRate === maxTurnoverRate) {
          return "bg-emerald-50/80 text-emerald-900 font-semibold";
        }
        if (unitsSold === minUnitsSold) {
          return "bg-red-50/80 text-red-800";
        }
        return "";
      }}
    />
  );
}
