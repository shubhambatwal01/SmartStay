import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavBtn from "../components/FavBtn";
import Loader from "../components/loader";
import AboutProperty from "../components/AboutProperty";
import PaymentCard from "../components/PaymentCard";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function HomeDetails() {
  const { id } = useParams();

  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(1);
  const [bookedDates, setBookedDates] = useState([]);
  const [isPaying, setIsPaying] = useState(false);

  // When user changes the check-in date, ensure the check-out remains valid.
  const handleCheckInChange = (date) => {
    if (!date) {
      setCheckIn("");
      setCheckOut("");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const newCheckIn = `${year}-${month}-${day}`;

    setCheckIn(newCheckIn);

    if (!checkOut || checkOut <= newCheckIn) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const nextYear = nextDay.getFullYear();
      const nextMonth = String(nextDay.getMonth() + 1).padStart(2, "0");
      const nextDayNumber = String(nextDay.getDate()).padStart(2, "0");

      setCheckOut(`${nextYear}-${nextMonth}-${nextDayNumber}`);
    }
  };

  const handleCheckOutChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      setCheckOut(`${year}-${month}-${day}`);
    } else {
      setCheckOut("");
    }
  };

  const user = JSON.parse(sessionStorage.getItem("user"));
  const isUser = user?.userType === "user";

  useEffect(() => {
    if (checkIn && checkOut && home) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      const difference = end - start;
      const nights = difference / (1000 * 60 * 60 * 24);

      if (nights > 0) {
        setTotalPrice(nights * home.housePrice);
      } else {
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, home]);

  const getBookedDates = (bookings = []) => {
    const dates = [];

    bookings.forEach((booking) => {
      let current = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);

      while (current <= end) {
        dates.push(current.toISOString().split("T")[0]);

        current = new Date(current);
        current.setDate(current.getDate() + 1);
      }
    });

    return dates;
  };

  useEffect(() => {
    const fetchHomeDetails = async () => {
      document.title = "Home Details";
      try {
        const response = await axios.get(
          `https://smartstay-d8sz.onrender.com/homes/${id}`,
        );

        setHome(response.data.home);
        setBookedDates(getBookedDates(response.data.bookings));
      } catch (error) {
        console.error("Error fetching home details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeDetails();
  }, [id]);

  const paymentHandler = async () => {
    if (!isUser || isPaying) return;

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    try {
      setIsPaying(true);

      const { data: order } = await axios.post(
        "https://smartstay-d8sz.onrender.com/payment/create-order",
        {
          amount: totalPrice || home.housePrice,
        },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,

        name: "SmartStay",
        description: "Home Booking",

        order_id: order.id,

        handler: async function (response) {
          try {
            const { data } = await axios.post(
              "https://smartstay-d8sz.onrender.com/payment/verify-payment",
              {
                ...response,
                homeId: home._id,
                checkIn,
                checkOut,
                guests,
                amount: totalPrice || home.housePrice,
              },
              { withCredentials: true },
            );

            if (data.success) {
              toast.success("Booking Confirmed!");
              navigate("/bookings");
            }
          } catch (error) {
            toast.error("Payment verification failed");
            setIsPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },

        prefill: {
          name: user?.fullName,
          email: user?.email,
        },

        theme: {
          color: "#ff5a5f",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <Loader />
        </main>
        <Footer />
      </>
    );
  }

  if (!home) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
              Home Details
            </h1>
          </div>
          <h1 className="text-2xl text-red-500">Home not found.</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen mt-32 mb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
              Home Details
            </h1>
          </div>
          <div className="rounded-2xl overflow-hidden w-full h-96 border border-gray-200 bg-gray-100 flex items-center justify-center mb-5">
            <img
              src={home.houseImg}
              alt={home.houseName}
              className="max-w-full max-h-full object-contain hover:scale-105 transition duration-300"
            />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {home.houseName}
                  </h2>
                  <p className="text-2xl font-bold text-[#ff5a5f]">
                    ₹{home.housePrice}
                    <span className="text-lg text-gray-500">/night</span>
                  </p>
                </div>

                <div className="text-gray-700 leading-relaxed text-base">
                  <p>{home.houseDesc.slice(0, 180)}...</p>
                  <button
                    onClick={() => setIsAboutOpen(true)}
                    className="mt-1 text-[#ff5a5f] font-semibold hover:text-[#ff8a8f] transition"
                  >
                    See more
                  </button>
                </div>

                <AboutProperty
                  isOpen={isAboutOpen}
                  onClose={() => setIsAboutOpen(false)}
                  title="About this property"
                >
                  <p className="leading-8 whitespace-pre-line text-gray-700">
                    {home.houseDesc}
                  </p>
                </AboutProperty>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-[#ff5a5f] rounded mr-3"></span>
                  House Type
                </h2>
                <div className="inline-block bg-linear-to-r from-red-50 to-red-100 px-6 py-3 rounded-lg border border-[#ff5a5f]">
                  <p className="text-lg font-semibold text-[#ff5a5f]">
                    🏠 {home.bhk || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-[#ff5a5f] rounded mr-3"></span>
                  Home Facilities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["wifi", "📶 Free Wi-Fi"],
                    ["washingMachine", "🧺 Washing Machine"],
                    ["caretaker", "👨‍🔧 Caretaker Available"],
                    ["kitchen", "🍳 Kitchen"],
                    ["parking", "🚗 Free Parking"],
                    ["ac", "❄️ Air Conditioner"],
                    ["smartTv", "📺 Smart TV"],
                    ["attachedBathroom", "🛁 Attached Bathroom"],
                  ].map(([key, label]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                        home[key]
                          ? "border-[#ff5a5f] bg-red-50"
                          : "border-gray-200 bg-gray-50 opacity-50"
                      }`}
                    >
                      <span className="text-2xl">{label.split(" ")[0]}</span>
                      <span
                        className={`font-medium ${home[key] ? "text-gray-800" : "text-gray-500 line-through"}`}
                      >
                        {label.substring(label.indexOf(" ") + 1)}
                      </span>
                      {home[key] && (
                        <span className="ml-auto text-[#ff5a5f] font-bold text-lg">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-[#ff5a5f] rounded mr-3"></span>
                  Hosted By
                </h2>

                <div className="flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="owner"
                    className="w-16 h-16 rounded-full ring-2 ring-[#ff5a5f]"
                  />

                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {home.owner?.fullName || "Host"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      ⭐ Super Host • Year's Hosting Experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-gray-600 text-sm font-semibold">
                    Price per night
                  </p>
                  <h2 className="text-4xl font-bold text-[#ff5a5f]">
                    ₹{home.housePrice}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Check-In
                    </label>
                    <DatePicker
                      selected={
                        checkIn ? new Date(checkIn + "T00:00:00") : null
                      }
                      minDate={new Date()}
                      onChange={handleCheckInChange}
                      excludeDates={bookedDates.map(
                        (date) => new Date(date + "T00:00:00"),
                      )}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition cursor-pointer"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Check-Out
                    </label>
                    <DatePicker
                      selected={
                        checkOut ? new Date(checkOut + "T00:00:00") : null
                      }
                      minDate={
                        checkIn
                          ? (() => {
                              const date = new Date(checkIn + "T00:00:00");
                              date.setDate(date.getDate() + 1);
                              return date;
                            })()
                          : new Date()
                      }
                      onChange={handleCheckOutChange}
                      excludeDates={bookedDates.map(
                        (date) => new Date(date + "T00:00:00"),
                      )}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Number of Guests
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition bg-white cursor-pointer"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </label>
                </div>

                {totalPrice > 0 && (
                  <div className="mb-6 bg-linear-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-[#ff5a5f]">
                    <p className="text-gray-600 text-sm mb-1">Total Price</p>
                    <h3 className="text-3xl font-bold text-[#ff5a5f]">
                      ₹{totalPrice.toFixed(0)}
                    </h3>
                    <p className="text-gray-500 text-xs mt-2">
                      {Math.ceil(
                        (new Date(checkOut) - new Date(checkIn)) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      nights
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    disabled={!checkIn || !checkOut}
                    className="w-full bg-linear-to-r from-[#ff5a5f] to-[#ff4b51] hover:from-[#ff4b51] hover:to-[#ff3a41] text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    Reserve
                  </button>
                  <PaymentCard
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    title="Payment Now"
                    id={home._id}
                    name={home.houseName}
                    img={home.houseImg}
                    price={home.housePrice}
                    address={home.houseAddr}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={guests}
                    totalPrice={totalPrice}
                    paymentHandler={paymentHandler}
                    isPaying={isPaying}
                  >
                    <p className=" leading-8 text-gray-700 whitespace-pre-line">
                      {home.houseDesc}
                    </p>
                  </PaymentCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default HomeDetails;
