import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:1101/bookings", {
        withCredentials: true,
      });

      setBookings(response.data.bookings);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">No bookings found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden"
              >
                <img
                  src={booking.home.houseImg}
                  alt={booking.home.houseName}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-semibold">
                    {booking.home.houseName}
                  </h2>

                  <p>
                    Check-In:
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </p>

                  <p>
                    Check-Out:
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>

                  <p>Guests: {booking.guests}</p>

                  <p className="font-bold text-blue-600">₹{booking.amount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Bookings;
