import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TailSpin } from "react-loader-spinner";
import Loader from "../components/loader";
import FavBtn from "../components/FavBtn";

function Home() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchHomes = async () => {
      document.title = "Homes | SmartStay";
      try {
        const response = await axios.get(
          "https://smartstay-d8sz.onrender.com/",
          {
            withCredentials: true,
          },
        );

        setHomes(response.data.homes || []);
        setIsLoggedIn(!!response.data.isLoggedIn);
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
      <Navbar />

      <main className="min-h-screen mt-32 max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
            Welcome to SmartStay
          </h1>
        </div>

        {loading ? (
          <Loader />
        ) : homes.length === 0 ? (
          <h2 className="text-center text-lg">No homes available.</h2>
        ) : (
          <>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
              {homes.map((home) => (
                <li
                  key={home._id}
                  className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={home.houseImg}
                      alt={home.houseName}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute bottom-3 left-3 backdrop-blur-sm px-3 rounded-full shadow-md">
                      <span className="text-xl font-bold text-[#ff5a5f]">
                        ₹{home.housePrice}
                      </span>
                      <span className="text-xs text-gray-200"> / night</span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <FavBtn homeId={home._id} />
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-800 truncate group-hover:text-[#ff5a5f] transition-colors">
                      {home.houseName}
                    </h2>

                    <p className="flex items-center mt-2 text-sm text-gray-500 truncate">
                      <i className="fas fa-map-marker-alt text-[#ff5a5f]"></i>
                      <span>{home.houseAddr}</span>
                    </p>

                    <div className="border-t border-gray-100 my-4"></div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Rating
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-800">
                            ⭐ {home.rating}
                          </span>

                          <span className="text-xs text-gray-400">/ 5</span>
                        </div>
                      </div>

                      <Link
                        to={`/homes/${home._id}`}
                        className="shrink-0 bg-[#ff5a5f] hover:bg-[#ff4b51] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Home;
