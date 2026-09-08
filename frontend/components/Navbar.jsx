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
  Building2,
  CirclePlus,
  Search,
  X,
} from "lucide-react";
import { FaHome } from "react-icons/fa";

function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [homes, setHomes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const navigate = useNavigate();

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

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Fetch homes for searching
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await axios.get(
          "https://smartstay-8bre.onrender.com/homes",
          {
            withCredentials: true,
          },
        );

        const homesData = Array.isArray(response.data)
          ? response.data
          : response.data?.homes || [];

        setHomes(homesData);
      } catch (error) {
        console.error("Error fetching homes for search:", error);
      }
    };

    fetchHomes();
  }, []);

  // Search homes
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchResults([]);
      return;
    }

    const filteredHomes = homes.filter((home) => {
      const houseName = home.houseName?.toLowerCase() || "";
      const houseAddr = home.houseAddr?.toLowerCase() || "";
      const bhk = home.bhk?.toLowerCase() || "";
      const description = home.houseDesc?.toLowerCase() || "";

      return (
        houseName.includes(query) ||
        houseAddr.includes(query) ||
        bhk.includes(query) ||
        description.includes(query)
      );
    });

    setSearchResults(filteredHomes.slice(0, 6));
  }, [searchQuery, homes]);

  useEffect(() => {
    const handleSearchOutside = (e) => {
      const desktopClicked =
        desktopSearchRef.current && desktopSearchRef.current.contains(e.target);

      const mobileClicked =
        mobileSearchRef.current && mobileSearchRef.current.contains(e.target);

      if (!desktopClicked && !mobileClicked) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleSearchOutside);

    return () => {
      document.removeEventListener("mousedown", handleSearchOutside);
    };
  }, []);

  // Open selected home
  const handleSelectHome = (home) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setIsMobileSearchOpen(false);

    if (isLoggedIn) {
      navigate(`/homes/${home._id}`);
    } else {
      navigate("/login");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = searchQuery.trim();

    if (!trimmed) return;

    if (searchResults.length > 0) {
      handleSelectHome(searchResults[0]);
      return;
    }

    toast.error("No homes found");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const navClass = ({ isActive }) =>
    `inline-flex items-center justify-center min-w-[120px]
     text-center text-white font-semibold hover:bg-[#ff4b51]
     py-2.5 px-5 rounded-lg shadow-sm transition-all duration-200
     ${isActive ? "bg-[#ff4b51]" : "bg-[#ff5a5f]"}`;

  const mobileBottomNavClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 px-2 py-1 transition ${
      isActive ? "text-white font-semibold" : "text-white/80 hover:text-white"
    }`;

  const SearchResults = () => {
    if (!showSearchResults || !searchQuery.trim()) {
      return null;
    }

    return (
      <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-100">
        {searchResults.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {searchResults.map((home) => (
              <button
                key={home._id}
                type="button"
                onClick={() => handleSelectHome(home)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition border-b border-gray-100 last:border-none"
              >
                {home.houseImg && (
                  <img
                    src={home.houseImg}
                    alt={home.houseName}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {home.houseName}
                  </p>

                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {home.houseAddr}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    {home.bhk && (
                      <span className="text-[11px] text-gray-500">
                        {home.bhk}
                      </span>
                    )}

                    {home.housePrice && (
                      <span className="text-[11px] font-semibold text-[#ff5a5f]">
                        ₹{home.housePrice}/night
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-5 text-center">
            <Search size={24} className="mx-auto text-gray-300 mb-2" />

            <p className="text-sm font-semibold text-gray-700">
              No homes found
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Search by home name, city or house type
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-[#FF5A5F] px-6 py-8 flex items-center fixed top-0 w-full z-50">
      <Link to="/" className="flex items-center">
        <img
          src="/Public/SmartStay_creative_white_logo.png"
          alt="logo"
          className="h-13 w-fit"
        />
      </Link>

      <div ref={desktopSearchRef} className="hidden md:block ml-10 relative">
        <form onSubmit={handleSearchSubmit} className="flex items-center group">
          <div
            className="flex items-center gap-2 bg-white/20 focus-within:bg-white
                       rounded-md px-3 py-2 w-48 focus-within:w-72
                       transition-all duration-200 ease-in-out"
          >
            <Search
              size={18}
              className="text-white/90 group-focus-within:text-gray-500 shrink-0"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search homes, cities..."
              autoComplete="off"
              className="bg-transparent outline-none border-none text-sm w-full
                         text-white placeholder-white/80
                         group-focus-within:text-gray-800
                         group-focus-within:placeholder-gray-500"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="hidden group-focus-within:block"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        </form>

        <SearchResults />
      </div>

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

              <li>
                <NavLink to="/host/bookings" className={navClass}>
                  MANAGE BOOKINGS
                </NavLink>
              </li>
            </>
          )}

          <li>
            <Profile />
          </li>
        </ul>
      </div>

      <div className="md:hidden flex ml-auto items-center gap-4">
        {!isMobileSearchOpen && (
          <button
            type="button"
            aria-label="Open search"
            onClick={() => {
              setIsMobileSearchOpen(true);
              setShowSearchResults(true);
            }}
            className="text-white p-1.5 rounded-full hover:bg-white/20 transition"
          >
            <Search size={25} />
          </button>
        )}

        <div className="md:flex ml-auto items-end">
          <ul className="flex items-center gap-4">
            <li>
              <Profile />
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden absolute inset-0 h-full w-full bg-[#FF5A5F] flex items-center px-4">
          <div
            ref={mobileSearchRef}
            className="relative flex items-center gap-2 w-full"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 w-full"
            >
              <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 flex-1">
                <Search size={18} className="text-gray-500 shrink-0" />

                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Search homes, cities..."
                  autoComplete="off"
                  className="bg-transparent outline-none border-none text-sm w-full text-gray-800 placeholder-gray-500"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                )}
              </div>

              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                className="text-white p-1.5 rounded-full hover:bg-white/20 transition shrink-0"
              >
                <X size={22} />
              </button>
            </form>

            <SearchResults />
          </div>
        </div>
      )}

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

              <li>
                <NavLink to="/host/bookings" className={mobileBottomNavClass}>
                  <CalendarDays size={22} />
                  <span className="text-xs">Bookings</span>
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
