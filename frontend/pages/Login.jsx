import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  const navigate = useNavigate();

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
      const response = await axios.post("/auth/login", formData);

      console.log(response.data);

      // Redirect after successful login
      navigate("/");
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
      {/* <Navbar /> */}

      <main className="min-h-screen mt-32">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login to Your Account
        </h1>

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

      {/* <Footer /> */}
    </>
  );
}

export default Login;
