import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProfilePage() {
  document.title = "My Profile";
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <>
      <Navbar currentPage="My Profile" />
      <main className="min-h-screen mt-32 max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-[#ff5a5f] to-[#ff7b7f] h-32 relative">
            <div className="absolute left-1/2 -bottom-14 -translate-x-1/2">
              <img
                src={user?.profileImage || "https://i.pravatar.cc/100"}
                alt={user.fullName}
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
          </div>

          <div className="pt-20 pb-8 px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {user.fullName}
            </h2>

            <p className="text-gray-500 mt-1">{user.email}</p>

            <span
              className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-semibold ${
                user.userType === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user.userType}
            </span>

            <div className="grid md:grid-cols-2 gap-5 mt-10 text-left">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">Full Name</p>
                <h3 className="text-lg font-semibold text-gray-800">
                  {user.fullName}
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">Email Address</p>
                <h3 className="text-lg font-semibold text-gray-800 break-all">
                  {user.email}
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">Account Type</p>
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {user.userType}
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">Status</p>
                <h3 className="text-lg font-semibold text-green-600">Active</h3>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ProfilePage;
