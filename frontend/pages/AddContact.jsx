import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";

function AddContact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:1101/host/addContact",
        formData,
      );

      setSuccessMessage(
        response.data.message ||
          "Your message has been submitted successfully.",
      );

      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-16">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Contact Us
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
          >
            {errors.length > 0 && <ErrorMessage errors={errors} />}

            {successMessage && (
              <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">
                {successMessage}
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="fullName"
                className="block text-gray-700 font-semibold m-2"
              >
                Full Name
              </label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name here!"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold m-2"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email here!"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label
                htmlFor="message"
                className="block text-gray-700 font-semibold m-2"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                placeholder="Enter your queries or feedback here!"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="flex justify-center w-full bg-[#ff5a5f] hover:bg-[#ff4b51] text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AddContact;
