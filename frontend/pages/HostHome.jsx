import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/loader";
import toast from "react-hot-toast";

function HostHome() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchHomes = async () => {
      document.title = "Your Registered Homes";
      try {
        const response = await axios.get(
          `https://smartstay-d8sz.onrender.com/host/host-home`,
          {
            withCredentials: true,
          },
        );

        setHomes(response.data.homes || response.data);
      } catch (error) {
        console.log("Error fetching homes:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!isLoggedIn || user.userType !== "admin") {
      sessionStorage.removeItem("isLoggedIn");
      navigate("/login");
    }
    fetchHomes();
  }, []);

  const handleDelete = async (homeId) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-280px">
        <p className="font-semibold text-gray-800">
          Are you sure you want to delete this home?
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={async () => {
              toast.dismiss(t.id);

              setDeleting(homeId);

              try {
                await axios.delete(
                  `https://smartstay-d8sz.onrender.com/host/delete-home/${homeId}`,
                  {
                    withCredentials: true,
                  },
                );

                toast.success("Home deleted successfully!");

                setHomes((prevHomes) =>
                  prevHomes.filter((home) => home._id !== homeId),
                );
              } catch (error) {
                console.error("Delete error:", error);

                toast.error(
                  error.response?.data?.message ||
                    "Failed to remove home. Please try again.",
                );
              } finally {
                setDeleting(null);
              }
            }}
            disabled={deleting === homeId}
            className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting === homeId || "Delete"}
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32 max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
            Your Registered Homes
          </h1>
        </div>

        {loading ? (
          <Loader />
        ) : homes.length === 0 ? (
          <div className="flex justify-center items-center">
            <p className="text-2xl font-bold text-red-500">No home found.</p>
          </div>
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

                    <div className="absolute bottom-3 left-3  backdrop-blur-sm px-3 rounded-full shadow-md">
                      <span className="text-xl font-bold text-[#ff5a5f]">
                        ₹{home.housePrice}
                      </span>
                      <span className="text-xs text-gray-200"> / night</span>
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

                      <div className="flex gap-2">
                        <Link
                          to={`/host/edit-home/${home._id}`}
                          className="mt-auto bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(home._id)}
                          disabled={deleting === home._id}
                          className="mt-auto bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
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

export default HostHome;
