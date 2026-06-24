import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import HomeIndex from "../pages/HomeIndex";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeIndex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
