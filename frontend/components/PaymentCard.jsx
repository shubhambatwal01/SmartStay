import { createPortal } from "react-dom";
import Loader from "../components/loader";

function PaymentCard({
  isOpen,
  onClose,
  name,
  img,
  price,
  address,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  paymentHandler,
  isPaying,
}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isUser = user?.userType === "user";

  if (!isOpen) return null;

  const nights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
  );

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        onClick={isPaying ? undefined : onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isPaying}
          aria-label="Close payment"
          className="absolute right-4 top-3 z-10 text-3xl text-gray-500 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ×
        </button>

        <img src={img} alt={name} className="h-52 w-full object-cover" />

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>

          <p className="mt-0.5 font-semibold text-[#ff5a5f]">₹{price}/night</p>

          <p className="mt-0.5 text-gray-600">{address}</p>

          <div className="my-2 border-t border-gray-200" />

          <div className="space-y-1 text-gray-700">
            <div className="flex justify-between">
              <span>Check-In</span>
              <span className="font-semibold">
                {new Date(checkIn).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Check-Out</span>
              <span className="font-semibold">
                {new Date(checkOut).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Nights</span>
              <span className="font-semibold">{nights}</span>
            </div>

            <div className="flex justify-between">
              <span>Guests</span>
              <span className="font-semibold">{guests}</span>
            </div>
          </div>

          <div className="my-2 border-t border-gray-200" />

          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-[#ff5a5f]">₹{totalPrice}</span>
          </div>

          <button
            type="button"
            onClick={isUser ? paymentHandler : undefined}
            disabled={!isUser || isPaying}
            className={`mt-6 flex w-full items-center justify-center rounded-xl py-3 font-semibold transition ${
              isUser && !isPaying
                ? "cursor-pointer bg-linear-to-r from-[#ff5a5f] to-[#ff4b51] text-white hover:opacity-90"
                : "cursor-not-allowed bg-gray-500 text-white"
            }`}
          >
            {isPaying ? (
              <Loader fullscreen={false} />
            ) : isUser ? (
              "Pay Now"
            ) : (
              "Login as User to Pay"
            )}
          </button>

          <p className="mt-3 text-center text-sm text-gray-500">
            🔒 Secure payment via Razorpay
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
export default PaymentCard;
