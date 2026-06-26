import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";

function AddHome() {
  const { id } = useParams(); // present only during edit
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    houseName: "",
    houseAddr: "",
    housePrice: "",
    houseImg: "",
    houseDesc: "",
  });

  useEffect(() => {
    if (editing) {
      fetchHome();
    }
  }, [id]);

  const fetchHome = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1101/host/host-home/${id}`,
      );

      const home = response.data.home;
      console.log(response.data);
      console.log(response.data.home);

      setFormData({
        houseName: home.houseName || "",
        houseAddr: home.houseAddr || "",
        housePrice: home.housePrice || "",
        houseImg: home.houseImg || "",
        houseDesc: home.houseDesc || "",
      });
    } catch (error) {
      console.log(error);
      setErrors(["Unable to fetch home details"]);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);

    try {
      if (editing) {
        // Edit
        await axios.put(`http://localhost:1101/host/edit-home/${id}`, formData);
      } else {
        // Add Home
        await axios.post("http://localhost:1101/host/add-home", formData);
      }

      navigate("/host-home");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["Something went wrong"]);
      }
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {editing ? "Edit" : "Register"} Your Home Here!
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
          >
            {errors.length > 0 && <ErrorMessage errors={errors} />}

            <div className="mb-6">
              <label
                htmlFor="houseName"
                className="block text-gray-700 font-semibold m-2"
              >
                House Name
              </label>

              <input
                type="text"
                id="houseName"
                name="houseName"
                value={formData.houseName}
                onChange={handleChange}
                placeholder="Enter the Name of your house"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label
                htmlFor="houseAddr"
                className="block text-gray-700 font-semibold m-2"
              >
                House Address
              </label>

              <input
                type="text"
                id="houseAddr"
                name="houseAddr"
                value={formData.houseAddr}
                onChange={handleChange}
                placeholder="Enter the Address of your house"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label
                htmlFor="housePrice"
                className="block text-gray-700 font-semibold m-2"
              >
                House Price
              </label>

              <input
                type="number"
                id="housePrice"
                name="housePrice"
                value={formData.housePrice}
                onChange={handleChange}
                placeholder="Enter the price of your house"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label
                htmlFor="houseImg"
                className="block text-gray-700 font-semibold m-2"
              >
                House Image URL
              </label>

              <input
                type="url"
                id="houseImg"
                name="houseImg"
                value={formData.houseImg}
                onChange={handleChange}
                placeholder="Enter the image URL of your house"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label
                htmlFor="houseDesc"
                className="block text-gray-700 font-semibold m-2"
              >
                House Description
              </label>

              <textarea
                id="houseDesc"
                name="houseDesc"
                value={formData.houseDesc}
                onChange={handleChange}
                placeholder="Enter the Description of your house"
                rows="4"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff5a5f] hover:bg-[#ff4b51] text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {editing ? "Update Home" : "Add Home"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AddHome;
