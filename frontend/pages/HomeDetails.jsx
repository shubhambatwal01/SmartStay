import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavBtn from "../components/FavBtn";
import Loader from "../components/Loader";

function HomeDetails() {
  const { id } = useParams();

  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchHomeDetails();
  }, [id]);

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

  const fetchHomeDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:1101/homes/${id}`);

      setHome(response.data.home);
    } catch (error) {
      console.error("Error fetching home details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    try {
      const { data: order } = await axios.post(
        "http://localhost:1101/payment/create-order",
        {
          amount: totalPrice || home.housePrice,
        },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,

        name: "SmartStay",
        description: "Home Booking",

        order_id: order.id,

        handler: async function (response) {
          console.log("Razorpay Success Response:", response);
          try {
            const { data } = await axios.post(
              "http://localhost:1101/verify-payment",
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
              alert("Booking Confirmed!");
              window.location.href = "/bookings";
            }
          } catch (error) {
            alert("Payment verification failed");
          }
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
      alert("Payment failed");
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
          <h1 className="text-2xl text-red-500">Home not found.</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div>
            <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
              Your home detail :
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={home.houseImg}
                  alt={home.houseName}
                  className="w-full h-96 object-cover hover:scale-105 transition duration-300"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {home.houseName}
                  </h2>
                  <p className="text-2xl font-bold text-[#ff5a5f]">
                    ₹{home.housePrice}{" "}
                    <span className="text-lg text-gray-500">/ night</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    About this property
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {home.houseDesc}
                  </p>
                </div>
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

            <div className="sticky top-32">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-gray-600 text-sm font-semibold">
                    Price per night
                  </p>
                  <h2 className="text-4xl font-bold text-[#ff5a5f]">
                    ₹{home.housePrice}
                  </h2>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Guests
                  </label>
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

                {user && user.userType === "user" && (
                  <div className="space-y-3">
                    <button
                      onClick={handlePayment}
                      disabled={!checkIn || !checkOut}
                      className="w-full bg-linear-to-r from-[#ff5a5f] to-[#ff4b51] hover:from-[#ff4b51] hover:to-[#ff3a41] text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      Reserve Now
                    </button>
                  </div>
                )}

                {!user && (
                  <button
                    className="w-full bg-gray-400 text-white font-bold py-3 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Login to Book
                  </button>
                )}
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
