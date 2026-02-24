import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ActionButton from "../ui/ActionButton";
import BottomLink from "../ui/BottomLink";
import PasswordInput from "../ui/PasswordInput";
import RoleSelector from "../ui/RoleSelector";
import SignupHeader from "../ui/SignupHeader";

import { signup as signupAPI } from "../services/auth";

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm();
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data) => {
    if (password.length < 10) {
      toast.error("Password must be at least 10 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!data.terms) {
      toast.error("You must agree to the terms");
      return;
    }

    setLoading(true);
    try {
      await signupAPI({ ...data, role });
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-card shadow-card overflow-hidden">
        <SignupHeader text="Create your account to start saving" />

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <RoleSelector role={role} setRole={setRole} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  First Name
                </label>
                <input
                  {...register("firstName", { required: true })}
                  placeholder="John"
                  className="w-full bg-neutral-100 border border-neutral-300 rounded-button p-3 outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Last Name
                </label>
                <input
                  {...register("lastName", { required: true })}
                  placeholder="Doe"
                  className="w-full bg-neutral-100 border border-neutral-300 rounded-button p-3 outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="john@example.com"
                className="w-full bg-neutral-100 border border-neutral-300 rounded-button p-3 outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Phone Number
              </label>
              <input
                {...register("phone")}
                placeholder="+23480000000"
                className="w-full bg-neutral-100 border border-neutral-300 rounded-button p-3 outline-none focus:border-primary-500"
              />
            </div>

            <PasswordInput
              label="Password"
              register={register}
              name="password"
              placeholder="Enter password"
              error={password && password.length < 10}
              hint="Password must be at least 10 characters"
            />

            <PasswordInput
              label="Confirm Password"
              register={register}
              name="confirmPassword"
              placeholder="Re-enter password"
              error={confirmPassword && password !== confirmPassword}
              hint="Passwords do not match"
            />

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" {...register("terms")} className="mt-1" />
              <span>
                I agree to the{" "}
                <span className="text-primary-600 cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-primary-600 cursor-pointer">
                  Privacy Policy
                </span>
              </span>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-button text-white mt-8 transition ${
                loading
                  ? "bg-primary-300 cursor-not-allowed"
                  : "bg-primary-500 hover:bg-primary-600"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <BottomLink
              text="Login"
              onClick={() => navigate("/login")}
              poser=" Already have an account? "
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
