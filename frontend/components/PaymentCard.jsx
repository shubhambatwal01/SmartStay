function PaymentCard({
  isOpen,
  onClose,
  title,
  name,
  img,
  price,
  address,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  paymentHandler,
}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isUser = user?.userType === "user";

  if (!isOpen) return null;

  const nights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-3xl text-gray-500 hover:text-red-500"
        >
          ×
        </button>

        <img src={img} alt={name} className="h-52 w-full object-cover" />

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>

          <p className="text-[#ff5a5f] font-semibold mt-0.5">₹{price}/night</p>

          <p className="text-gray-600 mt-0.5">{address}</p>

          <div className=" my-2 border-t border-gray-200"></div>

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

          <div className="my-2 border-t border-gray-200"></div>

          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-[#ff5a5f]">₹{totalPrice}</span>
          </div>

          <button
            onClick={isUser ? paymentHandler : undefined}
            disabled={!isUser}
            className={`mt-6 w-full rounded-xl py-3 font-semibold transition ${
              isUser
                ? "bg-linear-to-r from-[#ff5a5f] to-[#ff4b51] text-white hover:opacity-90 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isUser ? "Pay Now" : "Login as User to Pay"}
          </button>

          <p className="mt-3 text-center text-sm text-gray-500">
            🔒 Secure payment via Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
export default PaymentCard;
