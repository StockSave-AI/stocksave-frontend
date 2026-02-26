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
  useOwnerTransactions,
  useOwnerUserDetail,
} from "../hooks/useOwnerData";
import {
  applyStatusOverrides,
  buildLocalUsers,
  calculateCustomerBalance,
  extractOwnerCashDepositTransactions,
  extractRecentCashRows,
  mergeAndFilterUsers,
  mergeCashDepositsById,
  normalizeApiUsers,
  patchOwnerRecentCashStatus,
  patchOwnerTransactionsStatus,
  sortDepositsByDateDesc,
} from "./cashDepositUtils";
import { resolveCustomerNotificationEntity } from "../../services/notificationsService";

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000];
const RECENT_CASH_LIMIT = 500;
const initialStep = "idle";

const CashDeposit = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const prefillUser = location.state?.prefillUser || null;
  const initialSearchTerm = prefillUser
    ? `${prefillUser.first_name || ""} ${prefillUser.last_name || ""}`.trim()
    : "";
  const [depositAmount, setDepositAmount] = useState(5000);
  const [step, setStep] = useState(initialStep);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCustomer, setSelectedCustomer] = useState(prefillUser);
  const [optimisticBalanceByUser, setOptimisticBalanceByUser] = useState({});
  const [statusOverrides, setStatusOverrides] = useState({});
  const recentCashPendingQuery = useOwnerRecentCash({
    status: "Pending",
    limit: RECENT_CASH_LIMIT,
  });
  const recentCashCompletedQuery = useOwnerRecentCash({
    status: "Completed",
    limit: RECENT_CASH_LIMIT,
  });
  const recentCashFailedQuery = useOwnerRecentCash({
    status: "Failed",
    limit: RECENT_CASH_LIMIT,
  });
  const ownerCashTransactionsQuery = useOwnerTransactions({
    type: "Deposit",
    method: "Cash",
    limit: RECENT_CASH_LIMIT,
  });
  const searchUsersQuery = useOwnerSearchUsers({ q: searchTerm.trim() });
  const selectedUserDetailQuery = useOwnerUserDetail(
    selectedCustomer?.id,
    Boolean(selectedCustomer?.id),
  );
  const updateStatusMutation = useSavingsStatusUpdate();
  const recordDepositMutation = useOwnerRecordDeposit();

  const recentDepositsRaw = useMemo(
    () =>
      mergeCashDepositsById([
        ...extractOwnerCashDepositTransactions(ownerCashTransactionsQuery.data),
        ...extractRecentCashRows(recentCashPendingQuery.data),
        ...extractRecentCashRows(recentCashCompletedQuery.data),
        ...extractRecentCashRows(recentCashFailedQuery.data),
      ]),
    [
    ownerCashTransactionsQuery.data,
    recentCashCompletedQuery.data,
    recentCashFailedQuery.data,
    recentCashPendingQuery.data,
    ],
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
  const recentDeposits = useMemo(
    () => sortDepositsByDateDesc(applyStatusOverrides(recentDepositsRaw, statusOverrides)),
    [recentDepositsRaw, statusOverrides],
  );

  const handleMarkCompleted = async (item) => {
    try {
      await updateStatusMutation.mutateAsync({
        transactionId: item?.id,
        status: "Completed",
        skipRecentCashInvalidation: true,
      });
      setStatusOverrides((prev) => ({ ...prev, [String(item?.id)]: "Completed" }));
      queryClient.setQueriesData(
        { queryKey: ["owner-recent-cash"] },
        (previous) => patchOwnerRecentCashStatus(previous, item?.id, "Completed"),
      );
      queryClient.setQueriesData(
        { queryKey: ["owner-transactions"] },
        (previous) => patchOwnerTransactionsStatus(previous, item?.id, "Completed"),
      );
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
            quickAmounts={QUICK_AMOUNTS}
            newBalance={newBalance}
            onConfirm={handleOpenConfirm}
            onCancel={() => {
              setDepositAmount(0);
              setStep(initialStep);
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
          isLoading={
            ownerCashTransactionsQuery.isLoading ||
            recentCashPendingQuery.isLoading ||
            recentCashCompletedQuery.isLoading ||
            recentCashFailedQuery.isLoading
          }
          isError={
            ownerCashTransactionsQuery.isError &&
            recentCashPendingQuery.isError &&
            recentCashCompletedQuery.isError &&
            recentCashFailedQuery.isError
          }
          onMarkCompleted={handleMarkCompleted}
          isUpdating={updateStatusMutation.isPending}
        />

        <ConfirmDepositModal
          isOpen={step === "confirming"}
          onClose={() => setStep(initialStep)}
          onConfirm={handleSubmitDeposit}
          data={depositData}
          isSubmitting={recordDepositMutation.isPending}
        />

        <DepositSuccessModal
          isOpen={step === "success"}
          onClose={() => {
            setStep(initialStep);
          }}
          data={depositData}
        />
      </div>
    </div>
  );
};

export default CashDeposit;
