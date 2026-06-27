import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavBtn from "../components/FavBtn";
import { AuthContext } from "../src/AuthContext";
import Loader from "../components/loader";

function HomeList() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await axios.get("http://localhost:1101/homes");

        setHomes(response.data.homes || []);
      } catch (error) {
        console.error("Error fetching homes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

  return (
    <>
      <Navbar currentPage="homeList" />

      <main className="min-h-screen mt-32">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Explore Our Registered Houses :
        </h1>

        {loading ? (
          <Loader />
        ) : homes.length === 0 ? (
          <h2 className="text-center text-lg">No homes available.</h2>
        ) : (
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
            {homes.map((home) => (
              <li
                key={home._id}
                className="bg-[#fde8e9] rounded-xl shadow-lg p-6 hover:bg-[#fbd6d7] transition flex flex-col items-center"
              >
                {/* Img */}
                <div className="text-5xl text-[#ff5a5f] m-2">
                  <img
                    src={home.houseImg}
                    alt={home.houseName}
                    className="h-50 w-auto object-cover rounded-lg"
                  />
                </div>

                {/* name */}
                <h2 className="text-2xl font-bold text-[#ff5a5f] mb-2 text-center">
                  {home.houseName} House
                </h2>

                {/* addr */}
                <p className="text-[#ff5a5f] mb-2 text-center">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {home.houseAddr}
                </p>

                {/* price */}
                <p className="text-lg font-semibold text-[#ff5a5f] mb-2 text-center">
                  ₹{home.housePrice} /night
                </p>

                {/* fav btn */}
                <div className="flex justify-center items-center gap-2">
                  <FavBtn homeId={home._id} />

                  {/* Details btn */}
                  <Link
                    to={isLoggedIn ? `/homes/${home._id}` : "/login"}
                    className="mt-auto bg-[#ff5a5f] hover:bg-[#ff4b51] text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Details
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        )}
      </main>

      <Footer />
    </>
  );
}

export default HomeList;
