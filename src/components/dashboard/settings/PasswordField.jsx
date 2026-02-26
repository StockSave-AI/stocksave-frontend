import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordField({
  placeholder,
  value,
  onChange,
  show,
  onToggle,
  disabled,
}) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border border-neutral-300 rounded-lg px-4 py-2 pr-11 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
      />
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
      >
        {show ? <FiEye size={18} /> : <FiEyeOff size={18} />}
      </button>
    </div>
  );
}
