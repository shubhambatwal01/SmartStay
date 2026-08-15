import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../src/AuthContext";
import toast from "react-hot-toast";
import { HeartIcon } from "lucide-react";

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
        `https://smartstay-d8sz.onrender.com/favourites`,
        { id: homeId },
        { withCredentials: true },
      );
      navigate("/favourites");
      toast.success(`Home is Added to favourites`);
    } catch (error) {
      console.error("Error adding favourite:", error);
      toast.error("Unable to add favourite");
    }
  };

  return (
    <button
      onClick={handleFavourite}
      className={
        className ||
        "flex p-2 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 hover:text-[#ff5a5f]"
      }
    >
      <HeartIcon />
    </button>
  );
}

export default FavBtn;
