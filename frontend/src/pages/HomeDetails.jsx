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
import {
  MapPin,
  Star,
  ShieldCheck,
  Home as HomeIcon,
  Check,
  CalendarDays,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

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
  const [totalPrice, setTotalPrice] = useState();
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
          `https://smartstay-8bre.onrender.com/homes/${id}`,
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
        "https://smartstay-8bre.onrender.com/payment/create-order",
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
              "https://smartstay-8bre.onrender.com/payment/verify-payment",
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
          <h1 className="text-2xl text-red-500">Home not found.</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa] pt-28 pb-24 md:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="flex justify-center items-center mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              Home{" "}
              <span className="bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent">
                Details
              </span>
            </h1>
          </section>

          <section className="mb-10">
            <div className="group relative overflow-hidden rounded-3xl bg-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
              <img
                src={home.houseImg}
                alt={home.houseName}
                className="h-75 w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:h-107.5 lg:h-130"
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

              <div className="absolute top-0 left-0 right-0 p-5 sm:p-7 lg:p-8">
                <h1 className="truncate text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {home.houseName}
                </h1>
                <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="font-semibold text-gray-800">
                        {home.rating || "New"}
                      </span>
                      {home.rating && (
                        <span className="text-gray-400">/ 5</span>
                      )}
                    </div>

                    <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />

                    <div className="flex min-w-0 items-center gap-1.5">
                      <MapPin size={16} className="shrink-0 text-[#ff5a5f]" />
                      <span className="truncate">{home.houseAddr}</span>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6">
                    <FavBtn homeId={home._id} />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 lg:p-8">
                <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Starting from
                    </p>

                    <div className="mt-1 flex items-end gap-1">
                      <span className="text-3xl font-bold sm:text-4xl">
                        ₹{home.housePrice}
                      </span>
                      <span className="pb-1 text-sm font-medium text-white/80">
                        / night
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                    <HomeIcon size={17} />
                    {home.bhk || "Property"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="min-w-0 space-y-6">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.05)] sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ff5a5f]">
                      Your stay
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                      Comfortable {home.bhk || "home"} in a great location
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Hosted by {home.owner?.fullName || "SmartStay Host"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:min-w-75">
                    <div className="rounded-2xl bg-gray-50 px-3 py-4 text-center">
                      <HomeIcon className="mx-auto text-[#ff5a5f]" size={20} />
                      <p className="mt-2 text-xs text-gray-400">Type</p>
                      <p className="mt-0.5 truncate text-sm font-bold text-gray-800">
                        {home.bhk || "Home"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-3 py-4 text-center">
                      <Star
                        className="mx-auto fill-amber-400 text-amber-400"
                        size={20}
                      />
                      <p className="mt-2 text-xs text-gray-400">Rating</p>
                      <p className="mt-0.5 text-sm font-bold text-gray-800">
                        {home.rating || "New"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-3 py-4 text-center">
                      <ShieldCheck
                        className="mx-auto text-emerald-600"
                        size={20}
                      />
                      <p className="mt-2 text-xs text-gray-400">Booking</p>
                      <p className="mt-0.5 text-sm font-bold text-gray-800">
                        Secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.05)] sm:p-8">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1f2] text-[#ff5a5f]">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      About this place
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Everything you need to know about your stay
                    </p>
                  </div>
                </div>

                <p className="text-base leading-8 text-gray-600">
                  {(home.houseDesc || "").length > 260
                    ? `${home.houseDesc.slice(0, 260)}...`
                    : home.houseDesc}
                </p>

                {(home.houseDesc || "").length > 260 && (
                  <button
                    type="button"
                    onClick={() => setIsAboutOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-[#ff5a5f] hover:bg-[#fff8f8] hover:text-[#ff5a5f]"
                  >
                    Read full description
                    <ArrowRight size={16} />
                  </button>
                )}

                <AboutProperty
                  isOpen={isAboutOpen}
                  onClose={() => setIsAboutOpen(false)}
                  title="About this property"
                >
                  <p className="whitespace-pre-line leading-8 text-gray-700">
                    {home.houseDesc}
                  </p>
                </AboutProperty>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.05)] sm:p-8">
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ff5a5f]">
                    Amenities
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                    What this place offers
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Comforts and facilities available during your stay
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ["wifi", "📶", "Free Wi-Fi"],
                    ["washingMachine", "🧺", "Washing Machine"],
                    ["caretaker", "👨‍🔧", "Caretaker Available"],
                    ["kitchen", "🍳", "Kitchen"],
                    ["parking", "🚗", "Free Parking"],
                    ["ac", "❄️", "Air Conditioner"],
                    ["smartTv", "📺", "Smart TV"],
                    ["attachedBathroom", "🛁", "Attached Bathroom"],
                  ].map(([key, icon, label]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                        home[key]
                          ? "border-[#ffd9da] bg-[#fffafa] hover:border-[#ffb9bc] hover:shadow-sm"
                          : "border-gray-100 bg-gray-50 opacity-55"
                      }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                        {icon}
                      </div>

                      <span
                        className={`text-sm font-semibold ${
                          home[key]
                            ? "text-gray-800"
                            : "text-gray-400 line-through"
                        }`}
                      >
                        {label}
                      </span>

                      <span
                        className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full ${
                          home[key]
                            ? "bg-[#ff5a5f] text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {home[key] ? <Check size={14} strokeWidth={3} /> : "×"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.05)] sm:p-8">
                <div className="mb-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ff5a5f]">
                    Your host
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                    Hosted by {home.owner?.fullName || "SmartStay Host"}
                  </h2>
                </div>

                <div className="flex flex-col gap-5 rounded-2xl bg-linear-to-r from-[#fff7f7] to-white p-5 sm:flex-row sm:items-center">
                  <div className="relative shrink-0">
                    <img
                      src={
                        home.owner?.profileImage || "https://i.pravatar.cc/100"
                      }
                      alt={home.owner?.fullName || "Host"}
                      className="h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-white"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#ff5a5f] text-white ring-4 ring-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {home.owner?.fullName || "SmartStay Host"}
                      </h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#ff5a5f] shadow-sm">
                        Super Host
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Your host is here to make your stay comfortable, smooth,
                      and memorable from booking to checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:self-start">
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.10)] sm:p-6 lg:sticky lg:top-28">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Price per night
                    </p>
                    <div className="mt-1 flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{home.housePrice}
                      </span>
                      <span className="pb-1 text-sm text-gray-500">
                        / night
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    {home.rating || "New"}
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-300 bg-white">
                  <div className="grid grid-cols-1 divide-y divide-gray-300 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-2">
                    <div className="p-3.5">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                        <CalendarDays size={13} />
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
                        placeholderText="Add date"
                        wrapperClassName="w-full"
                        className="mt-1.5 w-full cursor-pointer bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div className="p-3.5">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                        <CalendarDays size={13} />
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
                        placeholderText="Add date"
                        wrapperClassName="w-full"
                        className="mt-1.5 w-full cursor-pointer bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-300 p-3.5">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                      <Users size={13} />
                      Guests
                    </label>

                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="mt-1.5 w-full cursor-pointer bg-transparent text-sm font-semibold text-gray-900 outline-none"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-xs font-medium leading-5 text-emerald-700">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                  Reserved dates are automatically unavailable in the calendar.
                </div>

                {totalPrice > 0 && (
                  <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
                      <span>
                        ₹{home.housePrice} ×{" "}
                        {Math.ceil(
                          (new Date(checkOut) - new Date(checkIn)) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        nights
                      </span>
                      <span className="font-semibold text-gray-800">
                        ₹{totalPrice.toFixed(0)}
                      </span>
                    </div>

                    <div className="my-3 h-px bg-gray-200" />

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-[#ff5a5f]">
                        ₹{totalPrice.toFixed(0)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(true)}
                  disabled={!checkIn || !checkOut}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#ff5a5f] to-[#ff4047] px-4 py-3.5 font-bold text-white shadow-lg shadow-red-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  Reserve Now
                  <ArrowRight size={18} />
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                  You won't be charged until payment confirmation.
                </p>

                <div className="mt-5 flex items-center justify-center gap-2 border-t border-gray-100 pt-5 text-xs font-medium text-gray-500">
                  <ShieldCheck size={15} className="text-emerald-600" />
                  Secure payment powered by Razorpay
                </div>

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
                  <p className="whitespace-pre-line leading-8 text-gray-700">
                    {home.houseDesc}
                  </p>
                </PaymentCard>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default HomeDetails;
