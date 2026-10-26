import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import HomeIndex from "../src/pages/HomeIndex";
import Signup from "../src/pages/Signup";
import HomeList from "../src/pages/HomeList";
import FavList from "../src/pages/FavList";
import HomeDetails from "../src/pages/HomeDetails";
import UserBookings from "../src/pages/UserBookings";
import AddContact from "../src/pages/AddContact";
import ContactAdded from "../src/pages/ContactAdded";
import AddHome from "../src/pages/AddHome";
import HostHome from "../src/pages/HostHome";
import HostBookings from "../src/pages/HostBookings";
import PageNotFound from "../src/pages/PageNotFound";
import ProfilePage from "../src/pages/ProfilePage";
import Terms from "../src/pages/Terms";
import PrivacyPolicy from "../src/pages/PrivacyPolicy";

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
