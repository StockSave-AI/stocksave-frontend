import React from "react";

const CashActionButtons = ({ onConfirm, onCancel }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <button
        onClick={onCancel}
        className="flex-1 py-4 px-6 rounded-button border-2 border-neutral-200 font-bold text-neutral-900 hover:bg-neutral-100 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-[1.5] py-4 px-6 rounded-button bg-primary-400 text-white font-bold hover:bg-primary-500 transition-colors shadow-lg"
      >
        Confirm Deposit
      </button>
    </div>
  );
};

export default CashActionButtons;
