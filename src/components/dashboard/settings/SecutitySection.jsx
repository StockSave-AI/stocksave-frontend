import { useState } from "react";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";
import SectionCard from "./SectionCard";
import ActionButtons from "./ActionButtons";
import PasswordField from "./PasswordField";
import { useChangePassword } from "../../hooks/useSecurity";

export default function SecuritySection() {
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

  const onChangeField = (key, value) => {
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
    <SectionCard icon={<FaLock />} title="Security">
      <div className="space-y-4">
        <PasswordField
          placeholder="Current Password"
          value={form.current_password}
          onChange={(e) => onChangeField("current_password", e.target.value)}
          show={show.current}
          onToggle={() => setShow((prev) => ({ ...prev, current: !prev.current }))}
          disabled={isBusy}
        />
        <PasswordField
          placeholder="New Password"
          value={form.new_password}
          onChange={(e) => onChangeField("new_password", e.target.value)}
          show={show.next}
          onToggle={() => setShow((prev) => ({ ...prev, next: !prev.next }))}
          disabled={isBusy}
        />
        <PasswordField
          placeholder="Confirm New Password"
          value={form.confirm_password}
          onChange={(e) => onChangeField("confirm_password", e.target.value)}
          show={show.confirm}
          onToggle={() => setShow((prev) => ({ ...prev, confirm: !prev.confirm }))}
          disabled={isBusy}
        />
      </div>
      <ActionButtons
        primary={isBusy ? "Updating..." : "Update Password"}
        single
        onPrimary={handleSubmit}
        primaryDisabled={isBusy}
      />
    </SectionCard>
  );
}
