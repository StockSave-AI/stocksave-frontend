import { useState, useEffect, useCallback, useRef } from "react";
import { FiCreditCard, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddBankAccount from "./AddBankAccount";
import WithdrawalForm from "./WithdrawalForm";
import BankWithdrawalMessage from "./BankWithdrawalMessage";
import WithdrawalConfirmModal from "./WithdrawalConfirmModal";
import { formatCurrency } from "../../../utils/currency";
import { useWithdraw } from "../../hooks/useWithdraw";
import { useCustomerSummary } from "../../hooks/useCustomerSummary";
import { useSavingsBanks, useSavingsRedeem } from "../../hooks/useSavingsMutations";
import { useSavingsHistory } from "../../hooks/useSavingsHistory";

const QUICK_AMOUNTS = [5000, 10000, 20000, 60000];
const REDEEM_ACCOUNTS_KEY = "redeem_bank_accounts";

const Redeem = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("bank");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const successTimeoutRef = useRef(null);
  const [errors, setErrors] = useState({
    method: false,
    amount: false,
    account: false,
  });
  const withdrawMutation = useWithdraw();
  const { data: summaryResponse } = useCustomerSummary();
  const summary = summaryResponse?.data || {};
  const userId = summary?.profile?.id;
  const savingsBanksQuery = useSavingsBanks();
  const savingsRedeemQuery = useSavingsRedeem();
  const savingsHistoryQuery = useSavingsHistory(userId);
  const quickAmounts = (() => {
    const payload = savingsRedeemQuery.data?.data || savingsRedeemQuery.data || {};
    const amounts = payload.preset_amounts || payload.quick_amounts || payload.amounts || [];
    if (Array.isArray(amounts) && amounts.length > 0) {
      return amounts.map((value) => Number(value)).filter((value) => Number.isFinite(value));
    }
    return QUICK_AMOUNTS;
  })();

  const fetchRedeemData = useCallback(async () => {
    const persistedAccounts = JSON.parse(
      localStorage.getItem(REDEEM_ACCOUNTS_KEY) || "[]",
    );
    const normalizedPersisted = Array.isArray(persistedAccounts)
      ? persistedAccounts.map((item) => ({
          bankName: item?.bankName || item?.name || "",
          bankCode: item?.bankCode || item?.code || "",
          accountName: item?.accountName || "",
          accountNumber: item?.accountNumber || "",
        }))
      : [];

    const mergedAccounts = [...normalizedPersisted];

    setAccounts(mergedAccounts);
    setSelectedAccount(mergedAccounts.length > 0 ? 0 : null);
  }, [savingsBanksQuery.data]);

  useEffect(() => {
    fetchRedeemData();
  }, [fetchRedeemData]);

  useEffect(() => {
    const history = Array.isArray(savingsHistoryQuery.data)
      ? savingsHistoryQuery.data
      : savingsHistoryQuery.data?.data || [];

    if (!Array.isArray(history) || history.length === 0) {
      setAvailableBalance(Number(summary?.summary_cards?.total_savings || 0));
      return;
    }

    const total = history.reduce((acc, tx) => {
      const status = String(tx?.status || "").toLowerCase();
      if (status !== "completed") return acc;
      const amount = Number(tx?.amount || 0);
      const type = String(tx?.type || tx?.transaction_type || "").toLowerCase();
      if (type.includes("withdraw")) return acc - amount;
      return acc + amount;
    }, 0);

    setAvailableBalance(total);
  }, [savingsHistoryQuery.data, summary?.summary_cards?.total_savings]);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleMethodChange = (nextMethod) => {
    setMethod(nextMethod);
    setSuccessMessage("");
    setErrors((prev) => ({ ...prev, method: false, account: false }));
  };

  const handleSelectAmount = (value) => {
    setSelectedAmount(value);
    setSuccessMessage("");
    setErrors((prev) => ({ ...prev, amount: false }));
  };

  const handleSubmit = () => {
    const hasMethod = Boolean(method);
    const amountValue = Number(selectedAmount || 0);
    const hasValidAmount = amountValue > 0;
    const requiresAccount = method === "bank";
    const hasAccount = selectedAccount !== null;

    const nextErrors = {
      method: !hasMethod,
      amount: !hasValidAmount,
      account: requiresAccount && !hasAccount,
    };

    setErrors(nextErrors);

    if (nextErrors.method || nextErrors.amount || nextErrors.account) {
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    const amount = Number(selectedAmount || 0);
    const selectedBankAccount =
      method === "bank" && selectedAccount !== null ? accounts[selectedAccount] : null;

    try {
      await withdrawMutation.mutateAsync({
        amount,
        account_name: selectedBankAccount?.accountName,
        account_number: selectedBankAccount?.accountNumber,
        bank_code: selectedBankAccount?.bankCode,
      });

      setShowConfirmModal(false);
      setSuccessMessage(
        "Your withdrawal request has been received. The funds will be processed shortly.",
      );
      await fetchRedeemData();
      successTimeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      toast.error(error.message || "Failed to submit withdrawal.");
    }
  };

  const handleCancel = () => {
    setMethod("bank");
    setSelectedAmount(null);
    setSuccessMessage("");
    setShowConfirmModal(false);
    setErrors({ method: false, amount: false, account: false });
  };

  return (
    <div className="space-y-6 p-6 bg-neutral-50 min-h-screen">
      <div className="bg-white p-6 rounded-card shadow-card border border-neutral-100">
        <h1 className="text-h2 text-neutral-800">Redeem Savings</h1>
        <p className="text-neutral-500 text-sm">
          Withdraw funds from your savings account
        </p>
      </div>

      <div className="bg-white p-6 rounded-card border border-neutral-200 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
            Available Balance
          </span>
          <p className="text-h1 text-neutral-800 mt-1">
            {formatCurrency(availableBalance)}
          </p>
        </div>
        <FiCreditCard className="text-neutral-300" size={40} />
      </div>

      <div className="bg-white p-4 rounded-card border border-neutral-200 flex items-center gap-3 text-neutral-600">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <FiInfo className="text-error" size={16} />
        </div>
        <div>
          <p className="font-semibold text-sm">Withdrawal Terms</p>
          <p className="text-xs text-neutral-500">Processing time: 2-5 business days</p>
        </div>
      </div>

      {!showAddAccount && (
      <WithdrawalForm
          method={method}
          onMethodChange={handleMethodChange}
          selectedAmount={selectedAmount}
          onSelectAmount={handleSelectAmount}
          quickAmounts={quickAmounts}
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelectAccount={setSelectedAccount}
          onAddAccount={() => setShowAddAccount(true)}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          errors={errors}
          accountsLoading={savingsBanksQuery.isLoading}
          accountsError={savingsBanksQuery.isError}
        />
      )}

      {successMessage && (
        <BankWithdrawalMessage
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {showConfirmModal && (
        <WithdrawalConfirmModal
          amountLabel={formatCurrency(selectedAmount)}
          methodLabel={method === "bank" ? "Bank Transfer" : "Cash Pickup"}
          onConfirm={handleConfirmWithdrawal}
          onCancelToDashboard={() => navigate("/dashboard")}
          onClose={() => setShowConfirmModal(false)}
          isSubmitting={withdrawMutation.isPending}
        />
      )}

      {showAddAccount && (
        <AddBankAccount
          bankOptions={savingsBanksQuery.data?.data || savingsBanksQuery.data || []}
          onClose={() => setShowAddAccount(false)}
          onSave={(newAccount) => {
            const nextAccounts = [...accounts, newAccount];
            setAccounts(nextAccounts);
            localStorage.setItem(REDEEM_ACCOUNTS_KEY, JSON.stringify(nextAccounts));
            setSelectedAccount(accounts.length);
            setShowAddAccount(false);
          }}
        />
      )}
    </div>
  );
};

export default Redeem;
