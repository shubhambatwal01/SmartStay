import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#FF5A5F] text-white py-2 mt-10 shadow-inner bottom-0 hidden md:block">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <p className="text-sm ml-10">
          Designed & Developed by{" "}
          <a
            href="https://shubz-portfolio.vercel.app/"
            className="font-bold text-blue-300"
          >
            👉🏻 ゛Shubham Batwal ˎˊ˗
          </a>
        </p>

        <p className="text-sm">
          &copy; {new Date().getFullYear()} SmartStay. All rights reserved.
        </p>

        <div className="flex space-x-4 mt-4 md:mt-0 gap-3 mr-10">
          <Link
            to="/privacy-policy"
            className="hover:text-orange-900 transition"
          >
            Privacy Policy
          </Link>

          <Link to="/terms" className="hover:text-orange-900 transition">
            Terms
          </Link>

          <Link to="/addContact" className="hover:text-orange-900 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
