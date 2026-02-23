import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DepositSuccessModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => navigate("/owner/dashboard"), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md md:max-w-lg rounded-card shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="bg-secondary-550 text-white p-6 relative">
          <h2 className="text-h3 md:text-h2 font-bold">Deposit Recorded!</h2>
        </header>

        <div className="p-6 md:p-8 flex flex-col items-center text-center overflow-y-auto">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            <FaCheckCircle className="text-primary-500 w-8 h-8 md:w-10 md:h-10" />
          </div>

          <p className="text-neutral-500 text-sm md:text-base mb-6 md:mb-8">
            Cash deposit has been successfully added to customer's account
          </p>

          <div className="w-full bg-neutral-50 rounded-xl p-4 md:p-6 space-y-3 md:space-y-4 border border-neutral-100 overflow-y-auto max-h-[50vh]">
            <div>
              <p className="text-[9px] md:text-xs text-neutral-400 uppercase tracking-wider">
                Customer
              </p>
              <p className="font-bold text-neutral-900 text-sm md:text-lg">
                {data?.customerName}
              </p>
            </div>
            <div>
              <p className="text-[9px] md:text-xs text-neutral-400 uppercase tracking-wider">
                Amount Deposited
              </p>
              <p className="font-bold text-secondary-500 text-xl md:text-2xl">
                ₦{data?.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[9px] md:text-xs text-neutral-400 uppercase tracking-wider">
                Confirmation Code
              </p>
              <p className="font-bold text-neutral-900 text-sm md:text-lg uppercase">
                {data?.code}
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-8 flex items-center gap-2 text-neutral-400 text-sm italic">
            <div className="w-4 h-4 border-2 border-neutral-200 border-t-secondary-500 rounded-full animate-spin" />
            Redirecting to owner dashboard...
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositSuccessModal;
