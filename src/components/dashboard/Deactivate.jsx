import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../services/auth";
import { FiAlertCircle, FiKey } from "react-icons/fi";
import { clearAuthToken } from "../../utils/authStorage";

import toast from "react-hot-toast";
import { usePlans, usePausePlan } from "../hooks/usePlans";

function DeactivateAccount() {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);
  const { data: plansData } = usePlans();
  const pausePlanMutation = usePausePlan();
  const activePlanId = plansData?.data?.current_plan?.id;
  const handleDeactivate = async () => {
    if (!reason) {
      toast.error("Please select a reason for leaving.");
      return;
    }

    if (!confirm) {
      toast.error("You must confirm this action.");
      return;
    }

    setLoading(true);
    try {
      await deleteAccount();
      clearAuthToken();
      toast.success("Account deactivated successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePausePlan = async () => {
    if (!activePlanId) {
      toast.error("No active plan to pause.");
      return;
    }

    setPauseLoading(true);
    try {
      await pausePlanMutation.mutateAsync(activePlanId);
      toast.success("Plan paused.");
    } catch (error) {
      toast.error(error.message || "Unable to pause plan.");
    } finally {
      setPauseLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {}

      <div className="flex border-2 border-red-400 bg-red-100 rounded-lg overflow-hidden">
        <div className="bg-red-600 flex items-center justify-center p-4">
          <FiAlertCircle className="text-white text-2xl" />
        </div>

        <div className="flex flex-col justify-center p-4 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-800 text-lg">
              Deactivate Your Account
            </span>
            <FiKey className="text-red-800 text-lg" />
          </div>
          <p className="text-red-800">
            We're sorry to see you go. Please note that deactivating your
            account is permanent and cannot be undone.
          </p>
        </div>
      </div>

      {}
      <div className="border border-neutral-200 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold">Your Account Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Total Savings Balance</div>
          <div className="text-green-600 font-medium">₦10,000.00</div>
          <div>Active Payment Plans</div>
          <div>1 Plan</div>
          <div>Pending Bookings</div>
          <div>2 Bookings</div>
          <div>Member Since</div>
          <div>January 2025</div>
        </div>
      </div>

      {}
      <div className="border border-neutral-200 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold">What Happens When You Deactivate?</h3>
        <ul className="list-none space-y-1 text-sm text-neutral-700">
          <li>❌ Your savings balance will be forfeited</li>
          <li>❌ All pending bookings will be cancelled</li>
          <li>❌ Your payment plan will be terminated</li>
          <li>❌ All personal data will be deleted</li>
        </ul>
      </div>

      {}
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold">Before You Deactivate</h3>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Withdraw Your Savings (₦125,000)</li>
          <li>Complete or Cancel Pending Bookings</li>
          <li>Cancel Active Payment Plans</li>
        </ol>
      </div>

      {}
      <div className="border border-neutral-200 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold">Why are you leaving?</h3>
        <div className="flex flex-col gap-2">
          {[
            "No longer need the service",
            "Found a better alternative",
            "Too expensive",
            "Difficult to use",
            "Privacy concerns",
            "Other (please specify)",
          ].map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name="reason"
                value={option}
                checked={reason === option}
                onChange={() => setReason(option)}
                className="accent-primary-500"
              />
              {option}
            </label>
          ))}
        </div>

        <textarea
          placeholder="Additional Feedback (Optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full mt-2 border border-neutral-300 rounded-lg p-2 text-sm"
        />
      </div>

      {}
      <div className="border border-neutral-200 rounded-lg p-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={confirm}
          onChange={() => setConfirm(!confirm)}
          className="accent-red-500"
        />
        <p className="text-sm">
          I understand that this action is permanent and cannot be undone.
        </p>
      </div>

      {}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleDeactivate}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white ${
            loading
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Deactivating..." : "Deactivate Account"} {}
        </button>
      </div>

      {}
      <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg text-sm space-y-2">
        <p>
          Not sure about leaving? Instead of deactivating, you can pause your
          account temporarily or adjust your payment plan.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePausePlan}
            disabled={pauseLoading}
            className={`px-4 py-2 text-white rounded-lg ${
              pauseLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Pause Account
          </button>
          <button
            className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeactivateAccount;
