import { useEffect } from "react";
import {
  FiAlertTriangle,
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiEye,
  FiLayers,
  FiShoppingCart,
  FiUserPlus,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAuthRole } from "../../../utils/authStorage";
import { TABS } from "./constants";
import NotificationFilter from "./NotificationFilter";
import NotificationHeader from "./NotificationHeader";
import NotificationItem from "./NotificationItem";
import NotificationList from "./NotificationList";
import ReconciliationInsightCard from "./ReconciliationInsightCard";
import StockMatchModal from "./StockMatchModal";
import { useOwnerNotificationsPage } from "./useOwnerNotificationsPage";

const PAGE_SIZE = 8;

const iconMap = {
  "pending-payments": FiCreditCard,
  "low-stock": FiAlertTriangle,
  "fully-booked": FiShoppingCart,
  "new-signups": FiUserPlus,
  reconciliation: FiLayers,
};

const NotificationsStateCard = ({ message, onClear }) => (
  <NotificationItem className="p-8">
    <div className="w-full text-center">
      <p className="text-sm">{message}</p>
      <button
        onClick={onClear}
        className="mt-3 px-4 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700"
      >
        Clear history
      </button>
    </div>
  </NotificationItem>
);

export default function OwnerNotifications() {
  const navigate = useNavigate();
  const isOwner = getAuthRole() === "owner";

  useEffect(() => {
    if (!isOwner) {
      toast.error("Owner access only");
      navigate("/dashboard", { replace: true });
    }
  }, [isOwner, navigate]);

  if (!isOwner) return null;

  const {
    activeTab,
    setActiveTab,
    setPage,
    readMap,
    unread,
    baseCounts,
    tabConfig,
    tabLoading,
    tabError,
    orderedItems,
    paginatedItems,
    totalPages,
    currentPage,
    reconciliation,
    reconciliationItem,
    selectedVariantId,
    setSelectedVariantId,
    stockMatchQuery,
    clearAllNotifications,
    clearCurrentHistory,
    markAllGlobal,
    markOne,
  } = useOwnerNotificationsPage({ isOwner, navigate, pageSize: PAGE_SIZE });

  return (
    <div className="min-h-screen bg-neutral-50 p-3 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        <NotificationHeader
          title="Notifications"
          subtitle={`You have ${unread} unread notifications`}
          actions={
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={clearAllNotifications}
                className="inline-flex items-center justify-center gap-2 bg-white border border-neutral-300 text-neutral-700 px-4 py-2.5 rounded-button font-semibold text-sm hover:bg-neutral-50 w-full sm:w-auto"
              >
                Clear Notifications
              </button>
              <button
                onClick={markAllGlobal}
                className="inline-flex items-center justify-center gap-2 bg-success text-white px-5 py-2.5 rounded-button font-semibold text-sm hover:opacity-95 w-full sm:w-auto"
              >
                <FiCheckCircle size={16} />
                Mark All as Read
              </button>
            </div>
          }
        />

        <NotificationFilter className="p-3 md:hidden border-neutral-200">
          <label className="text-xs text-neutral-500 mb-1 block">Filter</label>
          <select
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-button border-2 border-primary-200 text-sm text-neutral-700 bg-white"
          >
            {TABS.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label} ({baseCounts[tab.key] || 0})
              </option>
            ))}
          </select>
        </NotificationFilter>

        <NotificationFilter className="hidden md:grid p-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2 border-neutral-200">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                }}
                className={`inline-flex items-center justify-between gap-2 px-3 py-2 rounded-button text-sm border w-full min-w-0 ${
                  active
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {tab.label}
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs">
                  {baseCounts[tab.key] || 0}
                </span>
              </button>
            );
          })}
        </NotificationFilter>

        {tabLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="h-9 w-9 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!tabLoading && tabError ? (
          <NotificationsStateCard
            message={
              activeTab === "reconciliation"
                ? "Reconciliation data not available."
                : "Failed to load notifications for this tab."
            }
            onClear={clearCurrentHistory}
          />
        ) : null}

        {!tabLoading && !tabError && orderedItems.length === 0 ? (
          <NotificationsStateCard
            message={tabConfig?.empty || "No notifications available."}
            onClear={clearCurrentHistory}
          />
        ) : null}

        {!tabLoading && !tabError && orderedItems.length > 0 ? (
          activeTab === "reconciliation" && reconciliationItem ? (
            <ReconciliationInsightCard
              reconciliation={reconciliation}
              isRead={!!readMap[reconciliationItem.readKey]}
              onToggleRead={() =>
                markOne(
                  reconciliationItem.readKey,
                  !readMap[reconciliationItem.readKey],
                )
              }
              onOpenDashboard={() => navigate("/owner/dashboard")}
            />
          ) : (
            <NotificationList className="space-y-3">
              {paginatedItems.map((item) => {
                const isRead = Boolean(readMap[item.readKey]);
                const Icon = iconMap[activeTab] || FiBell;
                const cardClass = isRead
                  ? "border-emerald-200 bg-emerald-50/40"
                  : item.tint;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-card border transition ${cardClass}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isRead
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-white/90 text-neutral-700"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-h6 font-semibold text-neutral-900">
                            {item.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-[11px] rounded-full font-semibold ${
                              isRead
                                ? "text-emerald-700 bg-emerald-100"
                                : item.tag
                            }`}
                          >
                            {isRead ? "Read" : "Unread"}
                          </span>
                        </div>
                        <p className="text-neutral-700 mt-0.5">{item.message}</p>
                        <p className="text-sm text-neutral-500 mt-1">{item.time}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => markOne(item.readKey, !isRead)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-button border border-neutral-200 bg-white text-neutral-700 text-sm w-full sm:w-auto"
                      >
                        <FiCheck size={14} />
                        {isRead ? "Mark unread" : "Mark read"}
                      </button>
                      <button
                        onClick={item.onAction}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-button bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold w-full sm:w-auto"
                      >
                        <FiEye size={14} />
                        {item.actionLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </NotificationList>
          )
        ) : null}

        {!tabLoading && !tabError && orderedItems.length > PAGE_SIZE ? (
          <div className="bg-white border border-neutral-200 rounded-card p-3 flex items-center justify-between gap-3">
            <p className="text-xs text-neutral-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <StockMatchModal
        open={Boolean(selectedVariantId)}
        onClose={() => setSelectedVariantId(null)}
        variantId={selectedVariantId}
        query={stockMatchQuery}
      />
    </div>
  );
}
