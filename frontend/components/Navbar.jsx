import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../src/AuthContext";
import toast from "react-hot-toast";
import Profile from "./Profile";
import {
  Home,
  Heart,
  CalendarDays,
  LogOut,
  LogIn,
  UserPlus,
  User,
  Building2,
  CirclePlus,
} from "lucide-react";
import { FaHome } from "react-icons/fa";

function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const navigate = useNavigate();

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://smartstay-d8sz.onrender.com/logout",
        {},
        { withCredentials: true },
      );
      logout();
      toast.success("Logged Out Successfully!");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Reusable classes
  const navClass = ({ isActive }) =>
    `inline-flex items-center justify-center min-w-[120px]
     text-center text-white font-semibold hover:bg-[#ff4b51]
     py-2.5 px-5 rounded-lg shadow-sm transition-all duration-200
     ${isActive ? "bg-[#ff4b51]" : "bg-[#ff5a5f]"}`;

  const mobileBottomNavClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 px-2 py-1 transition ${
      isActive ? "text-white font-semibold" : "text-white/80 hover:text-white"
    }`;

  return (
    <nav className="bg-[#FF5A5F] px-6 py-8 flex items-center fixed top-0 w-full z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <svg
          className="w-6 h-6 mr-1 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>

        <span className="text-white font-bold text-xl">SmartStay</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex ml-auto items-center">
        <ul className="flex items-center gap-4">
          {isLoggedIn && user?.userType === "user" && (
            <>
              <li>
                <NavLink to="/homes" className={navClass}>
                  HOME
                </NavLink>
              </li>

              <li>
                <NavLink to="/favourites" className={navClass}>
                  FAVOURITES
                </NavLink>
              </li>

              <li>
                <NavLink to="/bookings" className={navClass}>
                  BOOKINGS
                </NavLink>
              </li>
            </>
          )}

          {isLoggedIn && user?.userType === "admin" && (
            <>
              <li>
                <NavLink to="/host/host-home" className={navClass}>
                  MY HOMES
                </NavLink>
              </li>

              <li>
                <NavLink to="/host/add-home" className={navClass}>
                  ADD HOME
                </NavLink>
              </li>
            </>
          )}
          <li>
            <Profile />
          </li>
        </ul>
      </div>

      {/* Profile section for mobile screen */}
      <div className="md:hidden flex ml-auto items-center">
        <div className="md:flex ml-auto items-end">
          <ul className="flex items-center gap-4">
            <li>
              <Profile />
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full md:hidden bg-[#FF5A5F] border-t border-white/20 z-50 shadow-lg mt-16">
        <ul className="flex justify-around items-center h-16">
          {isLoggedIn && user?.userType === "user" && (
            <>
              <li>
                <NavLink to="/homes" className={mobileBottomNavClass}>
                  <Home size={22} />
                  <span className="text-xs">Home</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/favourites" className={mobileBottomNavClass}>
                  <Heart size={22} />
                  <span className="text-xs">Favorites</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/bookings" className={mobileBottomNavClass}>
                  <CalendarDays size={22} />
                  <span className="text-xs">Bookings</span>
                </NavLink>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <>
              <li>
                <NavLink to="/" className={mobileBottomNavClass}>
                  <FaHome size={22} />
                  <span className="text-xs">Home</span>
                </NavLink>
              </li>
            </>
          )}

          {isLoggedIn && user?.userType === "admin" && (
            <>
              <li>
                <NavLink to="/host/host-home" className={mobileBottomNavClass}>
                  <Building2 size={22} />
                  <span className="text-xs">My Homes</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/host/add-home" className={mobileBottomNavClass}>
                  <CirclePlus size={22} />
                  <span className="text-xs">Add Home</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
