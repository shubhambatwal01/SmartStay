import { Link } from "react-router-dom";

function ContactAdded() {
  return (
    <main className="min-h-screen flex items-center justify-center p-5">
      <div className="flex flex-col justify-center items-center gap-3 max-w-2xl mx-auto py-8 px-4 text-center">
        <svg
          className="inline w-10 h-10 mb-2 text-[#ff5a5f]"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>

        <h1 className="text-3xl font-bold text-[#ff5a5f]">
          Thank You for Contacting Us!
        </h1>

        <Link
          to="/"
          className="inline-block px-6 py-2 mt-3 bg-[#ff5a5f] hover:bg-[#ff4b51] text-white font-semibold rounded shadow transition"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}

export default ContactAdded;
