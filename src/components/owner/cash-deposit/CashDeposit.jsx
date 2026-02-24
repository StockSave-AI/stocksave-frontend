import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmDepositModal from "./ConfirmDepositModal";
import CustomerSelect from "./CustomerSelect";
import Header from "./Header";
import RecentDeposits from "./RecentDeposits";
import DepositSuccessModal from "./DepositSuccessModal";
import CashDepositEntrySection from "./CashDepositEntrySection";
import {
  useGenerateCashCode,
  useSavingsStatusUpdate,
} from "../../hooks/useSavingsMutations";
import { useOwnerRecentCash, useOwnerSearchUsers } from "../hooks/useOwnerData";
import {
  buildLocalUsers,
  calculateCustomerBalance,
  mergeAndFilterUsers,
  normalizeApiUsers,
} from "./cashDepositUtils";

const CashDeposit = () => {
  const [depositAmount, setDepositAmount] = useState(5000);
  const [step, setStep] = useState("idle");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const quickAmounts = [1000, 2000, 5000, 10000];
  const recentCashQuery = useOwnerRecentCash();
  const searchUsersQuery = useOwnerSearchUsers(searchTerm.trim());
  const updateStatusMutation = useSavingsStatusUpdate();
  const generateCodeMutation = useGenerateCashCode();

  const recentDepositsRaw = Array.isArray(recentCashQuery.data?.data)
    ? recentCashQuery.data.data
    : Array.isArray(recentCashQuery.data)
      ? recentCashQuery.data
      : [];

  const localUsers = useMemo(() => buildLocalUsers(recentDepositsRaw), [recentDepositsRaw]);

  const apiUsers = useMemo(
    () => normalizeApiUsers(searchUsersQuery.data),
    [searchUsersQuery.data],
  );

  const searchResults = useMemo(
    () => mergeAndFilterUsers({ apiUsers, localUsers, searchTerm }),
    [apiUsers, localUsers, searchTerm],
  );

  useEffect(() => {
    if (selectedCustomer) {
      const stillExists = searchResults.some((item) => item?.id === selectedCustomer?.id);
      if (!stillExists && searchResults.length > 0) {
        setSelectedCustomer(searchResults[0]);
      }
      return;
    }

    if (searchResults.length > 0) {
      setSelectedCustomer(searchResults[0]);
    }
  }, [searchResults, selectedCustomer]);

  const selectedCustomerBalance = useMemo(
    () =>
      calculateCustomerBalance({
        deposits: recentDepositsRaw,
        selectedCustomer,
      }),
    [recentDepositsRaw, selectedCustomer],
  );

  const currentBalance = selectedCustomerBalance;
  const newBalance = currentBalance + Number(depositAmount);

  const depositData = {
    customerName:
      `${selectedCustomer?.first_name || ""} ${selectedCustomer?.last_name || ""}`.trim() ||
      "Unknown User",
    phone: selectedCustomer?.phone || "-",
    amount: depositAmount,
    code: "CD764VQ1",
  };

  const showDepositSection = step !== "success" && depositAmount > 0;
  const recentDeposits = recentDepositsRaw.map((item) => ({
    ...item,
    status: item.status || "Pending",
  }));

  const handleMarkCompleted = async (item) => {
    try {
      await updateStatusMutation.mutateAsync({
        transactionId: item?.id,
        status: "Completed",
      });
      toast.success("Deposit status updated.");
    } catch (error) {
      toast.error(error.message || "Failed to update deposit status.");
    }
  };

  const handleGenerateCode = async (item) => {
    try {
      const response = await generateCodeMutation.mutateAsync({
        transactionId: item?.id,
      });
      const code =
        response?.approval_code ||
        response?.data?.approval_code ||
        response?.code ||
        response?.data?.code;

      if (!code) {
        toast.error("Approval code was not returned by server.");
        return;
      }

      toast.success(`Approval code: ${code}`);
    } catch (error) {
      if (String(error?.message || "").toLowerCase().includes("pending cash transaction not found")) {
        await recentCashQuery.refetch();
        toast.error("Transaction is no longer pending. List refreshed.");
        return;
      }
      toast.error(error.message || "Failed to generate approval code.");
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
          onGenerateCode={handleGenerateCode}
          isUpdating={updateStatusMutation.isPending}
          isGeneratingCode={generateCodeMutation.isPending}
        />

        <ConfirmDepositModal
          isOpen={step === "confirming"}
          onClose={() => setStep("idle")}
          onConfirm={() => setStep("success")}
          data={depositData}
        />

        <DepositSuccessModal
          isOpen={step === "success"}
          onClose={() => {
            setDepositAmount(0);
            setStep("idle");
          }}
          data={depositData}
        />
      </div>
    </div>
  );
};

export default CashDeposit;
