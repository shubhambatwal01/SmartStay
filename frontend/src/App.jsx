import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import HomeIndex from "../pages/HomeIndex";
import Signup from "../pages/Signup";
import HomeList from "../pages/HomeList";
import FavList from "../pages/FavList";
import HomeDetails from "../pages/HomeDetails";
import UserBookings from "../pages/UserBookings";
import AddContact from "../pages/AddContact";
import ContactAdded from "../pages/ContactAdded";
import AddHome from "../pages/AddHome";
import HostHome from "../pages/HostHome";
import HostBookings from "../pages/HostBookings";
import PageNotFound from "../pages/PageNotFound";
import ProfilePage from "../pages/ProfilePage";
import Terms from "../pages/Terms";
import PrivacyPolicy from "../pages/PrivacyPolicy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomeIndex />} />
        <Route path="/homes" element={<HomeList />} />
        <Route path="/homes/:id" element={<HomeDetails />} />
        <Route path="/favourites" element={<FavList />} />
        <Route path="/bookings" element={<UserBookings />} />
        <Route path="/addContact" element={<AddContact />} />
        <Route path="/ContactAdded" element={<ContactAdded />} />
        <Route path="/host/add-home" element={<AddHome />} />
        <Route path="/host/edit-home" element={<AddHome />} />
        <Route path="/host/edit-home/:id" element={<AddHome />} />
        <Route path="/host/host-home" element={<HostHome />} />
        <Route path="/host/bookings" element={<HostBookings />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
