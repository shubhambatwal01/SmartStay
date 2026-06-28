import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavBtn from "../components/FavBtn";
import Loader from "../components/loader";

function HomeDetails() {
  const { id } = useParams();

  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchHomeDetails();
  }, []);

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
    try {
      const { data: order } = await axios.post(
        "http://localhost:1101/payment/create-order",
        {
          amount: home.housePrice,
        },
      );
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,

        name: "SmartStay",
        description: "Home Booking",

        order_id: order.id,

        handler: function (response) {
          alert("Payment Successful");

          console.log(response);
        },

        prefill: {
          name: user.fullName,
          email: user.email,
        },

        theme: {
          color: "#ff5a5f",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen mt-32 flex justify-center items-center">
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
        <main className="min-h-screen mt-32 flex justify-center items-center">
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
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Your Home Detail :
        </h1>

        <div className="mt-10 max-w-full mx-auto p-4 bg-gray-100 rounded">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <img
              src={home.houseImg}
              alt={home.houseName}
              className="w-full md:w-2/4 h-auto object-cover rounded"
            />

            <div className="md:w-2/3">
              <label className="text-xl font-bold">Name:</label>

              <h4 className="text-xl font-bold text-[#ff5a5f] mb-2">
                {home.houseName}
              </h4>

              <hr />

              <label className="text-xl font-bold">Address :</label>

              <h3 className="text-xl font-bold text-[#ff5a5f] mb-2">
                {home.houseAddr}
              </h3>

              <hr />

              <label className="text-xl font-bold">Price :</label>

              <h2 className="text-xl font-bold text-[#ff5a5f] mb-2">
                Rs.{home.housePrice}/night
              </h2>

              <hr />

              <label className="text-xl font-bold">Description :</label>

              <h3 className="text-xl font-bold text-[#ff5a5f] mb-2">
                {home.houseDesc}
              </h3>

              <hr />

              <div className="flex justify-center items-center gap-2">
                {user && user.userType === "user" && (
                  <>
                    <FavBtn homeId={home._id} />

                    <button
                      onClick={handlePayment}
                      className="mt-8 bg-[#ff5a5f] text-white px-4 py-2 rounded hover:bg-[#ff4b51]"
                    >
                      Book Now
                    </button>
                  </>
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
