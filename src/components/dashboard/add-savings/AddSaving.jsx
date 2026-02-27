import { useEffect, useMemo, useRef, useState } from "react";
import { FiEye, FiEyeOff, FiTrendingUp } from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import { FaCreditCard, FaCashRegister } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PaymentMethodCard from "./PaymentMethodCard";
import PaystackForm from "./PaystackForm";
import CashDepositForm from "./CashDepositForm";
import RecentDeposits from "./RecentDeposits";
import { useCustomerSummary } from "../../hooks/useCustomerSummary";
import useSavingsBalance from "../../hooks/useSavingsBalance";
import { useRecentSavings } from "../../hooks/useRecentSavings";
import { useSavingsHistory } from "../../hooks/useSavingsHistory";
import { useMyBookings } from "../../hooks/useInventory";
import Loader from "../../ui/Loader";
import { formatDisplayDate } from "../../../utils/date";
import { formatCurrency } from "../../../utils/currency";
import { verifySavings } from "../../services/savings";

const quickAmounts = [1000, 2000, 5000, 10000];
const paystackInstructions = [
  "Pay with your credit, debit card, bank transfer or USSD",
  "Secured by Paystack",
  "Instant credit to your savings account",
];
const cashSteps = [
  "Visit our physical location or authorized agent",
  "Provide your registered phone number",
  "Deposit the cash to create a pending transaction",
  "Collect approval code from the owner",
  "Enter the owner code below to complete credit",
];

const mapRecentSavingsToDeposits = (items = []) => {
  return items
    .filter((item) => String(item.type || "").toLowerCase() === "deposit")
    .map((item, index) => ({
      id: item.id || index,
      amount: formatCurrency(Number.parseFloat(item.amount || 0)),
      source: item.method || "Savings",
      status: item.status || "Pending",
      date: formatDisplayDate(item.created_at || item.date, "-"),
    }));
};

const calculateCompletedBalance = (transactions = []) => {
  return transactions.reduce((total, tx) => {
    const status = String(tx?.status || "").toLowerCase();
    if (status !== "completed") return total;

    const amount = Number.parseFloat(tx?.amount || 0);
    const type = String(tx?.type || tx?.transaction_type || tx?.method || "").toLowerCase();

    if (type.includes("book")) return total;
    if (type.includes("withdraw")) return total - amount;
    return total + amount;
  }, 0);
};

