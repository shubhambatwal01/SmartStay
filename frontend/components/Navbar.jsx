import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({ isLoggedIn, user }) {
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
      await axios.post("/auth/logout");

      // Optional: remove token/localStorage
      localStorage.removeItem("token");

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

  const mobileNavClass = ({ isActive }) =>
    `flex items-center justify-center w-full text-center
     text-white font-semibold hover:bg-[#ff4b51]
     py-3 px-4 rounded-lg shadow-sm transition-all duration-200
     ${isActive ? "bg-[#ff4b51]" : "bg-[#ff5a5f]"}`;

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
        <ul className="flex items-center gap-3">
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
                <NavLink to="/host/homes" className={navClass}>
                  HOST HOME
                </NavLink>
              </li>

              <li>
                <NavLink to="/host/add-home" className={navClass}>
                  ADD HOME
                </NavLink>
              </li>
            </>
          )}

          {!isLoggedIn ? (
            <>
              <li>
                <NavLink to="/signup" className={navClass}>
                  SIGN UP
                </NavLink>
              </li>

              <li>
                <NavLink to="/login" className={navClass}>
                  LOGIN
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center min-w-30
                text-center text-white font-semibold hover:bg-[#ff4b51]
                py-2.5 px-5 rounded-lg shadow-sm transition-all duration-200"
              >
                LOGOUT
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden ml-auto">
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-20 left-0 w-full md:hidden px-3 py-3 bg-[#FF5A5F]"
        >
          <ul className="flex flex-col gap-3">
            {isLoggedIn && user?.userType === "user" && (
              <>
                <li>
                  <NavLink
                    to="/homes"
                    className={mobileNavClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    HOME
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/favourites"
                    className={mobileNavClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAVOURITES
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/bookings"
                    className={mobileNavClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    BOOKINGS
                  </NavLink>
                </li>
              </>
            )}

            {isLoggedIn && user?.userType === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/host/homes"
                    className={mobileNavClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    HOST HOME
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/host/add-home"
                    className={mobileNavClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ADD HOME
                  </NavLink>
                </li>
              </>
            )}

            {!isLoggedIn ? (
              <>
                <li>
                  <NavLink
                    to="/signup"
                    className={mobileNavClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    SIGN UP
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/login"
                    className={mobileNavClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    LOGIN
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full
                  text-center text-white font-semibold hover:bg-[#ff4b51]
                  py-3 px-4 rounded-lg shadow-sm transition-all duration-200"
                >
                  LOGOUT
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
