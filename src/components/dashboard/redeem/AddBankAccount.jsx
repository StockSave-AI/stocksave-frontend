import { useState } from "react";
import { FiX } from "react-icons/fi";

const REDEEM_ACCOUNT_DRAFT_KEY = "redeem_account_draft";

const AddBankAccount = ({
  onClose,
  onSave,
  bankOptions = [],
  initialData = null,
}) => {
  const persistedDraft = JSON.parse(
    localStorage.getItem(REDEEM_ACCOUNT_DRAFT_KEY) || "{}",
  );

  const [formData, setFormData] = useState({
    bankCode: initialData?.bankCode || persistedDraft.bankCode || "",
    bankName: initialData?.bankName || persistedDraft.bankName || "",
    accountName: initialData?.accountName || persistedDraft.accountName || "",
    accountNumber:
      initialData?.accountNumber || persistedDraft.accountNumber || "",
  });

  const [errors, setErrors] = useState({
    bankCode: "",
    accountName: "",
    accountNumber: "",
  });

  const handleBankChange = (e) => {
    const selectedCode = e.target.value;
    const selectedBank = bankOptions.find(
      (bank) => String(bank.code || bank.id || bank.bankCode) === selectedCode,
    );

    const nextForm = {
      ...formData,
      bankCode: selectedCode,
      bankName:
        selectedBank?.name || selectedBank?.bankName || "",
    };

    setFormData(nextForm);
    localStorage.setItem(REDEEM_ACCOUNT_DRAFT_KEY, JSON.stringify(nextForm));
    setErrors((prev) => ({ ...prev, bankCode: "" }));
  };

  const handleChange = (e) => {
    const nextForm = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(nextForm);
    localStorage.setItem(REDEEM_ACCOUNT_DRAFT_KEY, JSON.stringify(nextForm));

    if (errors[e.target.name] && e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      bankCode: "",
      accountName: "",
      accountNumber: "",
    };

    if (!formData.bankCode || !formData.bankCode.trim()) {
      newErrors.bankCode = "Please select a bank";
    }

    if (!formData.accountName || !formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }

    if (!formData.accountNumber || !String(formData.accountNumber).trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (String(formData.accountNumber).length < 10) {
      newErrors.accountNumber = "Account number must be 10 digits";
    }

    setErrors(newErrors);

    return (
      !newErrors.bankCode && !newErrors.accountName && !newErrors.accountNumber
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const normalizedData = {
      bank_code: formData.bankCode,
      bank_name: formData.bankName,
      account_name: formData.accountName,
      account_number: String(formData.accountNumber),
    };

    onSave(normalizedData);
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
            Select Bank <span className="text-error">*</span>
          </label>
          <select
            name="bankSelect"
            value={formData.bankCode}
            onChange={handleBankChange}
            required
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none bg-white"
          >
            <option value="">-- Select a bank --</option>
            {bankOptions.map((bank) => (
              <option
                key={bank.code || bank.id || bank.bankCode}
                value={bank.code || bank.id || bank.bankCode}
              >
                {bank.name || bank.bankName}
              </option>
            ))}
          </select>
          {errors.bankCode && (
            <p className="text-sm text-error mt-1">{errors.bankCode}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            readOnly
            className="w-full px-4 py-3 rounded-button border border-neutral-200 bg-neutral-50 text-neutral-600"
            placeholder="Selected bank name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Account Name <span className="text-error">*</span>
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
          {errors.accountName && (
            <p className="text-sm text-error mt-1">{errors.accountName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Account Number <span className="text-error">*</span>
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
          {errors.accountNumber && (
            <p className="text-sm text-error mt-1">{errors.accountNumber}</p>
          )}
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