export default function AddSavings() {
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState("paystack");
  const [showBalance, setShowBalance] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const attemptedVerifyRefs = useRef(new Set());

  const {
    data: summaryResponse,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useCustomerSummary();
  const savingsBalanceQuery = useSavingsBalance();
  const myBookingsQuery = useMyBookings();
  const {
    data: recentSavingsResponse,
    isLoading: recentSavingsLoading,
    isError: recentSavingsError,
  } = useRecentSavings();

  const summary = summaryResponse?.data || {};
  const savingsBalanceFromApi = summaryResponse?.data?.balance;
  const userId = summary?.profile?.id;
  const { data: historyResponse } = useSavingsHistory(userId);
  const history = Array.isArray(historyResponse) ? historyResponse : historyResponse?.data || [];
  const completedBalance = calculateCompletedBalance(history);
  const apiBalance =
    savingsBalanceQuery.data?.data?.balance ?? savingsBalanceQuery.data?.balance ?? savingsBalanceFromApi;

  const bookedTotal = (() => {
    const rows = Array.isArray(myBookingsQuery.data)
      ? myBookingsQuery.data
      : myBookingsQuery.data?.data || [];
    return rows.reduce((sum, row) => {
      const status = String(row?.status || "").toLowerCase();
      if (status === "cancelled") return sum;
      const amount =
        Number(row?.total_cost || row?.total || row?.amount || 0) || 0;
      return sum + amount;
    }, 0);
  })();

  const computedBalance =
    Number.isFinite(completedBalance) && history.length > 0
      ? completedBalance
      : Number(summary?.summary_cards?.total_savings || 0);

  const balance = Number.isFinite(apiBalance)
    ? Number(apiBalance)
    : Math.max(0, computedBalance - bookedTotal);

  const deposits = useMemo(() => {
    const recent = Array.isArray(recentSavingsResponse)
      ? recentSavingsResponse
      : recentSavingsResponse?.data || [];

    if (recent.length > 0) {
      return mapRecentSavingsToDeposits(recent);
    }

    const fromSummary = (summary?.recent_activity || []).filter(
      (item) => item.type === "Deposit",
    );

    return mapRecentSavingsToDeposits(fromSummary);
  }, [recentSavingsResponse, summary?.recent_activity]);

  useEffect(() => {
    const pendingPaystackRefs = history
      .filter((tx) => {
        const method = String(tx?.method || "").toLowerCase();
        const type = String(tx?.type || "").toLowerCase();
        const status = String(tx?.status || "").toLowerCase();
        return method === "paystack" && type === "deposit" && status === "pending" && tx?.reference;
      })
      .map((tx) => String(tx.reference))
      .filter((reference) => !attemptedVerifyRefs.current.has(reference))
      .slice(0, 3);

    if (pendingPaystackRefs.length === 0) return;

    pendingPaystackRefs.forEach((reference) => attemptedVerifyRefs.current.add(reference));

    (async () => {
      let hasSuccess = false;
      for (const reference of pendingPaystackRefs) {
        try {
          await verifySavings(reference);
          hasSuccess = true;
        } catch {
          // Keep silent here; normal error state remains visible in history.
        }
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-savings"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-history"] }),
        queryClient.invalidateQueries({ queryKey: ["savings-balance"] }),
      ]);

      if (hasSuccess) {
        toast.success("Pending Paystack payments synchronized.");
      }
    })();
  }, [history, queryClient]);

  if (summaryLoading) {
    return <Loader />;
  }

  if (summaryError) {
    return <div className="space-y-6">Failed to load savings data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary-500 shadow-[0_15px_30px_rgba(0,0,0,0.2)] text-white rounded-card p-4 md:p-6 flex justify-between items-center gap-3">
        <div>
          <h2 className="text-h3">Add to Your Savings</h2>
          <p className="text-sm opacity-90">Make a deposit to boost your savings</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <FiTrendingUp size={18} />
        </div>
      </div>

      <div className="bg-neutral-50 rounded-card shadow-card p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <p className="text-sm text-neutral-500">Current Balance</p>
            <div className="flex items-center gap-3">
              <h2 className="text-h2 font-semibold">
                {showBalance ? formatCurrency(balance) : "₦ ******"}
              </h2>
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? (
                  <FiEye className="text-neutral-500" size={18} />
                ) : (
                  <FiEyeOff className="text-neutral-500" size={18} />
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-400">Available for booking and withdrawal</p>
          </div>
          <div className="bg-primary-100 text-primary-600 h-10 w-10 rounded-full flex items-center justify-center font-semibold shrink-0">
            <FaNairaSign />
          </div>
        </div>

        <div className="bg-white rounded-card shadow-card p-4 border border-neutral-200 space-y-4">
          <h3 className="font-semibold text-neutral-700">Choose Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <PaymentMethodCard
              title="Paystack"
              description="Card, Bank, USSD"
              icon={<FaCreditCard size={20} />}
              active={selectedMethod === "paystack"}
              onClick={() => setSelectedMethod("paystack")}
              footerText="Credit secure payment"
              footerClass="text-xs text-neutral-400 mt-1"
            />
            <PaymentMethodCard
              title="Cash Deposit"
              description="Manual payment"
              icon={<FaCashRegister size={20} />}
              active={selectedMethod === "cash"}
              onClick={() => setSelectedMethod("cash")}
              footerText="1-2 days deposit"
              footerClass="text-xs text-neutral-400 mt-1"
            />
          </div>
        </div>
      </div>

      {selectedMethod === "paystack" ? (
        <PaystackForm
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          quickAmounts={quickAmounts}
          instructions={paystackInstructions}
        />
      ) : (
        <CashDepositForm
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          quickAmounts={quickAmounts}
          steps={cashSteps}
        />
      )}

      <RecentDeposits
        deposits={deposits}
        isLoading={recentSavingsLoading}
        isError={recentSavingsError}
      />
    </div>
  );
}

