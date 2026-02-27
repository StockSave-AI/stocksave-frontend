import { useState } from "react";
import toast from "react-hot-toast";
import { FaLock, FaSave } from "react-icons/fa";
import PasswordField from "../../dashboard/settings/PasswordField";
import { useChangePassword } from "../../hooks/useSecurity";
import SectionHeader from "./SectionHeader";

const SecuritySection = () => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const changePasswordMutation = useChangePassword();

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.current_password || !form.new_password || !form.confirm_password) {
      toast.error("All password fields are required.");
      return;
    }
    if (form.new_password.length < 10) {
      toast.error("New password must be at least 10 characters.");
      return;
    }
    if (form.new_password !== form.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });
      toast.success("Password changed successfully.");
      resetForm();
    } catch (error) {
      toast.error(error?.message || "Failed to change password.");
    }
  };

  const isBusy = changePasswordMutation.isPending;

  return (
    <section className="bg-white rounded-card shadow-card border border-neutral-100 p-6 md:p-8">
      <SectionHeader icon={FaLock} title="Security" colorClass="bg-primary-500" />

      <div className="space-y-4">
        <PasswordField
          placeholder="Current Password"
          value={form.current_password}
          onChange={(e) => updateField("current_password", e.target.value)}
          show={show.current}
          onToggle={() => setShow((prev) => ({ ...prev, current: !prev.current }))}
          disabled={isBusy}
        />
        <PasswordField
          placeholder="New Password"
          value={form.new_password}
          onChange={(e) => updateField("new_password", e.target.value)}
          show={show.next}
          onToggle={() => setShow((prev) => ({ ...prev, next: !prev.next }))}
          disabled={isBusy}
        />
        <PasswordField
          placeholder="Confirm New Password"
          value={form.confirm_password}
          onChange={(e) => updateField("confirm_password", e.target.value)}
          show={show.confirm}
          onToggle={() => setShow((prev) => ({ ...prev, confirm: !prev.confirm }))}
          disabled={isBusy}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isBusy}
          className="bg-primary-400 text-white px-8 py-3 rounded-button font-bold flex items-center gap-2 hover:bg-primary-500 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaSave />
          {isBusy ? "Updating..." : "Update Password"}
        </button>
      </div>
    </section>
  );
};

export default SecuritySection;
