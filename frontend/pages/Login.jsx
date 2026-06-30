import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import { AuthContext } from "../src/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Equivalent to oldInput in EJS
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Equivalent to errors partial
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);

    try {
      const response = await axios.post(
        "http://localhost:1101/login",
        formData,
        { withCredentials: true },
      );

      console.log(response.data);
      login(response.data.user);

      // Redirect after successful login
      navigate(response.data.redirect || "/homes");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["Login failed. Please try again."]);
      }
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
            Login to Your Account
          </h1>
        </div>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
          >
            {/* Error Messages */}
            {errors.length > 0 && <ErrorMessage errors={errors} />}

            <div className="mb-6">
              {/* Email */}
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

              {/* Password */}
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
                autoComplete="current-password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#ff5a5f] hover:bg-[#ff4b51] text-white font-bold py-2 px-4 rounded transition-colors mb-3"
            >
              Login
            </button>

            <div className="text-center">
              <span>Don't have an account? </span>

              <Link to="/signup" className="text-blue-600 underline">
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Login;
