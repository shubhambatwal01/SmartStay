import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/loader";

function AddHome() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    houseName: "",
    houseAddr: "",
    housePrice: "",
    houseDesc: "",
    bhk: "",
    wifi: false,
    washingMachine: false,
    caretaker: false,
    kitchen: false,
    parking: false,
    ac: false,
    smartTv: false,
    attachedBathroom: false,
  });

  const [houseImg, setHouseImg] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (editing) {
      fetchHome();
    }
  }, [id]);

  const fetchHome = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1101/host/edit-home/${id}`,
        {
          withCredentials: true,
        },
      );

      const home = response.data.home || response.data;

      setFormData({
        houseName: home.houseName || "",
        houseAddr: home.houseAddr || "",
        housePrice: home.housePrice || "",
        houseDesc: home.houseDesc || "",
        bhk: home.bhk || "",
        wifi: home.wifi || false,
        washingMachine: home.washingMachine || false,
        caretaker: home.caretaker || false,
        kitchen: home.kitchen || false,
        parking: home.parking || false,
        ac: home.ac || false,
        smartTv: home.smartTv || false,
        attachedBathroom: home.attachedBathroom || false,
      });

      setPreviewImage(home.houseImg || "");
    } catch (error) {
      console.log(error);
      setErrors(["Unable to fetch home details"]);
    }
  };

  // Handles both text fields and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setErrors([]);

    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 500 * 1024) {
      setErrors(["File size should be less than 500 KB"]);
      return;
    }

    setHouseImg(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);
    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("houseName", formData.houseName);
      data.append("houseAddr", formData.houseAddr);
      data.append("housePrice", formData.housePrice);
      data.append("houseDesc", formData.houseDesc);
      data.append("bhk", formData.bhk);
      data.append("wifi", formData.wifi);
      data.append("washingMachine", formData.washingMachine);
      data.append("caretaker", formData.caretaker);
      data.append("kitchen", formData.kitchen);
      data.append("parking", formData.parking);
      data.append("ac", formData.ac);
      data.append("smartTv", formData.smartTv);
      data.append(
        "attachedBathroom",
        formData.attachedBathroom,
      );

      if (editing) {
        data.append("id", id);
      }

      if (houseImg) {
        data.append("houseImg", houseImg);
      }

      if (editing) {
        await axios.post(
          "http://localhost:1101/host/edit-home",
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        await axios.post(
          "http://localhost:1101/host/add-home",
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      navigate("/host/host-home");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["Something went wrong"]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          {editing ? "Edit" : "Register"} Your Home
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl"
          >
            {errors.length > 0 && (
              <ErrorMessage errors={errors} />
            )}

            {/* House Name */}
            <label className="block font-semibold mb-2">
              House Name
            </label>
            <input
              type="text"
              name="houseName"
              value={formData.houseName}
              onChange={handleChange}
              placeholder="Enter House Name"
              required
              className="w-full border rounded p-2 mb-4"
            />

            {/* Address */}
            <label className="block font-semibold mb-2">
              House Address
            </label>
            <input
              type="text"
              name="houseAddr"
              value={formData.houseAddr}
              onChange={handleChange}
              placeholder="Enter House Address"
              required
              className="w-full border rounded p-2 mb-4"
            />

            {/* Price */}
            <label className="block font-semibold mb-2">
              House Price Per Night
            </label>
            <input
              type="number"
              name="housePrice"
              value={formData.housePrice}
              onChange={handleChange}
              placeholder="Enter Price"
              required
              className="w-full border rounded p-2 mb-4"
            />

            {/* Image */}
            <label className="block font-semibold mb-2">
              House Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded p-2 mb-4"
            />

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-56 object-cover rounded mb-4"
              />
            )}

            {/* BHK */}
            <label className="block font-semibold mb-2">
              House Type
            </label>
            <select
              name="bhk"
              value={formData.bhk}
              onChange={handleChange}
              required
              className="w-full border rounded p-2 mb-6"
            >
              <option value="">Select BHK Type</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
              <option value="Villa">Villa</option>
            </select>

            {/* Facilities */}
            <h2 className="text-2xl font-bold text-[#ff5a5f] mb-4">
              Home Facilities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                ["wifi", "📶 Free Wi-Fi"],
                ["washingMachine", "🧺 Washing Machine"],
                ["caretaker", "👨‍🔧 Caretaker Available"],
                ["kitchen", "🍳 Kitchen"],
                ["parking", "🚗 Free Parking"],
                ["ac", "❄️ Air Conditioner"],
                ["smartTv", "📺 Smart TV"],
                ["attachedBathroom", "🛁 Attached Bathroom"],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name]}
                    onChange={handleChange}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Description */}
            <label className="block font-semibold mb-2">
              House Description
            </label>
            <textarea
              name="houseDesc"
              value={formData.houseDesc}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your home..."
              required
              className="w-full border rounded p-2 mb-6"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#ff5a5f] hover:bg-[#ff4b51] text-white py-3 rounded font-bold"
            >
              {submitting ? (
                <span className="flex justify-center">
                  <Loader fullscreen={false} />
                </span>
              ) : editing ? (
                "Update Home"
              ) : (
                "Add Home"
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AddHome;