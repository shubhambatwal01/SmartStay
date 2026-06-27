import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Bookings() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-32">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          My Bookings :
        </h1>

        <div className="flex justify-center items-center">
          <p className="text-lg text-gray-700">Bookings will appear here!</p>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Bookings;
