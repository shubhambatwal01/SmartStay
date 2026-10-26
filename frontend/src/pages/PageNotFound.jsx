import { Link } from "react-router-dom";

function NotFound() {
  document.title = "404";
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl text-center space-y-3">
        <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl text-[#ff5a5f] leading-tight">
          404
        </h1>

        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-800">
          Oops, Page Not Found!
        </h2>

        <Link
          to="/"
          aria-label="Go back home"
          className="mt-2 inline-block w-full sm:w-auto px-6 py-3 bg-[#ff5a5f] hover:bg-[#ff4b51] text-white font-semibold rounded-lg shadow transition-colors text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5a5f]"
        >
          Go back Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
