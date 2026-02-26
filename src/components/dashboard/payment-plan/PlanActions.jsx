import { useState } from "react";
import { FiPauseCircle, FiEdit3, FiCreditCard } from "react-icons/fi";
import EditPlanModal from "./EditPlanModal";
import { useNavigate } from "react-router-dom";

export default function PlanActions({
  plan,
  openModalTick,
  onSubmitPlan,
  onPauseResume,
  isSubmitting,
}) {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [dismissedTick, setDismissedTick] = useState(0);
  const mode = plan ? "update" : "create";
  const isModalOpen = showEditModal || openModalTick > dismissedTick;

  const normalizedStatus = String(plan?.status || "").toLowerCase();
  const isActive = normalizedStatus === "active";

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={onPauseResume}
          disabled={!plan || isSubmitting}
          className="bg-error/10 text-error rounded-card p-6 text-center hover:bg-error/20 transition flex flex-col items-center gap-3 disabled:opacity-50"
        >
          <FiPauseCircle size={28} />
          <div>
          <p className="font-semibold">
            {isActive ? "Pause Plan" : "Resume Plan"}
          </p>
          <p className="text-sm">
            {isActive
              ? "Temporarily pause contributions"
              : "Start a new plan from these settings"}
          </p>
          </div>
        </button>

        <button
          className="bg-secondary-100 text-secondary-600 rounded-card p-6 text-center hover:bg-secondary-200 transition flex flex-col items-center gap-3"
          onClick={() => setShowEditModal(true)}
          disabled={isSubmitting}
        >
          <FiEdit3 size={28} />
          <div>
            <p className="font-semibold">
              {mode === "create" ? "Create Plan" : "Modify Plan"}
            </p>
            <p className="text-sm">
              {mode === "create"
                ? "Set up your savings plan"
                : "Change amount or frequency"}
            </p>
          </div>
        </button>

        <button
          className="bg-primary-500 text-white rounded-card p-6 text-center hover:bg-primary-600 transition flex flex-col items-center gap-3"
          onClick={() => navigate("/dashboard/add-savings")}
        >
          <FiCreditCard size={28} />
          <div>
            <p className="font-semibold">Make Payment</p>
            <p className="text-sm">Pay early or extra</p>
          </div>
        </button>
      </div>

      {isModalOpen && (
        <EditPlanModal
          mode={mode}
          plan={plan}
          onClose={() => {
            setShowEditModal(false);
            setDismissedTick(openModalTick);
          }}
          isSubmitting={isSubmitting}
          onSubmit={async (payload) => {
            const didSave = await onSubmitPlan({ mode, payload });
            if (didSave) {
              setShowEditModal(false);
            }
          }}
        />
      )}
    </>
  );
}
