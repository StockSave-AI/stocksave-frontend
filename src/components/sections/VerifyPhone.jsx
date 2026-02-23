import { FiPhone } from "react-icons/fi";
import ActionButton from "../ui/ActionButton";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SignupHeader from "../ui/SignupHeader";

function VerifyPhone() {
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = location.state?.phone || "+234XXXXXXXX";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    console.log("Entered OTP:", otpValue);

    navigate("/reset-password");
  };

  return (
    <>
      <SignupHeader />

      <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-2">
        <div className="bg-green-100 rounded-full p-4 flex items-center justify-center">
          <FiPhone className="text-green-700 w-6 h-6" />
        </div>

        <h2 className="text-lg font-semibold text-center text-neutral-800">
          Verify Your Phone
        </h2>

        <p className="text-sm text-center text-neutral-500">
          Resend 6-digit OTP to {phoneNumber}
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              maxLength={1}
              className="w-12 h-12 text-center border border-neutral-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ))}
        </div>

        <p className="text-center text-sm text-neutral-500">
          {seconds > 0 ? (
            <>
              Resend OTP in{" "}
              <span className="text-green-700 font-semibold">{seconds}s</span>
            </>
          ) : (
            <span
              className="text-primary-600 cursor-pointer hover:underline"
              onClick={() => setSeconds(60)}
            >
              Resend OTP
            </span>
          )}
        </p>

        <ActionButton text="Verify OTP" />

        <div className="mt-6 w-full bg-neutral-100 py-4 px-4 text-center rounded-md">
          <p className="text-sm text-neutral-600">
            Didn’t receive the OTP?{" "}
            <span
              onClick={() => navigate("/contact")}
              className="text-green-600 font-medium cursor-pointer hover:underline"
            >
              Contact Support
            </span>
          </p>
        </div>

        <div className="text-center mt-4">
          <span
            onClick={() => navigate("/")}
            className="text-sm text-primary-600 cursor-pointer hover:underline"
          >
            Back to Home
          </span>
        </div>
      </form>
    </>
  );
}

export default VerifyPhone;
