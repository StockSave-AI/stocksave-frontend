import { FiBox, FiCalendar } from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import StatsCard from "../StatsCard";
import { useStockBoardData } from "../../hooks/useInventory";

const getLiveStockCount = (response) => {
  const payload = response?.data ?? response;
  if (!payload) return 0;

  if (Array.isArray(payload)) {
    const variantCount = payload.reduce((count, category) => {
      const products = category?.products || [];
      return (
        count +
        products.reduce((inner, product) => {
          const variants = product?.variants || [];
          return inner + variants.filter((variant) => Number(variant?.stock_quantity || 0) > 0).length;
        }, 0)
      );
    }, 0);
    return variantCount;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products.reduce((count, product) => {
      const variants = Array.isArray(product?.variants) ? product.variants : [];
      if (variants.length === 0) {
        return count + (Number(product?.stock_quantity || product?.quantity || 0) > 0 ? 1 : 0);
      }
      return (
        count +
        variants.filter((variant) => Number(variant?.stock_quantity || variant?.available_slots || 0) > 0).length
      );
    }, 0);
  }

  const items = payload?.items || payload?.inventory || payload?.products || [];
  return Array.isArray(items) ? items.filter((item) => Number(item?.quantity || item?.available_slots || 0) > 0).length : 0;
};

export default function DashboardStatsGrid({
  formatCurrency,
  summary,
  currentPlan,
  formatDisplayDate,
}) {
  const stockBoardQuery = useStockBoardData();
  const stockCount =
    getLiveStockCount(stockBoardQuery.data) ||
    Number(summary?.summary_cards?.stock_count || 0);

  const planStatus = String(currentPlan?.status || "").toLowerCase();
  const hasActivePlan = planStatus === "active";
  const nextPaymentValue = hasActivePlan
    ? currentPlan?.next_payment_date ||
      currentPlan?.next_payment ||
      summary?.summary_cards?.next_payment
    : null;
  const nextPaymentDisplay = hasActivePlan
    ? formatDisplayDate(nextPaymentValue, "N/A")
    : planStatus === "paused"
      ? "Plan Paused"
      : "No Active Plan";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatsCard
        title="Total Savings"
        value={formatCurrency(summary?.summary_cards?.total_savings)}
        subtitle={
          Number(summary?.summary_cards?.total_savings || 0) === 0
            ? "No savings yet"
            : "Approved deposits only"
        }
        icon={<FaNairaSign />}
      />

      <StatsCard
        title="Active Plan"
        value={currentPlan?.plan_type || "None"}
        subtitle={
          currentPlan?.amount
            ? `${formatCurrency(currentPlan?.amount)} per plan`
            : "No active plan"
        }
        icon={<FiCalendar />}
      />

      <StatsCard
        title="Next Payment"
        value={nextPaymentDisplay}
        subtitle={hasActivePlan ? "Upcoming contribution" : "Create or resume a plan"}
        icon={<FiCalendar />}
      />

      <StatsCard
        title="Stock Items"
        value={stockCount}
        subtitle="Available now"
        icon={<FiBox />}
      />
    </div>
  );
}
