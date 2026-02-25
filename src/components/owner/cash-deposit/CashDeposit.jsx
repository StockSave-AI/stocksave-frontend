import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import ConfirmDepositModal from "./ConfirmDepositModal";
import CustomerSelect from "./CustomerSelect";
import Header from "./Header";
import RecentDeposits from "./RecentDeposits";
import DepositSuccessModal from "./DepositSuccessModal";
import CashDepositEntrySection from "./CashDepositEntrySection";
import { useSavingsStatusUpdate } from "../../hooks/useSavingsMutations";
import {
  useOwnerRecentCash,
  useOwnerRecordDeposit,
  useOwnerSearchUsers,
  useOwnerUserDetail,
} from "../hooks/useOwnerData";
import {
  buildLocalUsers,
  calculateCustomerBalance,
  mergeAndFilterUsers,
  normalizeApiUsers,
} from "./cashDepositUtils";
import { resolveCustomerNotificationEntity } from "../../services/notificationsService";

const CashDeposit = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const prefillUser = location.state?.prefillUser || null;
  const initialSearchTerm = prefillUser
    ? `${prefillUser.first_name || ""} ${prefillUser.last_name || ""}`.trim()
    : "";
  const [depositAmount, setDepositAmount] = useState(5000);
  const [step, setStep] = useState("idle");
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCustomer, setSelectedCustomer] = useState(prefillUser);
  const [optimisticBalanceByUser, setOptimisticBalanceByUser] = useState({});
  const [statusOverrides, setStatusOverrides] = useState({});
  const [archivedCompletedById, setArchivedCompletedById] = useState({});
  const quickAmounts = [1000, 2000, 5000, 10000];
  const recentCashQuery = useOwnerRecentCash();
  const searchUsersQuery = useOwnerSearchUsers({ q: searchTerm.trim() });
  const selectedUserDetailQuery = useOwnerUserDetail(
    selectedCustomer?.id,
    Boolean(selectedCustomer?.id),
  );
  const updateStatusMutation = useSavingsStatusUpdate();
  const recordDepositMutation = useOwnerRecordDeposit();

  const recentDepositsRaw = useMemo(
    () =>
      Array.isArray(recentCashQuery.data?.data)
        ? recentCashQuery.data.data
        : Array.isArray(recentCashQuery.data)
          ? recentCashQuery.data
          : [],
    [recentCashQuery.data],
  );

  const localUsers = useMemo(() => buildLocalUsers(recentDepositsRaw), [recentDepositsRaw]);

  const apiUsers = useMemo(
    () => normalizeApiUsers(searchUsersQuery.data),
    [searchUsersQuery.data],
  );

  const searchResults = useMemo(
    () => mergeAndFilterUsers({ apiUsers, localUsers, searchTerm }),
    [apiUsers, localUsers, searchTerm],
  );

  const selectedCustomerBalance = useMemo(() => {
    const apiBalance =
      selectedUserDetailQuery.data?.data?.balance ??
      selectedUserDetailQuery.data?.balance ??
      null;
    if (apiBalance !== null && apiBalance !== undefined && apiBalance !== "") {
      const parsed = Number(apiBalance);
      if (Number.isFinite(parsed)) return parsed;
    }
    return calculateCustomerBalance({
      deposits: recentDepositsRaw,
      selectedCustomer,
    });
  }, [selectedUserDetailQuery.data, recentDepositsRaw, selectedCustomer]);

  const optimisticBalance = Number(
    optimisticBalanceByUser?.[String(selectedCustomer?.id)] ?? selectedCustomerBalance,
  );
  const currentBalance = Number.isFinite(optimisticBalance)
    ? Math.max(selectedCustomerBalance, optimisticBalance)
    : selectedCustomerBalance;
  const newBalance = currentBalance + Number(depositAmount);

  const depositData = {
    customerName:
      `${selectedCustomer?.first_name || ""} ${selectedCustomer?.last_name || ""}`.trim() ||
      "Unknown User",
    phone: selectedCustomer?.phone || "-",
    amount: depositAmount,
    code: "CD764VQ1",
  };

  const showDepositSection = step !== "success";
  const recentDeposits = useMemo(() => {
    const normalizedFromApi = recentDepositsRaw.map((item) => ({
      ...item,
      status: statusOverrides[String(item?.id)] || item.status || "Pending",
    }));
    const apiIds = new Set(
      normalizedFromApi.map((item) => String(item?.id)).filter(Boolean),
    );
    const archivedOnly = Object.values(archivedCompletedById).filter(
      (item) => !apiIds.has(String(item?.id)),
    );
    return [...normalizedFromApi, ...archivedOnly].sort((a, b) => {
      const aTime = new Date(a?.created_at || a?.date || 0).getTime();
      const bTime = new Date(b?.created_at || b?.date || 0).getTime();
      return bTime - aTime;
    });
  }, [archivedCompletedById, recentDepositsRaw, statusOverrides]);

  const handleMarkCompleted = async (item) => {
    try {
      await updateStatusMutation.mutateAsync({
        transactionId: item?.id,
        status: "Completed",
        skipRecentCashInvalidation: true,
      });
      setStatusOverrides((prev) => ({ ...prev, [String(item?.id)]: "Completed" }));
      setArchivedCompletedById((prev) => ({
        ...prev,
        [String(item?.id)]: { ...item, status: "Completed" },
      }));
      queryClient.setQueryData(["owner-recent-cash"], (previous) => {
        const source = previous?.data ?? previous;
        if (!Array.isArray(source)) return previous;
        const updated = source.map((entry) =>
          Number(entry?.id) === Number(item?.id)
            ? { ...entry, status: "Completed" }
            : entry,
        );
        return previous?.data ? { ...previous, data: updated } : updated;
      });
      resolveCustomerNotificationEntity({
        targetUserId:
          item?.user_id ?? item?.userId ?? item?.customer_id ?? item?.customerId ?? null,
        type: "deposit_pending",
        entityId: item?.id,
        nextStatus: "Completed",
      });
      toast.success("Deposit status updated.");
    } catch (error) {
      toast.error(error.message || "Failed to update deposit status.");
    }
  };

  const handleOpenConfirm = () => {
    if (!selectedCustomer) {
      toast.error("Select a customer before confirming deposit.");
      return;
    }
    if (!Number(depositAmount) || Number(depositAmount) <= 0) {
      toast.error("Enter a valid deposit amount.");
      return;
    }
    setStep("confirming");
  };

  const handleSubmitDeposit = async () => {
    if (!selectedCustomer?.id) {
      toast.error("Select a customer before submitting.");
      return;
    }
    try {
      const reference = `RCPT-${Date.now()}`;
      await recordDepositMutation.mutateAsync({
        userId: Number(selectedCustomer.id),
        amount: Number(depositAmount),
        reference,
      });
      setOptimisticBalanceByUser((previous) => {
        const key = String(selectedCustomer.id);
        const base = Number(previous?.[key] ?? currentBalance);
        return {
          ...previous,
          [key]: base + Number(depositAmount),
        };
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["owner-recent-cash"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-users"] }),
        queryClient.invalidateQueries({ queryKey: ["owner-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-balance"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-savings"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-history"] }),
      ]);
      toast.success("Cash deposit recorded");
      setStep("success");
    } catch (error) {
      toast.error(error?.message || "Failed to record cash deposit.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header />
        {showDepositSection ? (
          <CashDepositEntrySection
            currentBalance={currentBalance}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            customers={searchResults}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            isSearching={searchUsersQuery.isFetching}
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            quickAmounts={quickAmounts}
            newBalance={newBalance}
            onConfirm={handleOpenConfirm}
            onCancel={() => {
              setDepositAmount(0);
              setStep("idle");
            }}
          />
        ) : (
          <CustomerSelect
            currentBalance={currentBalance}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            customers={searchResults}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            isSearching={searchUsersQuery.isFetching}
          />
        )}

        <RecentDeposits
          deposits={recentDeposits}
          isLoading={recentCashQuery.isLoading}
          isError={recentCashQuery.isError}
          onMarkCompleted={handleMarkCompleted}
          isUpdating={updateStatusMutation.isPending}
        />

        <ConfirmDepositModal
          isOpen={step === "confirming"}
          onClose={() => setStep("idle")}
          onConfirm={handleSubmitDeposit}
          data={depositData}
        />

        <DepositSuccessModal
          isOpen={step === "success"}
          onClose={() => {
            setStep("idle");
          }}
          data={depositData}
        />
      </div>
    </div>
  );
};

export default CashDeposit;
