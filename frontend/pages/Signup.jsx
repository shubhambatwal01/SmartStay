import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/loader";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  User,
  Building2,
} from "lucide-react";

function Signup() {
  document.title = "Sign Up";

  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    if (!formData.terms) {
      setErrors(["Please accept Terms and Conditions"]);
      return;
    }

    setSubmitting(true);

    try {
      await axios.post("https://smartstay-8bre.onrender.com/signup", formData, {
        withCredentials: true,
      });

      toast.success("Signup Successfully!");

      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map((err) => err.message || err));
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

      <main className="min-h-screen bg-[#fafafa] pt-28 pb-24 md:pb-16">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 sm:px-6">
          <div className="w-fit max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:grid-cols-[0.85fr_1.15fr]">
            <div className="p-6 sm:p-10 lg:p-12">
              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#ff5a5f]">
                  Join SmartStay
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Create your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Enter your information below to get started.
                </p>
              </div>

              {errors.length > 0 && (
                <div className="mb-6">
                  <ErrorMessage errors={errors} />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>

                  <div className="group flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-[#ff5a5f] focus-within:ring-4 focus-within:ring-[#ff5a5f]/10">
                    <UserRound
                      size={19}
                      className="shrink-0 text-gray-400 transition group-focus-within:text-[#ff5a5f]"
                    />

                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
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
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="mb-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>

                    <div className="group flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-[#ff5a5f] focus-within:ring-4 focus-within:ring-[#ff5a5f]/10">
                      <LockKeyhole
                        size={18}
                        className="shrink-0 text-gray-400 transition group-focus-within:text-[#ff5a5f]"
                      />

                      <input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full min-w-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Confirm Password
                    </label>

                    <div className="group flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-[#ff5a5f] focus-within:ring-4 focus-within:ring-[#ff5a5f]/10">
                      <LockKeyhole
                        size={18}
                        className="shrink-0 text-gray-400 transition group-focus-within:text-[#ff5a5f]"
                      />

                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full min-w-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Account Type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        formData.userType === "user"
                          ? "border-[#ff5a5f] bg-[#fff7f7] ring-2 ring-[#ff5a5f]/10"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value="user"
                        checked={formData.userType === "user"}
                        onChange={handleChange}
                        className="sr-only"
                      />

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            formData.userType === "user"
                              ? "bg-[#ff5a5f] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <User size={19} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            User
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            Book stays
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        formData.userType === "admin"
                          ? "border-[#ff5a5f] bg-[#fff7f7] ring-2 ring-[#ff5a5f]/10"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value="admin"
                        checked={formData.userType === "admin"}
                        onChange={handleChange}
                        className="sr-only"
                      />

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            formData.userType === "admin"
                              ? "bg-[#ff5a5f] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Building2 size={19} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            Admin
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            Manage homes
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mb-6 rounded-xl bg-gray-50 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#ff5a5f]"
                    />

                    <span className="text-sm leading-6 text-gray-600">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="font-semibold text-[#ff5a5f] hover:underline"
                      >
                        Terms and Conditions
                      </Link>
                    </span>
                  </label>
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
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="whitespace-nowrap text-xs font-medium uppercase tracking-wider text-gray-400">
                    Already a member?
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <Link
                  to="/login"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-[#ff5a5f] hover:bg-[#fff8f8] hover:text-[#ff5a5f]"
                >
                  Login to your account
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Signup;
