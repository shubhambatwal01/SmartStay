import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#FF5A5F] text-white py-2 mt-10 shadow-inner bottom-0 hidden md:block">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/">
            <svg
              className="w-6 h-6 mr-0 fill-white shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </Link>

          <Link to="/" className="font-bold text-xl ml-1">
            SmartStay
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SmartStay. All rights reserved.
        </p>

        <p className="text-sm">
          Designed & Developed by{" "}
          <a
            href="https://shubz-portfolio.vercel.app/"
            className="font-bold text-blue-300"
          >
            👉🏻 ゛Shubham Batwal ˎˊ˗
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
