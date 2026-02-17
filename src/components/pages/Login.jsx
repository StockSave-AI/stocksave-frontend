import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ActionButton from "../ui/ActionButton";
import BottomLink from "../ui/BottomLink";
import PasswordInput from "../ui/PasswordInput";
import SignupHeader from "../ui/SignupHeader";
import RoleSelector from "../ui/RoleSelector";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");

  const { register, handleSubmit, watch } = useForm();
  const password = watch("password");

  const onSubmit = (data) => {
    if (!data.password || data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    toast.success("Logged in successfully");
    console.log({ ...data, role });
    navigate("/dashboard");
    // Call your login API here if needed
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-card shadow-card overflow-hidden">
        <SignupHeader text=" Login to your account " />

        <div className="p-6 sm:p-8">
          <RoleSelector role={role} setRole={setRole} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
            <PasswordInput
              label="Password"
              register={register}
              name="password"
              placeholder="Enter password"
              error={password && password.length < 8}
              hint="Password must be at least 8 characters"
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="mt-1"
                />
                Remember me
              </label>

              <span
                className="text-primary-600 cursor-pointer hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>
            <ActionButton text="Login" />

            <BottomLink
              text="Sign Up"
              onClick={() => navigate("/signup")}
              poser="Don't have an account? "
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
