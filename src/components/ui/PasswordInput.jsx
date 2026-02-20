import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";

export default function PasswordInput({
  label,
  register,
  name,
  error,
  placeholder,
  hint,
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...register(name, { required: true })}
          className={`w-full bg-neutral-100 border rounded-button p-3 pr-10 outline-none ${
            error
              ? "border-error"
              : "border-neutral-300 focus:border-primary-500"
          }`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-3 text-neutral-500"
        >
          {show ? <IoEyeOutline size={18} /> : <IoEyeOffOutline size={18} />}
        </button>
      </div>

      {error && <div className="text-error text-sm mt-1">{hint}</div>}
    </div>
  );
}
