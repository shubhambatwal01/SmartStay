import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/loader";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchBookings = async () => {
      document.title = "Your Bookings";

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BackendUrl || "http://localhost:1101"}/bookings`,
          {
            withCredentials: true,
          },
        );

        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoggedIn || user?.userType !== "user") {
      sessionStorage.removeItem("isLoggedIn");
      navigate("/login");
      return;
    }

    fetchBookings();
  }, []);

  const getBookingStatus = (booking) => {
    const today = new Date();
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    if (today < checkInDate) return "Upcoming";
    if (today > checkOutDate) return "Completed";
    return "Ongoing";
  };

  const getBookingNights = (booking) => {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const difference = checkOutDate - checkInDate;
    return Math.max(1, Math.round(difference / (1000 * 60 * 60 * 24)));
  };

  const filteredBookings =
    statusFilter === "All"
      ? bookings
      : bookings.filter(
          (booking) => getBookingStatus(booking) === statusFilter,
        );

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32 max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
            My Bookings
          </h1>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredBookings.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {bookings.length}
              </span>{" "}
              bookings
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="flex flex-col text-sm font-semibold text-gray-700">
              Booking status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-2 w-full sm:w-52 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#ff5a5f] focus:ring-2 focus:ring-[#ff5a5f]/20 outline-none"
              >
                <option>All</option>
                <option>Upcoming</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#ff5a5f] bg-[#fff1f2] py-20 px-6 text-center">
            <p className="text-xl font-bold text-[#ff5a5f] mb-2">
              No bookings found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => {
              const status = getBookingStatus(booking);
              const nights = getBookingNights(booking);
              const bookingDate = new Date(
                booking.createdAt,
              ).toLocaleDateString();
              const paymentStatus = booking.razorpayPaymentId
                ? "Paid"
                : "Pending";
              const hostName = booking.home?.owner?.fullName || "Host";
              const hostEmail =
                booking.home?.owner?.email || "Contact available soon";
              const hostAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                hostName,
              )}&background=ff5a5f&color=ffffff&rounded=true`;

              return (
                <article
                  key={booking._id}
                  className="w-full overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_-20px_rgba(255,90,95,0.22)] hover:shadow-[0_30px_70px_-24px_rgba(15,76,129,0.28)] transition-all duration-300"
                >
                  <div className="md:flex md:items-stretch">
                    <div className="md:w-70 shrink-0 overflow-hidden">
                      <img
                        src={
                          booking.home?.houseImg ||
                          "https://via.placeholder.com/400x300?text=Home+Image"
                        }
                        alt={booking.home?.houseName || "Booked Home"}
                        className="h-56 w-full object-cover transition duration-300 hover:scale-105 md:h-full"
                      />
                    </div>

                    <div className="md:w-2/3 p-6 flex flex-col justify-between gap-6">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-bold text-[#ff5a5f]">
                              {booking.home?.houseName || "Host Home"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                              {booking.home?.houseAddr ||
                                "Address not available"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#fce7f3] px-3 py-1 text-sm font-semibold text-[#9d174d]">
                              {status}
                            </span>
                            <span className="rounded-full bg-[#ddf6ff] px-3 py-1 text-sm font-semibold text-[#0f4c81]">
                              {paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                          <div className="rounded-3xl border border-[#ffe4e6] bg-[#fff1f2] p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                              Host details
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                              <img
                                src={hostAvatarUrl}
                                alt={hostName}
                                className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                              />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {hostName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {hostEmail}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-3xl border border-[#e5f4ff] bg-[#eff8ff] p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                              Booking info
                            </p>
                            <div className="mt-4 grid gap-2 text-sm text-gray-700">
                              <p>
                                <span className="font-semibold">Check-in:</span>{" "}
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Check-out:
                                </span>{" "}
                                {new Date(
                                  booking.checkOut,
                                ).toLocaleDateString()}
                              </p>
                              <p>
                                <span className="font-semibold">Nights:</span>{" "}
                                {nights}
                              </p>
                              <p>
                                <span className="font-semibold">Guests:</span>{" "}
                                {booking.users || 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl border border-gray-200 bg-[#fafafa] p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                            Booked
                          </p>
                          <p className="mt-2 text-lg font-semibold text-gray-900">
                            {bookingDate}
                          </p>
                        </div>
                        <div className="rounded-3xl border border-gray-200 bg-[#fafafa] p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                            Total paid
                          </p>
                          <p className="mt-2 text-lg font-semibold text-[#ff5a5f]">
                            ₹{booking.amount?.toFixed(0) || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default UserBookings;
