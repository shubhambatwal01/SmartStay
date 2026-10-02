import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../src/AuthContext";
import Profile from "./Profile";
import {
  Home,
  Heart,
  CalendarDays,
  Building2,
  CirclePlus,
  Search,
  X,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { FaHome } from "react-icons/fa";

function Navbar() {
  const { isLoggedIn, user } = useContext(AuthContext);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [homes, setHomes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const mobileSearchInputRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

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
    const handleSearchOutside = (event) => {
      const desktopClicked = desktopSearchRef.current?.contains(event.target);
      const mobileClicked = mobileSearchRef.current?.contains(event.target);

      if (!desktopClicked && !mobileClicked) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleSearchOutside);

    return () => {
      document.removeEventListener("mousedown", handleSearchOutside);
    };
  }, []);

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

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    if (searchResults.length > 0) {
      handleSelectHome(searchResults[0]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const navClass = ({ isActive }) =>
    `relative inline-flex items-center justify-center rounded-xl px-4 py-2.5
     text-sm font-semibold tracking-wide transition-all duration-200
     ${
       isActive
         ? "bg-white text-[#ff5a5f] shadow-md"
         : "text-white/90 hover:bg-white/10 hover:text-white"
     }`;

  const mobileBottomNavClass = ({ isActive }) =>
    `flex min-w-[72px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2
     transition-all duration-200 ${
       isActive ? "text-white" : "text-white/70 hover:text-white"
     }`;

  const SearchResults = () => {
    if (!showSearchResults || !searchQuery.trim()) return null;

    return (
      <div className="absolute left-0 top-full z-100 mt-3 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
            Search results
          </p>
        </div>

        {searchResults.length > 0 ? (
          <div className="max-h-80 overflow-y-auto py-1">
            {searchResults.map((home) => (
              <button
                key={home._id}
                type="button"
                onClick={() => handleSelectHome(home)}
                className="group/result flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left transition last:border-none hover:bg-[#fff7f7]"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {home.houseImg ? (
                    <img
                      src={home.houseImg}
                      alt={home.houseName}
                      className="h-full w-full object-cover transition duration-300 group-hover/result:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#ff5a5f]">
                      <Home size={20} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {home.houseName}
                  </p>

                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
                    <MapPin size={12} className="shrink-0 text-[#ff5a5f]" />
                    <span className="truncate">{home.houseAddr}</span>
                  </p>

                  <div className="mt-1.5 flex items-center gap-2">
                    {home.bhk && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                        {home.bhk}
                      </span>
                    )}

                    {home.housePrice && (
                      <span className="text-[11px] font-bold text-[#ff5a5f]">
                        ₹{home.housePrice}/night
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="shrink-0 text-gray-300 transition group-hover/result:translate-x-0.5 group-hover/result:text-[#ff5a5f]"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
              <Search size={22} />
            </div>

            <p className="mt-3 text-sm font-bold text-gray-800">
              No homes found
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-400">
              Try searching by home name, city, location, or house type.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#FF5A5F] shadow-[0_4px_20px_rgba(255,90,95,0.18)]">
        <div className="mx-auto flex h-19 max-w-360 items-center px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-90"
          >
            <img
              src="https://i.8upload.com/image/b1904ccaade1c142/smartstay-creative-white-logo.png"
              alt="SmartStay"
              className="h-11 w-auto object-contain sm:h-12"
            />
          </Link>

          {/* Desktop Search */}
          <div
            ref={desktopSearchRef}
            className="relative ml-7 hidden w-full max-w-90 md:block lg:ml-10"
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="group flex h-11 items-center gap-2.5 rounded-xl border border-white/20 bg-white/15 px-3.5 backdrop-blur-sm transition-all duration-200 focus-within:border-white/70 focus-within:bg-white focus-within:shadow-lg">
                <Search
                  size={18}
                  className="shrink-0 text-white/90 transition group-focus-within:text-[#ff5a5f]"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Search homes, cities..."
                  autoComplete="off"
                  className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/75 group-focus-within:text-gray-800 group-focus-within:placeholder:text-gray-400"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 group-focus-within:flex"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </form>

            <SearchResults />
          </div>

          {/* Desktop Menu */}
          <div className="ml-auto hidden items-center md:flex">
            <ul className="flex items-center gap-1 lg:gap-2">
              {isLoggedIn && user?.userType === "user" && (
                <>
                  <li>
                    <NavLink to="/homes" className={navClass}>
                      Home
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/favourites" className={navClass}>
                      Favourites
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/bookings" className={navClass}>
                      Bookings
                    </NavLink>
                  </li>
                </>
              )}

              {isLoggedIn && user?.userType === "admin" && (
                <>
                  <li>
                    <NavLink to="/host/host-home" className={navClass}>
                      My Homes
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/host/add-home" className={navClass}>
                      Add Home
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/host/bookings" className={navClass}>
                      Bookings
                    </NavLink>
                  </li>
                </>
              )}

              <li className="ml-2 border-l border-white/20 pl-3">
                <Profile />
              </li>
            </ul>
          </div>

          {/* Mobile Search Actions */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            {!isMobileSearchOpen && (
              <button
                type="button"
                aria-label="Open search"
                onClick={() => {
                  setIsMobileSearchOpen(true);
                  setShowSearchResults(true);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl  text-white transition "
              >
                <Search size={21} />
              </button>
            )}

            <div className="flex h-10 items-center px-1.5">
              <Profile />
            </div>
          </div>

          {/* Mobile Search Overlay */}
          {isMobileSearchOpen && (
            <div className="absolute inset-0 flex items-center bg-[#FF5A5F] px-4 md:hidden">
              <div
                ref={mobileSearchRef}
                className="relative mx-auto flex w-full max-w-xl items-center gap-2"
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex w-full items-center gap-2"
                >
                  <div className="flex h-11 flex-1 items-center gap-2.5 rounded-xl bg-white px-3.5 shadow-lg">
                    <Search size={18} className="shrink-0 text-[#ff5a5f]" />

                    <input
                      ref={mobileSearchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => setShowSearchResults(true)}
                      placeholder="Search homes, cities..."
                      autoComplete="off"
                      className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        aria-label="Clear search"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => {
                      setIsMobileSearchOpen(false);
                      clearSearch();
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  text-white transition hover:bg-white/20"
                  >
                    <X size={21} />
                  </button>
                </form>

                <SearchResults />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-[#FF5A5F]/95 px-3 py-2 shadow-[0_-6px_25px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden">
        <ul className="mx-auto flex h-13.5 max-w-md items-center justify-around">
          {isLoggedIn && user?.userType === "user" && (
            <>
              <li>
                <NavLink to="/homes" className={mobileBottomNavClass}>
                  <Home size={21} />
                  <span className="text-[11px] font-medium">Home</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/favourites" className={mobileBottomNavClass}>
                  <Heart size={21} />
                  <span className="text-[11px] font-medium">Favorites</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/bookings" className={mobileBottomNavClass}>
                  <CalendarDays size={21} />
                  <span className="text-[11px] font-medium">Bookings</span>
                </NavLink>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <li>
              <NavLink to="/" className={mobileBottomNavClass}>
                <FaHome size={21} />
                <span className="text-[11px] font-medium">Home</span>
              </NavLink>
            </li>
          )}

          {isLoggedIn && user?.userType === "admin" && (
            <>
              <li>
                <NavLink to="/host/host-home" className={mobileBottomNavClass}>
                  <Building2 size={21} />
                  <span className="text-[11px] font-medium">My Homes</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/host/add-home" className={mobileBottomNavClass}>
                  <CirclePlus size={21} />
                  <span className="text-[11px] font-medium">Add Home</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/host/bookings" className={mobileBottomNavClass}>
                  <CalendarDays size={21} />
                  <span className="text-[11px] font-medium">Bookings</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default Navbar;
