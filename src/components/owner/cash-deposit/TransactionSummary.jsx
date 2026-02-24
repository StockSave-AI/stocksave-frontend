import React from "react";

const TransactionSummary = ({ depositAmount, newBalance, currentBalance }) => {
  return (
    <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100">
      <h4 className="text-neutral-600 font-semibold mb-3 text-sm uppercase">
        Transaction Summary
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Customer:</span>
          <span className="font-bold text-neutral-800 text-right">
            John Doe
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Current Balance:</span>
          <span className="font-bold text-neutral-800 text-right">
            ₦{currentBalance.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Deposit Amount:</span>
          <span className="font-bold text-secondary-500 text-right">
            ₦{Number(depositAmount).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-neutral-200">
          <span className="font-bold text-neutral-900">New Balance:</span>
          <span className="text-h3 text-primary-500 font-bold text-right">
            ₦{newBalance.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
