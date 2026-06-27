import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import HomeIndex from "../pages/HomeIndex";
import Signup from "../pages/Signup";
import HomeList from "../pages/HomeList";
import FavList from "../pages/FavList";
import HomeDetails from "../pages/HomeDetails";
import Bookings from "../pages/Bookings";
import AddContact from "../pages/AddContact";
import ContactAdded from "../pages/ContactAdded";
import AddHome from "../pages/AddHome";
import HostHome from "../pages/HostHome";

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
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/addContact" element={<AddContact />} />
        <Route path="/addContact" element={<ContactAdded />} />
        <Route path="/add-home" element={<AddHome />} />
        <Route path="/edit-home" element={<AddHome />} />
        <Route path="/edit-home/:id" element={<AddHome />} />
        <Route path="/host-home" element={<HostHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
