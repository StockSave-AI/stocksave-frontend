import { useState, useEffect, useCallback } from "react";
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

  return Array.isArray(source) ? source : [];
};

export default function PaymentMethodsSection() {
  const token = getAuthToken();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);

  const fetchAccounts = useCallback(async () => {
    if (!token) return;
    try {
      const response = await getBankAccounts(token);
      const bankAccounts = normalizeBankAccounts(response);
      setAccounts(bankAccounts);
    } catch (error) {
      console.error("Failed to fetch bank accounts:", error);
      setAccounts([]);
    }
  }, [token]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleEdit = (index) => {
    setEditingAccount(index);
    setShowAddAccount(true);
  };

  const handleSave = (newAccount) => {
    if (editingAccount !== null) {
      const updatedAccounts = [...accounts];
      updatedAccounts[editingAccount] = newAccount;
      setAccounts(updatedAccounts);
      setEditingAccount(null);
    } else {
      setAccounts([...accounts, newAccount]);
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

      <button
        className="border px-4 py-2 rounded-lg hover:bg-neutral-100 text-sm mb-3"
        onClick={() => {
          setEditingAccount(null);
          setShowAddAccount(true);
        }}
      >
        + Add Method
      </button>

      {showAddAccount && (
        <AddBankAccount
          initialData={editingAccount !== null ? accounts[editingAccount] : null}
          onClose={() => {
            setShowAddAccount(false);
            setEditingAccount(null);
          }}
          onSave={handleSave}
        />
      )}

      {!showAddAccount && (
        <div className="flex gap-4 mt-4">
          <button className="flex-1 bg-white text-neutral-700 py-3 rounded-button font-semibold border border-neutral-200 hover:bg-neutral-50 transition-colors">
            Cancel
          </button>

          <button className="flex-1 bg-success text-white py-3 rounded-button font-semibold hover:bg-green-700 transition-colors">
            Submit Withdrawal Request
          </button>
        </div>
      )}
    </SectionCard>
  );
}
