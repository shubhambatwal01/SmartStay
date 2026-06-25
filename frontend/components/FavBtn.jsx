import { useNavigate } from "react-router-dom";
import axios from "axios";

function FavBtn({ homeId }) {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token");

  const handleFavourite = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:1101/favourite-list", {
        id: homeId,
      });

      alert("Added to favourites");
    } catch (error) {
      console.error("Error adding favourite:", error);
      alert("Unable to add favourite");
    }
  };

  return (
    <button
      onClick={handleFavourite}
      className="mt-8 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add to Favourite
    </button>
  );
}

export default FavBtn;
