import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import BottomLink from "../ui/BottomLink";
import PasswordInput from "../ui/PasswordInput";
import RoleSelector from "../ui/RoleSelector";
import SignupHeader from "../ui/SignupHeader";

import { login as loginAPI } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import { getAuthRole, setAuthRole } from "../../utils/authStorage";

const normalizeRole = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === "owner" || normalized === "admin") return "owner";
  if (normalized === "customer") return "customer";
  return null;
};

const decodeTokenPayload = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const resolveAccountRole = (loginResult) => {
  const candidates = [
    loginResult?.account_type,
    loginResult?.accountType,
    loginResult?.role,
    loginResult?.user?.account_type,
    loginResult?.user?.accountType,
    loginResult?.user?.role,
    loginResult?.data?.account_type,
    loginResult?.data?.accountType,
    loginResult?.data?.role,
    loginResult?.data?.user?.account_type,
    loginResult?.data?.user?.accountType,
    loginResult?.data?.user?.role,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeRole(candidate);
    if (normalized) return normalized;
  }

  const payload = decodeTokenPayload(loginResult?.token);
  return normalizeRole(
    payload?.account_type || payload?.role || payload?.user?.account_type,
  );
};

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { saveToken } = useAuth();
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (!data.password || data.password.length < 10) {
      toast.error("Password must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      const rememberMe = Boolean(data.remember);
      const result = await loginAPI({
        ...data,
        role,
        remember_me: rememberMe,
      });
      const selectedRole = normalizeRole(role);
      const actualRole = resolveAccountRole(result);

      if (selectedRole && actualRole && selectedRole !== actualRole) {
        throw new Error(
          `This account is registered as ${actualRole}. Sign in as ${actualRole} to access the correct dashboard, or register as ${
            selectedRole === "owner" ? "customer" : "owner"
          } for that dashboard.`,
        );
      }

      saveToken(result.token, rememberMe);
      setAuthRole(actualRole || selectedRole || role, rememberMe);
      const resolvedRole = normalizeRole(getAuthRole()) || actualRole || selectedRole;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["plans"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-savings"] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
      ]);
      toast.success("Logged in successfully");
      navigate(
        resolvedRole === "owner" ? "/owner/dashboard" : "/dashboard",
        { replace: true },
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-card shadow-card overflow-hidden">
        <SignupHeader text="Login to your account" />

        <div className="p-6 sm:p-8">
          <RoleSelector role={role} setRole={setRole} />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1 mt-5">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="john@example.com"
              className="w-full bg-neutral-100 border border-neutral-300 rounded-button p-3 outline-none focus:border-primary-500"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
            <PasswordInput
              label="Password"
              register={register}
              name="password"
              placeholder="Enter password"
              error={password && password.length < 10}
              hint="Password must be at least 10 characters"
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
              {loading ? "Logging in..." : "Login"}
            </button>

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
