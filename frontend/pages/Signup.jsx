import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/loader";
import toast from "react-hot-toast";

function Signup() {
  document.title = "Sign Up";
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Equivalent to oldInput in EJS
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "user",
    terms: false,
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    if (!formData.terms) {
      setErrors(["Please accept Terms and Conditions"]);
      return;
    }

    try {
      const response = await axios.post(
        "https://smartstay-d8sz.onrender.com/signup",
        formData,
        { withCredentials: true },
      );

      setSubmitting(true);
      toast.success("Signup Successfully!");
      navigate("/login");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
            Create New Account
          </h1>
        </div>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
          >
            {/* Error Messages */}
            {errors.length > 0 && <ErrorMessage errors={errors} />}

            {/* Full Name */}
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
                placeholder="Enter your Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
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
                placeholder="Enter your Email"
                autoComplete="username"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold m-2"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Enter your Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-semibold m-2"
                >
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Confirm your Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* User Type */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold m-2">
                User Type
              </label>

              <div className="flex gap-4 ml-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={formData.userType === "user"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>User</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={formData.userType === "admin"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Admin</span>
                </label>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-center gap-3 text-gray-700 font-semibold">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />

                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 underline">
                    Terms and Conditions
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="mb-3">
              <button
                type="submit"
                className="w-full bg-[#ff5a5f] hover:bg-[#ff4b51] text-white font-bold py-2 px-4 rounded transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader fullscreen={false} />
                  </>
                ) : (
                  "Signup"
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <span>Already have an account? </span>

              <Link to="/login" className="text-blue-600 underline">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Signup;
