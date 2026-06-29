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
      data.append("attachedBathroom", formData.attachedBathroom);

      if (editing) {
        data.append("id", id);
      }

      if (houseImg) {
        data.append("houseImg", houseImg);
      }

      if (editing) {
        await axios.post("http://localhost:1101/host/edit-home", data, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post("http://localhost:1101/host/add-home", data, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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

      <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 mt-32 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-3">
              {editing ? "Edit" : "Register"} Your Home
            </h1>
            <p className="text-gray-600 text-lg">
              {editing
                ? "Update your home details"
                : "Share your amazing property with our community"}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {errors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500">
                <ErrorMessage errors={errors} />
              </div>
            )}

            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-[#ff5a5f] rounded mr-3"></span>
                  Basic Information
                </h2>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    House Name
                  </label>
                  <input
                    type="text"
                    name="houseName"
                    value={formData.houseName}
                    onChange={handleChange}
                    placeholder="e.g., Coastal Villa, Mountain Retreat"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    House Address
                  </label>
                  <input
                    type="text"
                    name="houseAddr"
                    value={formData.houseAddr}
                    onChange={handleChange}
                    placeholder="e.g., 123 Main Street, City, State"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Price Per Night
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-2xl text-gray-600">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="housePrice"
                      value={formData.housePrice}
                      onChange={handleChange}
                      placeholder="5000"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    House Type
                  </label>
                  <select
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition bg-white cursor-pointer"
                  >
                    <option value="">Select BHK Type</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-[#ff5a5f] rounded mr-3"></span>
                  House Image
                </h2>

                <div className="mb-6">
                  <label className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#ff5a5f] hover:bg-red-50 transition">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-600 font-semibold">
                        Click to upload image
                      </p>
                      <p className="text-gray-400 text-sm">Max size: 500 KB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Preview
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-[#ff5a5f] rounded mr-3"></span>
                  Home Facilities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                        formData[name]
                          ? "border-[#ff5a5f] bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={name}
                        checked={formData[name]}
                        onChange={handleChange}
                        className="w-5 h-5 cursor-pointer accent-[#ff5a5f]"
                      />
                      <span className="font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-[#ff5a5f] rounded mr-3"></span>
                  Description
                </h2>

                <label className="block text-gray-700 font-semibold mb-2">
                  House Description
                </label>
                <textarea
                  name="houseDesc"
                  value={formData.houseDesc}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your home... Share unique features, nearby attractions, house rules, etc."
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-linear-to-r from-[#ff5a5f] to-[#ff4b51] hover:from-[#ff4b51] hover:to-[#ff3a41] text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader fullscreen={false} />
                    <span>{editing ? "Updating..." : "Adding..."}</span>
                  </>
                ) : editing ? (
                  "Update Home"
                ) : (
                  "Add Home"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AddHome;