import { useEffect, useState } from "react";
import { FiX, FiLogOut } from "react-icons/fi";
import { getProfile } from "../services/auth";
import { formatName } from "./formatName";

function Logout({ isOpen, onClose, onConfirm }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!isOpen) return undefined;

    getProfile()
      .then((data) => {
        if (!isMounted) return;
        setUser(data);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`
      : "U";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-[70] px-4">
        <div
          className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-black"
          >
            <FiX size={20} />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <FiLogOut className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold">Log Out</h2>
          </div>

          <div className="flex items-center gap-4 bg-neutral-100 rounded-xl p-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-lg">
              {initials}
            </div>

            <div>
              <p className="font-medium text-neutral-800">
                {user
                  ? `${formatName(user.first_name)} ${formatName(user.last_name)}`
                  : "Loading..."}
              </p>
              <p className="text-sm text-neutral-500 capitalize">
                {user?.account_type || "Customer Account"}
              </p>
            </div>
          </div>

          <p className="text-neutral-600 mb-2">
            Are you sure you want to log out?
          </p>

          <p className="text-sm text-neutral-500 mb-6">
            You will need to log in again to access your savings and bookings.
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 border border-neutral-300 py-3 rounded-lg text-neutral-700 hover:bg-neutral-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <FiLogOut size={16} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Logout;
