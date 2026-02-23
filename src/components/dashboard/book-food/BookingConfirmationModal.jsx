import { FiCheckCircle } from "react-icons/fi";

const BookingConfirmationModal = ({ cart, total, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 p-4 sm:p-6">
      <div className="bg-white max-w-xl w-full p-10 rounded-2xl shadow-lg text-center">
        <FiCheckCircle size={60} className="mx-auto text-green-600 mb-6" />

        <h2 className="text-2xl font-bold mb-4">Booking Confirmed</h2>

        <div className="space-y-4 text-left mb-6 max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size.label}`}
              className="flex justify-between"
            >
              <span>
                {item.name} ({item.size.label}) x {item.qty}
              </span>
              <span>₦{(item.size.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-4">
          <span>Total Paid</span>
          <span>₦{total.toLocaleString()}</span>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-primary-500 text-white py-3 rounded-xl font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
