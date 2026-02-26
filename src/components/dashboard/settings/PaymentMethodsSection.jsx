import { useState, useEffect } from "react";
import { FaCreditCard } from "react-icons/fa";
import SectionCard from "./SectionCard";
import AddBankAccount from "../redeem/AddBankAccount";
import { getBankAccounts } from "../../services/customer";
import { getAuthToken } from "../../../utils/authStorage";

const normalizeBankAccounts = (response) => {
  const source =
    response?.data?.banks ||
    response?.data?.accounts ||
    response?.data ||
    response?.accounts ||
    response?.banks ||
    response;

  if (!Array.isArray(source)) return [];
  if (source.length === 0) return [];
  return [source[source.length - 1]];
};

export default function PaymentMethodsSection() {
  const token = getAuthToken();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!token) return undefined;

    getBankAccounts(token)
      .then((response) => {
        if (!isMounted) return;
        setAccounts(normalizeBankAccounts(response));
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Failed to fetch bank accounts:", error);
        setAccounts([]);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleEdit = (index) => {
    setEditingAccount(index);
    setShowAddAccount(true);
  };

  const handleSave = (newAccount) => {
    const normalized = {
      accountNumber:
        newAccount?.accountNumber || newAccount?.account_number || "",
      bankName: newAccount?.bankName || newAccount?.bank_name || "",
      bankCode: newAccount?.bankCode || newAccount?.bank_code || "",
      accountName: newAccount?.accountName || newAccount?.account_name || "",
    };
    if (editingAccount !== null) {
      const updatedAccounts = [...accounts];
      updatedAccounts[editingAccount] = normalized;
      setAccounts(updatedAccounts);
      setEditingAccount(null);
    } else {
      setAccounts([normalized]);
    }
    setShowAddAccount(false);
  };

  return (
    <SectionCard icon={<FaCreditCard />} title="Payment Methods">
      {accounts.length === 0 ? (
        <p className="text-sm text-neutral-500 mb-3">No bank accounts found.</p>
      ) : null}

      {accounts.map((account, idx) => (
        <div
          key={account.id || idx}
          className="flex justify-between items-center border p-4 rounded-xl mb-3"
        >
          <div>
            <p className="font-medium">
              **** **** **** {String(account.accountNumber || "").slice(-4)}
            </p>
            <p className="text-sm text-neutral-500">{account.bankName}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-neutral-200 px-2 py-1 rounded">
              PRIMARY
            </span>
            <button
              className="text-sm text-blue-600"
              onClick={() => handleEdit(idx)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      {accounts.length === 0 ? (
        <button
          className="border px-4 py-2 rounded-lg hover:bg-neutral-100 text-sm mb-3"
          onClick={() => {
            setEditingAccount(null);
            setShowAddAccount(true);
          }}
        >
          + Add Method
        </button>
      ) : null}

      {showAddAccount && (
        <AddBankAccount
          initialData={
            editingAccount !== null ? accounts[editingAccount] : null
          }
          onClose={() => {
            setShowAddAccount(false);
            setEditingAccount(null);
          }}
          onSave={handleSave}
        />
      )}
    </SectionCard>
  );
}
