import ActionButton from "../ui/ActionButton";
import SignupHeader from "../ui/SignupHeader";
import { FiPhone } from "react-icons/fi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Phone number submitted:", data.phone);
    toast.success("OTP sent to your phone!");

    navigate("/verify-phone", { state: { phone: data.phone } });
  };

  return (
    <>
      <SignupHeader text="Reset your Password" />

      <div className="flex flex-col items-center justify-center p-6 sm:p-8">
        <div className="bg-green-100 rounded-full p-4 flex items-center justify-center">
          <FiPhone className="text-green-700 w-6 h-6" />
        </div>

        <h2 className="text-lg font-semibold text-center text-neutral-800 mt-2">
          Forget Password
        </h2>

        <p className="text-sm text-center text-neutral-500 mt-1">
          Enter your phone number and we'll send you an OTP to reset your
          password.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Phone Number
          </label>
          <input
            {...register("phone", { required: true })}
            placeholder="+2348000000000"
            className="w-full bg-neutral-100 border border-neutral-300 rounded-button p-3 outline-none focus:border-primary-500"
          />

          <ActionButton text="Send OTP" />
        </form>

        <p
          onClick={() => navigate("/login")}
          className="mt-4 text-center text-sm text-primary-600 cursor-pointer hover:underline"
        >
          ← Back to Login
        </p>
      </div>
    </>
  );
}

export default ForgetPassword;
