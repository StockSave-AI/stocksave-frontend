import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { useOwnerUsers } from "../hooks/useOwnerUsers";
import { updateSavingsStatus, verifySavings } from "../../services/savings";
import { useGenerateCashCode } from "../../hooks/useSavingsMutations";
import ApprovalCodeModal from "./ApprovalCodeModal";
import UserDetailsModal from "./UserDetailsModal";
import DepositsModal from "./DepositsModal";
import UsersMobileList from "./UsersMobileList";
import UsersDesktopTable from "./UsersDesktopTable";
import {
  STATUS_FILTERS,
  asList,
  fullName,
  isPaystackPending,
  isPendingDeposit,
} from "./userHelpers";

export default function ViewUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedDetailsUser, setSelectedDetailsUser] = useState(null);
  const [selectedDepositsUser, setSelectedDepositsUser] = useState(null);
  const [generatedCodeData, setGeneratedCodeData] = useState(null);
  const usersQuery = useOwnerUsers(search.trim());
  const generateCodeMutation = useGenerateCashCode();

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["owner-users"] }),
      queryClient.invalidateQueries({ queryKey: ["owner-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["owner-recent-cash"] }),
      queryClient.invalidateQueries({ queryKey: ["recent-savings"] }),
      queryClient.invalidateQueries({ queryKey: ["savings-history"] }),
      queryClient.invalidateQueries({ queryKey: ["customer-summary"] }),
    ]);
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ transactionId, nextStatus }) =>
      updateSavingsStatus({ transactionId, status: nextStatus }),
    onSuccess: async (_data, variables) => {
      const targetId = Number(variables?.transactionId);
      const nextStatus = variables?.nextStatus || "Completed";

      queryClient.setQueryData(["owner-recent-cash"], (previous) => {
        const source = previous?.data ?? previous;
        if (!Array.isArray(source)) return previous;
        const updated = source.map((item) =>
          Number(item?.id) === targetId ? { ...item, status: nextStatus } : item,
        );
        return previous?.data ? { ...previous, data: updated } : updated;
      });

      queryClient.setQueriesData({ queryKey: ["owner-users"] }, (previous) => {
        if (!Array.isArray(previous)) return previous;
        return previous.map((user) => {
          const transactions = asList(user?.transactions).map((tx) =>
            Number(tx?.id) === targetId ? { ...tx, status: nextStatus } : tx,
          );
          const latestPending = transactions.find(
            (tx) => String(tx?.status || "").toLowerCase() === "pending",
          );
          return { ...user, transactions, status: latestPending ? "Pending" : nextStatus };
        });
      });

      await invalidateAll();
      toast.success("Deposit status updated.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update deposit status.");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (reference) => verifySavings(reference),
    onSuccess: async () => {
      await invalidateAll();
      toast.success("Payment verified successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Verification failed.");
    },
  });

  const filteredUsers = useMemo(() => {
    const users = asList(usersQuery.data).filter((user) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      const name = fullName(user).toLowerCase();
      const phone = String(user?.phone || "").toLowerCase();
      return name.includes(term) || phone.includes(term);
    });

    if (status === "All") return users;
    return users.filter(
      (user) => String(user?.status || "").toLowerCase() === status.toLowerCase(),
    );
  }, [usersQuery.data, search, status]);

  const getPendingDeposit = (user) =>
    asList(user?.transactions).find((tx) => isPendingDeposit(tx));
  const getPendingPaystack = (user) =>
    asList(user?.transactions).find((tx) => isPaystackPending(tx));

  const handleApprove = async (tx) => {
    if (tx?.id === null || tx?.id === undefined || tx?.id === "") {
      toast.error("Deposit id is missing.");
      return;
    }
    await updateStatusMutation.mutateAsync({
      transactionId: tx.id,
      nextStatus: "Completed",
    });
    setOpenMenuId(null);
  };

  const handleReject = async (tx) => {
    if (tx?.id === null || tx?.id === undefined || tx?.id === "") {
      toast.error("Deposit id is missing.");
      return;
    }
    await updateStatusMutation.mutateAsync({
      transactionId: tx.id,
      nextStatus: "Rejected",
    });
    setOpenMenuId(null);
  };

  const handleVerify = async (tx) => {
    const reference = tx?.reference || tx?.payment_reference;
    if (!reference) {
      toast.error("No payment reference found for verification.");
      return;
    }
    await verifyMutation.mutateAsync(reference);
    setOpenMenuId(null);
  };

  const handleGenerateCode = async (tx) => {
    const transactionId = tx?.id || tx?.transactionId || tx?.transaction_id;
    if (!transactionId) {
      toast.error("Transaction id is missing.");
      return;
    }

    try {
      const response = await generateCodeMutation.mutateAsync({ transactionId });
      const code =
        response?.approval_code ||
        response?.data?.approval_code ||
        response?.code ||
        response?.data?.code;

      if (!code) {
        toast.error("Approval code was not returned by server.");
        return;
      }

      setGeneratedCodeData({ transactionId, code });
      toast.success("Approval code generated.");
    } catch (error) {
      if (
        String(error?.message || "")
          .toLowerCase()
          .includes("pending cash transaction not found")
      ) {
        await invalidateAll();
        toast.error("Transaction is no longer pending. Data refreshed.");
        return;
      }
      toast.error(error.message || "Failed to generate approval code.");
    } finally {
      setOpenMenuId(null);
    }
  };

  const toggleMenu = (userId) => {
    setOpenMenuId((previous) => (previous === userId ? null : userId));
  };

  const openDetails = (user) => {
    setSelectedDetailsUser(user);
    setOpenMenuId(null);
  };

  const openDeposits = (user) => {
    setSelectedDepositsUser(user);
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-card border border-neutral-100 shadow-card p-6">
        <h2 className="text-2xl font-semibold text-neutral-800">View Users</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Manage customer accounts and approve deposits.
        </p>
      </div>

      <div className="bg-white rounded-card border border-neutral-100 shadow-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or phone"
              className="w-full pl-10 pr-3 py-2 rounded-button border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-button border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {usersQuery.isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="h-9 w-9 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!usersQuery.isLoading && usersQuery.isError ? (
          <div className="h-48 flex items-center justify-center text-sm text-error">
            Failed to load users.
          </div>
        ) : null}

        {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-neutral-500">
            No users found.
          </div>
        ) : null}

        {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length > 0 ? (
          <div className="mt-4">
            <UsersMobileList
              users={filteredUsers}
              openMenuId={openMenuId}
              onToggleMenu={toggleMenu}
              getPendingDeposit={getPendingDeposit}
              getPendingPaystack={getPendingPaystack}
              onViewDetails={openDetails}
              onViewDeposits={openDeposits}
              onApprove={handleApprove}
              onReject={handleReject}
              onVerify={handleVerify}
              onGenerateCode={handleGenerateCode}
              updating={updateStatusMutation.isPending}
              verifying={verifyMutation.isPending}
              generatingCode={generateCodeMutation.isPending}
            />

            <UsersDesktopTable
              users={filteredUsers}
              openMenuId={openMenuId}
              onToggleMenu={toggleMenu}
              getPendingDeposit={getPendingDeposit}
              getPendingPaystack={getPendingPaystack}
              onViewDetails={openDetails}
              onViewDeposits={openDeposits}
              onApprove={handleApprove}
              onReject={handleReject}
              onVerify={handleVerify}
              onGenerateCode={handleGenerateCode}
              updating={updateStatusMutation.isPending}
              verifying={verifyMutation.isPending}
              generatingCode={generateCodeMutation.isPending}
            />
          </div>
        ) : null}
      </div>

      <UserDetailsModal
        user={selectedDetailsUser}
        onClose={() => setSelectedDetailsUser(null)}
      />
      <DepositsModal
        user={selectedDepositsUser}
        onClose={() => setSelectedDepositsUser(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onVerify={handleVerify}
        onGenerateCode={handleGenerateCode}
        generatingCode={generateCodeMutation.isPending}
        updating={updateStatusMutation.isPending}
        verifying={verifyMutation.isPending}
      />
      <ApprovalCodeModal
        data={generatedCodeData}
        onClose={() => setGeneratedCodeData(null)}
      />
    </div>
  );
}
