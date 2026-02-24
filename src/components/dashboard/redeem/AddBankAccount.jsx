import { useState } from "react";
import { FiX } from "react-icons/fi";

const REDEEM_ACCOUNT_DRAFT_KEY = "redeem_account_draft";

const AddBankAccount = ({ onClose, onSave, initialData = null }) => {
  const persistedDraft = JSON.parse(
    localStorage.getItem(REDEEM_ACCOUNT_DRAFT_KEY) || "{}",
  );
  const [formData, setFormData] = useState({
    bankName: initialData?.bankName || persistedDraft.bankName || "",
    accountName: initialData?.accountName || persistedDraft.accountName || "",
    accountNumber: initialData?.accountNumber || persistedDraft.accountNumber || "",
  });

  const handleChange = (e) => {
    const nextForm = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(nextForm);
    localStorage.setItem(REDEEM_ACCOUNT_DRAFT_KEY, JSON.stringify(nextForm));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(formData);
    localStorage.removeItem(REDEEM_ACCOUNT_DRAFT_KEY);
  };

  return (
    <div className="bg-white p-6 rounded-card shadow-card border border-neutral-200 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-h3">Add Bank Account</h3>
        <button onClick={onClose}>
          <FiX className="text-neutral-500" size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            placeholder="e.g. Access Bank"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Account Name
          </label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Account Number
          </label>
          <input
            type="number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            placeholder="10-digit account number"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white border border-neutral-200 text-neutral-700 py-3 rounded-button font-semibold hover:bg-neutral-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 bg-primary-500 text-white py-3 rounded-button font-semibold hover:bg-primary-600 transition"
          >
            Save Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBankAccount;
