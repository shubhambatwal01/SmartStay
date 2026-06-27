import { useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function FavList() {
  const [favouriteHomes, setFavouriteHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const response = await axios.get("http://localhost:1101/favourites", {
        withCredentials: true,
      });

      setFavouriteHomes(response.data.favouriteHomes || []);
    } catch (error) {
      console.error("Error fetching favourites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (homeId) => {
    try {
      await axios.delete(`http://localhost:1101/favourites/delete/${homeId}`, {
        withCredentials: true,
      });

      setFavouriteHomes((prevHomes) =>
        prevHomes.filter((home) => home._id !== homeId),
      );
    } catch (error) {
      console.error("Error deleting favourite:", error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-16">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          My Favourites:
        </h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <p className="text-xl">Loading...</p>
          </div>
        ) : favouriteHomes.length === 0 ? (
          <div className="flex justify-center items-center">
            <p className="text-2xl font-bold text-red-500">
              No favourite homes found.
            </p>
          </div>
        ) : (
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
            {favouriteHomes.map((home) => (
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

                <h2 className="text-2xl font-bold text-[#ff5a5f] mb-2 text-center">
                  {home.houseName} House
                </h2>

                <p className="text-[#ff5a5f] mb-2 text-center">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {home.houseAddr}
                </p>

                <p className="text-lg font-semibold text-[#ff5a5f] mb-2 text-center">
                  ₹{home.housePrice} / night
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/homes/${home._id}`}
                    className="mt-auto bg-[#ff5a5f] hover:bg-[#ff4b51] text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Book Now
                  </Link>

                  <button
                    onClick={() => handleDelete(home._id)}
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Delete
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

export default FavList;
