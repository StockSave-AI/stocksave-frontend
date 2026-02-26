import { useEffect, useMemo, useRef, useState } from "react";
import { FiCreditCard, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddBankAccount from "./AddBankAccount";
import WithdrawalForm from "./WithdrawalForm";
import BankWithdrawalMessage from "./BankWithdrawalMessage";
import WithdrawalConfirmModal from "./WithdrawalConfirmModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { formatCurrency } from "../../../utils/currency";
import { useWithdraw } from "../../hooks/useWithdraw";
import { useCustomerSummary } from "../../hooks/useCustomerSummary";
import { useSavingsBanks, useSavingsRedeem } from "../../hooks/useSavingsMutations";
import useSavingsBalance from "../../hooks/useSavingsBalance";

const QUICK_AMOUNTS = [5000, 10000, 20000, 60000];
const REDEEM_ACCOUNTS_KEY = "redeem_bank_accounts";

const normalizeAccount = (item = {}) => ({
  bankCode: item?.bankCode || item?.bank_code || item?.code || "",
  bankName: item?.bankName || item?.bank_name || item?.name || "",
  accountName: item?.accountName || item?.account_name || "",
  accountNumber: item?.accountNumber || item?.account_number || "",
});

const getSavedAccounts = () => {
  const persisted = JSON.parse(localStorage.getItem(REDEEM_ACCOUNTS_KEY) || "[]");
  if (!Array.isArray(persisted)) return [];
  const normalized = persisted
    .map(normalizeAccount)
    .filter((item) => item.accountNumber);
  if (normalized.length === 0) return [];
  return [normalized[normalized.length - 1]];
};

const saveAccounts = (accounts = []) => {
  localStorage.setItem(REDEEM_ACCOUNTS_KEY, JSON.stringify(accounts));
};

const getInitialAccountState = () => {
  const initialAccounts = getSavedAccounts();
  return {
    accounts: initialAccounts,
    selectedAccount: initialAccounts.length > 0 ? 0 : null,
  };
};

const Redeem = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("bank");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accounts, setAccounts] = useState(() => getInitialAccountState().accounts);
  const [selectedAccount, setSelectedAccount] = useState(
    () => getInitialAccountState().selectedAccount,
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAccountIndex, setDeleteAccountIndex] = useState(null);
  const [editingAccountIndex, setEditingAccountIndex] = useState(null);
  const [errors, setErrors] = useState({
    method: false,
    amount: false,
    account: false,
  });
  const successTimeoutRef = useRef(null);

  const withdrawMutation = useWithdraw();
  const { data: summaryResponse } = useCustomerSummary();
  const savingsBalanceQuery = useSavingsBalance();
  const savingsBanksQuery = useSavingsBanks();
  const savingsRedeemQuery = useSavingsRedeem();

  const summary = summaryResponse?.data || {};
  const fallbackBalance = Number(summary?.summary_cards?.total_savings || 0);
  const balanceFromApi =
    savingsBalanceQuery.data?.data?.balance ?? savingsBalanceQuery.data?.balance;
  const availableBalance = Number.isFinite(balanceFromApi)
    ? Number(balanceFromApi)
    : Math.max(0, fallbackBalance);

  const quickAmounts = useMemo(() => {
    const payload = savingsRedeemQuery.data?.data || savingsRedeemQuery.data || {};
    const amounts = payload.preset_amounts || payload.quick_amounts || payload.amounts || [];
    if (!Array.isArray(amounts) || amounts.length === 0) return QUICK_AMOUNTS;
    return amounts.map((value) => Number(value)).filter((value) => Number.isFinite(value));
  }, [savingsRedeemQuery.data]);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  const handleMethodChange = (nextMethod) => {
    setMethod(nextMethod);
    setSuccessMessage("");
    setSuccessDetails(null);
    setErrors((prev) => ({ ...prev, method: false, account: false }));
  };

  const handleSelectAmount = (value) => {
    setSelectedAmount(value);
    setSuccessMessage("");
    setSuccessDetails(null);
    setErrors((prev) => ({ ...prev, amount: false }));
  };

  const validateSubmission = () => {
    const hasMethod = Boolean(method);
    const amountValue = Number(selectedAmount || 0);
    const hasValidAmount = Number.isFinite(amountValue) && amountValue > 0;
    const requiresAccount = method === "bank";
    const hasAccount = selectedAccount !== null && accounts[selectedAccount];

    const nextErrors = {
      method: !hasMethod,
      amount: !hasValidAmount,
      account: requiresAccount && !hasAccount,
    };

    setErrors(nextErrors);
    return !(nextErrors.method || nextErrors.amount || nextErrors.account);
  };

  const handleSubmit = () => {
    if (!validateSubmission()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    const amount = Number(selectedAmount || 0);
    const selectedBank = accounts[selectedAccount] || null;

    if (method === "cash") {
      setShowConfirmModal(false);
      setSuccessMessage("Follow the cash pickup instructions to complete redemption.");
      setSuccessDetails(null);
      return;
    }

    try {
      const response = await withdrawMutation.mutateAsync({
        amount,
        account_name: selectedBank?.accountName,
        account_number: selectedBank?.accountNumber,
        bank_code: selectedBank?.bankCode,
      });

      setShowConfirmModal(false);
      toast.success("Withdrawal successful.");
      setSuccessMessage(
        "Your withdrawal request has been received. The funds will be processed shortly.",
      );
      setSuccessDetails(response?.data || response || null);
      successTimeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSuccessDetails(null);
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
    setSuccessDetails(null);
    setShowConfirmModal(false);
    setErrors({ method: false, amount: false, account: false });
  };

  const handleSaveAccount = (newAccount) => {
    const normalized = normalizeAccount(newAccount);
    const nextAccounts =
      Number.isInteger(editingAccountIndex) && accounts[editingAccountIndex]
        ? accounts.map((item, idx) => (idx === editingAccountIndex ? normalized : item))
        : [normalized];
    setAccounts(nextAccounts);
    saveAccounts(nextAccounts);
    setSelectedAccount(0);
    setEditingAccountIndex(null);
    setShowAddAccount(false);
  };

  const handleEditAccount = (index) => {
    if (!accounts[index]) return;
    setEditingAccountIndex(index);
    setShowAddAccount(true);
  };

  const handleDeleteAccount = (index) => {
    if (!accounts[index]) return;
    setDeleteAccountIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    const index = Number(deleteAccountIndex);
    if (!Number.isInteger(index) || !accounts[index]) {
      setShowDeleteModal(false);
      setDeleteAccountIndex(null);
      return;
    }
    const nextAccounts = accounts.filter((_, idx) => idx !== index);
    setAccounts(nextAccounts);
    saveAccounts(nextAccounts);

    if (nextAccounts.length === 0) {
      setSelectedAccount(null);
      return;
    }

    if (selectedAccount === index) {
      setSelectedAccount(0);
      return;
    }

    if (selectedAccount > index) {
      setSelectedAccount(selectedAccount - 1);
    }

    setShowDeleteModal(false);
    setDeleteAccountIndex(null);
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
          <p className="text-xs text-neutral-500">
            Processing time: 2-5 business days
          </p>
        </div>
      </div>

      {!showAddAccount ? (
        <WithdrawalForm
          method={method}
          onMethodChange={handleMethodChange}
          selectedAmount={selectedAmount}
          onSelectAmount={handleSelectAmount}
          quickAmounts={quickAmounts}
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelectAccount={setSelectedAccount}
          onAddAccount={() => {
            setEditingAccountIndex(null);
            setShowAddAccount(true);
          }}
          onEditAccount={handleEditAccount}
          onDeleteAccount={handleDeleteAccount}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={withdrawMutation.isPending}
          errors={errors}
          accountsLoading={savingsBanksQuery.isLoading}
          accountsError={savingsBanksQuery.isError}
        />
      ) : null}

      {successMessage ? (
        <BankWithdrawalMessage
          message={successMessage}
          details={successDetails}
          onClose={() => {
            setSuccessMessage("");
            setSuccessDetails(null);
          }}
        />
      ) : null}

      {showConfirmModal ? (
        <WithdrawalConfirmModal
          amountLabel={formatCurrency(selectedAmount)}
          methodLabel={method === "bank" ? "Bank Transfer" : "Cash Pickup"}
          onConfirm={handleConfirmWithdrawal}
          onCancelToDashboard={() => navigate("/dashboard")}
          onClose={() => setShowConfirmModal(false)}
          isSubmitting={withdrawMutation.isPending}
        />
      ) : null}

      {showAddAccount ? (
        <AddBankAccount
          bankOptions={savingsBanksQuery.data?.data || savingsBanksQuery.data || []}
          initialData={
            Number.isInteger(editingAccountIndex) ? accounts[editingAccountIndex] : null
          }
          onClose={() => {
            setShowAddAccount(false);
            setEditingAccountIndex(null);
          }}
          onSave={handleSaveAccount}
        />
      ) : null}

      <DeleteAccountModal
        isOpen={showDeleteModal}
        account={
          Number.isInteger(deleteAccountIndex) ? accounts[deleteAccountIndex] : null
        }
        isDeleting={false}
        onConfirm={confirmDeleteAccount}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteAccountIndex(null);
        }}
      />
    </div>
  );
};

export default Redeem;
