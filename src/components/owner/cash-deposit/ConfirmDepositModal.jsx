import React from "react";

const ConfirmDepositModal = ({ isOpen, onClose, onConfirm, data }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md md:max-w-2xl rounded-card shadow-2xl p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300
                   flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 md:w-12 md:h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white mb-3 md:mb-4 shadow-lg shadow-secondary-200">
            <span className="text-xl md:text-xl font-bold">₦</span>
          </div>
          <h3 className="text-h3 md:text-h3 text-neutral-900 mb-1 md:mb-2 text-center">
            Confirm Cash Deposit
          </h3>
          <p className="text-neutral-500 text-xs md:text-sm text-center">
            Please verify the details before submitting
          </p>
        </div>

        <div className="bg-neutral-50/50 border border-neutral-100 rounded-xl p-4 md:p-6 mb-6 space-y-4 md:space-y-5 overflow-y-auto max-h-[50vh]">
          <div className="border-b border-neutral-200 pb-2 md:pb-3">
            <p className="text-[9px] md:text-[10px] text-neutral-400 uppercase font-medium mb-1">
              Customer
            </p>
            <p className="font-bold text-neutral-900 text-sm md:text-base">
              {data?.customerName}
            </p>
            <p className="text-neutral-500 text-[10px] md:text-sm">
              {data?.phone}
            </p>
          </div>

          <div className="border-b border-neutral-200 pb-2 md:pb-3">
            <p className="text-[9px] md:text-[10px] text-neutral-400 uppercase font-medium mb-1">
              Deposit Amount
            </p>
            <p className="font-bold text-secondary-500 text-lg ">
              ₦{data?.amount.toLocaleString()}
            </p>
          </div>

          <div className="border-b border-neutral-200 pb-2 md:pb-3">
            <p className="text-[9px] md:text-[10px] text-neutral-400 uppercase font-medium mb-1">
              Confirmation Code
            </p>
            <p className="font-bold text-neutral-900 text-sm md:text-base uppercase tracking-wider">
              {data?.code}
            </p>
            <p className="text-neutral-400 text-[8px] md:text-[9px]">
              Give this code to the customer
            </p>
          </div>

          <div>
            <p className="text-[9px] md:text-[10px] text-neutral-400 uppercase font-medium mb-1">
              Date & Time
            </p>
            <p className="text-neutral-800 text-sm  font-medium">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 md:py-3 px-4 md:px-5 rounded-button border border-neutral-300 font-bold text-neutral-700 hover:bg-neutral-50 transition-colors text-sm md:text-sm"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 md:py-3 px-4 md:px-5 rounded-button bg-primary-400 text-white font-bold hover:bg-primary-500 transition-all shadow-md active:scale-95 text-sm md:text-sm"
          >
            Submit Deposit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDepositModal;
