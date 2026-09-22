import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import { AuthContext } from "../src/AuthContext";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { Mail, LockKeyhole, LogIn, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { API_URL } from "../src/config.js";

function Login() {
  document.title = "Login";

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setErrors(["Google did not return a valid credential."]);
      return;
    }

    setErrors([]);
    setSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/google`,
        { credential: credentialResponse.credential },
        { withCredentials: true },
      );

      login(response.data.user);
      toast.success("Signed in with Google successfully!");
      navigate(response.data.redirect || "/homes");
    } catch (error) {
      console.error("Google login failed:", error);
      setErrors([
        error.response?.data?.message ||
          "Google login failed. Please try again.",
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setErrors(["Google sign-in was cancelled or failed. Please try again."]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);
    setSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/login`, formData, {
        withCredentials: true,
      });

      login(response.data.user);

      toast.success("Logged-In Successfully!");

      navigate(response.data.redirect || "/homes");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["Login failed. Please try again."]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa] pt-28 pb-24 md:pb-16">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 sm:px-6">
          <div className=" w-fit max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-2">
            <div className="p-6 sm:p-10 md:p-12">
              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#ff5a5f]">
                  Welcome back
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Login to your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Enter your credentials to continue to SmartStay.
                </p>
              </div>

              {errors.length > 0 && (
                <div className="mb-5">
                  <ErrorMessage errors={errors} />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="group flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-[#ff5a5f] focus-within:ring-4 focus-within:ring-[#ff5a5f]/10">
                    <Mail
                      size={19}
                      className="shrink-0 text-gray-400 transition group-focus-within:text-[#ff5a5f]"
                    />

                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <div className="group flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-[#ff5a5f] focus-within:ring-4 focus-within:ring-[#ff5a5f]/10">
                    <LockKeyhole
                      size={19}
                      className="shrink-0 text-gray-400 transition group-focus-within:text-[#ff5a5f]"
                    />

                    <input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#ff5a5f] to-[#ff4047] px-4 py-3.5 font-bold text-white shadow-lg shadow-red-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <Loader fullscreen={false} />
                  ) : (
                    <>
                      <LogIn size={19} />
                      Login
                    </>
                  )}
                </button>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Or continue with
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    shape="rectangular"
                    size="large"
                    width="360"
                    text="signin_with"
                  />
                </div>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    New to SmartStay?
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <Link
                  to="/signup"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-[#ff5a5f] hover:bg-[#fff8f8] hover:text-[#ff5a5f]"
                >
                  Create a new account
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </form>

              <p className="mt-7 text-center text-xs leading-5 text-gray-400">
                By continuing, you agree to SmartStay's Terms and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Login;
