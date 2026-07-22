import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaHeart,
  FaCalendarAlt,
  FaHome,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../src/AuthContext";

function Profile() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [open, setOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("https://smartstay-d8sz.onrender.com/logout", {
        withCredentials: true,
      });
      logout();
      toast.success("Logged Out Successfully!");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}

      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center"
      >
        <img
          src={user?.profileImage || "https://i.pravatar.cc/150?img=12"}
          alt=""
          className="w-10 h-10 rounded-full border object-cover"
        />

        <div className="flex items-center text-sm">
          Me
          <FaChevronDown className="ml-1 text-xs" />
        </div>
      </button>

      {/* Dropdown */}

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border z-50">
          <div className="p-5 border-b">
            <div className="flex gap-3">
              <img
                src={user?.profileImage || "https://i.pravatar.cc/150?img=12"}
                className="w-14 h-14 rounded-full"
              />

              <div>
                <h3 className="font-semibold">{user?.fullName}</h3>

                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100"
          >
            <FaUserCircle />
            View Profile
          </Link>

          <div className="border-t mt-2">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
