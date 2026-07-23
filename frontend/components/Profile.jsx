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
import { CgProfile } from "react-icons/cg";
import { CiLogin } from "react-icons/ci";
import axios from "axios";
import { AuthContext } from "../src/AuthContext";
import toast from "react-hot-toast";

function Profile({ mobileBottomNavClass }) {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(user);

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
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center"
      >
        <CgProfile size={22} />
        <span className="text-xs text-white">Profile</span>
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 md:bottom-auto md:top-full md:mt-2 md:mb-0 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-b border-gray-100 bg-gray-50">
            <img
              src={
                user?.profileImage ||
                "https://i.8upload.com/image/d8d55a55cfe0d45f/profile.png"
              }
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover border border-gray-300"
            />

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {user?.fullName}
              </h3>

              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="py-1">
            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaUserCircle className="text-gray-500 text-base" />
                <span>View Profile</span>
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaUserCircle className="text-gray-500 text-base" />
                  <span>Signup</span>
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <CiLogin className="text-gray-500 text-base" />
                  <span>Login</span>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt className="text-base" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
