import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";
import SignupHeader from "./SignupHeader";
import toast from "react-hot-toast";

function ResetPassword() {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = (data) => {
    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password reset successfully!");
    navigate("/login");
  };

  return (
    <>
      <SignupHeader text="Reset Password" />

      <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-2">
        <div className="bg-green-100 rounded-full p-4 flex items-center justify-center">
          <FiCheck className="text-green-700 w-6 h-6" />
        </div>

        <h2 className="text-lg font-semibold text-center text-neutral-800 mt-2">
          OTP Verified
        </h2>

        <p className="text-sm text-center text-neutral-500 mt-1">
          Now create a new password for your account.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              placeholder="Enter new password"
              className="w-full bg-neutral-100 border border-neutral-300 rounded-button p-3 outline-none focus:border-primary-500 pr-10"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </span>
            {password && password.length < 8 && (
              <p className="text-xs text-red-500 mt-1">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm New Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword", { required: true })}
              placeholder="Re-enter new password"
              className="w-full bg-neutral-100 border border-neutral-300 rounded-button p-3 outline-none focus:border-primary-500 pr-10"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FiEye /> : <FiEyeOff />}
            </span>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <ActionButton text="Reset Password" />
        </form>

        <p
          onClick={() => navigate("/")}
          className="mt-4 text-center text-sm text-primary-600 cursor-pointer hover:underline"
        >
          ← Back to Home
        </p>
      </div>
    </>
  );
}

export default ResetPassword;
