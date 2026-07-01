import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/loader";

function HostHome() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1101/host/host-home",
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this home?",
    );

    if (!confirmDelete) return;

    setDeleting(homeId);

    try {
      await axios.post(
        `http://localhost:1101/host/delete-home/${homeId}`,
        {},
        {
          withCredentials: true,
        },
      );

      setHomes((prevHomes) => prevHomes.filter((home) => home._id !== homeId));
    } catch (error) {
      console.log("Error deleting home:", error);
      alert("Failed to delete home");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32 max-w-6xl mx-auto px-4">
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
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
            {homes.map((home) => (
              <li
                key={home._id}
                className="bg-[#fde8e9] rounded-xl shadow-lg p-6 hover:bg-[#fbd6d7] transition flex flex-col items-center"
              >
                <div className="text-5xl text-[#ff5a5f] m-2">
                  <img
                    src={home.houseImg}
                    alt={home.houseName}
                    className="h-50 w-auto object-cover rounded-lg"
                  />
                </div>

                <h2 className="text-2xl font-bold text-[#ff5a5f] mb-0.5 text-center">
                  {home.houseName}
                </h2>

                <p className="text-[#ff5a5f] mb-0.5 text-center">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {home.houseAddr}
                </p>

                <p className="text-lg font-semibold text-[#ff5a5f] mb-2 text-center">
                  ₹{home.housePrice}/night
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/host/edit-home/${home._id}`}
                    className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Edit
                  </Link>

                  {/* delete in maintenance */}
                  <button
                    onClick={() => handleDelete(home._id)}
                    disabled={deleting === home._id}
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deleting === home._id ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader fullscreen={false} />
                        {`Deleting`}
                      </span>
                    ) : (
                      <>{"Delete"}</>
                    )}
                  </button>
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

export default HostHome;
