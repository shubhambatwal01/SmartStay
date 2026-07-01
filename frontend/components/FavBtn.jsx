import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../src/AuthContext";

function FavBtn({ homeId, className }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const handleFavourite = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://smartstay-d8sz.onrender.com/favourites",
        { id: homeId },
        { withCredentials: true },
      );
      navigate("/favourites");
      alert(`Home is Added to favourites`);
    } catch (error) {
      console.error("Error adding favourite:", error);
      alert("Unable to add favourite");
    }
  };

  return (
    <button
      onClick={handleFavourite}
      className={
        className ||
        "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      }
    >
      Add to Favourite
    </button>
  );
}

export default FavBtn;
