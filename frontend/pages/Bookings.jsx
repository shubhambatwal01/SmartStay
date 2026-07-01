import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = JSON.parse(sessionStorage.getItem("isLoggedIn"));
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:1101/bookings", {
          withCredentials: true,
        });

        setBookings(response.data.bookings || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoggedIn || user.userType !== "user") {
      sessionStorage.removeItem("isLoggedIn");
      navigate("/login");
    }

    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32 max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
            Your Bookings
          </h1>
        </div>

        {loading ? (
          <Loader />
        ) : bookings.length === 0 ? (
          <div className="flex justify-center items-center">
            <p className="text-2xl font-bold text-red-500">
              No bookings found.
            </p>
          </div>
        ) : (
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                className="bg-[#fde8e9] rounded-xl shadow-lg p-6 hover:bg-[#fbd6d7] transition flex flex-col items-center"
              >
                <div className="text-5xl text-[#ff5a5f] m-2">
                  <img
                    src={booking.home.houseImg}
                    alt={booking.home.houseName}
                    className="h-50 w-auto object-cover rounded-lg"
                  />
                </div>

                <h2 className="text-2xl font-bold text-[#ff5a5f] text-center">
                  {booking.home.houseName}
                </h2>

                <p className="text-[#ff5a5f] text-center">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {booking.home.houseAddr}
                </p>

                <p className="text-[#ff5a5f] mb-2">
                  Charge: ₹{booking.home.housePrice}/night
                </p>

                <p>
                  Check-In: {new Date(booking.checkIn).toLocaleDateString()}
                </p>

                <p>
                  Check-Out: {new Date(booking.checkOut).toLocaleDateString()}
                </p>

                <p>No. of Guests: {booking.guests}</p>

                <div className="w-full h-px bg-[#ff5a5f] m-2"></div>

                <p className="text-2xl font-bold text-blue-600">
                  Paid ₹{booking.amount}
                </p>
              </li>
            ))}
          </ol>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Bookings;
