import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import HomeIndex from "../pages/HomeIndex";
import Signup from "../pages/Signup";
import HomeList from "../pages/HomeList";
import FavList from "../pages/FavList";
import HomeDetails from "../pages/HomeDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomeIndex />} />
        <Route path="/homes" element={<HomeList />} />
        <Route path="/homes/:id" element={<HomeDetails />} />
        <Route path="/favourite-list" element={<FavList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
