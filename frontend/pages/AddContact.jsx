import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import axios from "axios";

function ContactUs() {
  document.title = "Contact Us";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "https://smartstay-d8sz.onrender.com/host/addContact",
        formData,
        {
          withCredentials: true,
        },
      );

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <section className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent">
            Contact Us
          </h1>
        </section>

        <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="w-12 h-12 rounded-xl bg-[#fff0f1] flex items-center justify-center text-[#ff5a5f] mb-4">
                <FaMapMarkerAlt size={20} />
              </div>

              <h2 className="text-lg font-bold text-gray-900">Location</h2>

              <p className="text-gray-600 text-sm mt-2 leading-6">
                <a href="https://www.google.com/maps/search/?api=1&query=Pune,Maharashtra,India">
                  Pune, Maharashtra, India
                </a>
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="w-12 h-12 rounded-xl bg-[#fff0f1] flex items-center justify-center text-[#ff5a5f] mb-4">
                <FaPhoneAlt size={18} />
              </div>

              <h2 className="text-lg font-bold text-gray-900">Phone</h2>

              <p className="text-gray-600 text-sm mt-2">
                <a href="tel:+917745881145">+91 7745881145</a>
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="w-12 h-12 rounded-xl bg-[#fff0f1] flex items-center justify-center text-[#ff5a5f] mb-4">
                <FaEnvelope size={19} />
              </div>

              <h2 className="text-lg font-bold text-gray-900">Email</h2>

              <p className="text-gray-600 text-sm mt-2 break-all">
                <a href="mailto:shubhambatwal14@gmail.com">
                  shubhambatwal14@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Your Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]/30 focus:border-[#ff5a5f] transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]/30 focus:border-[#ff5a5f] transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Subject
                </label>

                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]/30 focus:border-[#ff5a5f] transition"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="6"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]/30 focus:border-[#ff5a5f] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-[#ff5a5f] hover:bg-[#ff4b51] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold shadow-sm transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ContactUs;
