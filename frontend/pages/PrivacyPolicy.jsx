import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PrivacyPolicy() {
  document.title = "Privacy Policy | SmartStay";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent">
              Privacy Policy
            </h1>

            <p className="mt-3 text-gray-500">
              Your privacy and security are important to us.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:p-10">
            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                1. Introduction
              </h2>

              <p className="leading-7 text-gray-600">
                Welcome to <strong className="text-[#ff5a5f]">SmartStay</strong>
                . This Privacy Policy explains how SmartStay collects, uses,
                stores, and protects information when you use our platform.
              </p>

              <p className="mt-3 leading-7 text-gray-600">
                By creating an account or using SmartStay, you acknowledge that
                you have read and understood this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                2. Information We Collect
              </h2>

              <p className="mb-3 leading-7 text-gray-600">
                We may collect information that you provide while using
                SmartStay, including:
              </p>

              <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
                <li>Full name</li>
                <li>Email address</li>
                <li>Account type, such as User or Host</li>
                <li>Booking information</li>
                <li>Check-in and check-out dates</li>
                <li>Number of guests</li>
                <li>Property information submitted by hosts</li>
                <li>Payment and transaction-related information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                3. Account Information
              </h2>

              <p className="leading-7 text-gray-600">
                When you create a SmartStay account, we use the information
                provided by you to create and manage your account, authenticate
                your identity, and provide access to the features available for
                your account type.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                4. Booking Information
              </h2>

              <p className="leading-7 text-gray-600">
                When you make a booking, SmartStay may store information related
                to the reservation, including the selected property, check-in
                date, check-out date, number of guests, booking status, and
                payment status.
              </p>

              <p className="mt-3 leading-7 text-gray-600">
                This information helps us process reservations, prevent
                conflicting bookings, and provide booking-related services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                5. How We Use Your Information
              </h2>

              <p className="mb-3 leading-7 text-gray-600">
                Information collected through SmartStay may be used to:
              </p>

              <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
                <li>Create and manage user accounts.</li>
                <li>Process and manage home bookings.</li>
                <li>Verify successful payments.</li>
                <li>Prevent duplicate or conflicting reservations.</li>
                <li>Send booking confirmation and related notifications.</li>
                <li>Allow hosts to manage their properties and bookings.</li>
                <li>
                  Improve the functionality and user experience of SmartStay.
                </li>
                <li>Respond to support requests and inquiries.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                6. Payment Information
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay uses a third-party payment gateway to process
                payments. Payment processing may be handled directly by the
                payment provider.
              </p>

              <p className="mt-3 leading-7 text-gray-600">
                SmartStay does not intentionally store complete payment card or
                banking credentials on its own servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                7. Email & Notifications
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay may use your email address to send important
                service-related communications, such as account information,
                booking confirmations, payment updates, and booking
                notifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                8. Information Shared With Hosts
              </h2>

              <p className="leading-7 text-gray-600">
                When a user makes a reservation, relevant booking information
                may be made available to the host of the selected property. This
                allows the host to manage and fulfill the reservation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                9. Data Security
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay takes reasonable measures to protect user information
                from unauthorized access, alteration, disclosure, or misuse.
              </p>

              <p className="mt-3 leading-7 text-gray-600">
                However, no internet-based service can guarantee complete
                security of information transmitted or stored electronically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                10. Cookies & Sessions
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay may use browser storage, cookies, or session
                technologies to maintain authentication sessions and provide
                essential application functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                11. Data Retention
              </h2>

              <p className="leading-7 text-gray-600">
                We may retain account, booking, and transaction-related
                information for as long as necessary to provide our services,
                maintain records, resolve disputes, and meet applicable
                requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                12. Third-Party Services
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay may use third-party services for functionality such as
                payment processing, email delivery, hosting, analytics, or other
                application services. These providers may process information
                according to their own privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                13. Your Information
              </h2>

              <p className="leading-7 text-gray-600">
                You may request information about the personal information
                associated with your SmartStay account or request correction of
                inaccurate account information where applicable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                14. Children's Privacy
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay is not intended for individuals who are not legally
                permitted to use accommodation booking services. We do not
                knowingly collect personal information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                15. Changes to This Privacy Policy
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay may update this Privacy Policy from time to time. Any
                updated version will be made available through the application.
                We recommend reviewing this page periodically.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                16. Contact Us
              </h2>

              <p className="leading-7 text-gray-600">
                If you have questions, concerns, or requests regarding this
                Privacy Policy, please contact the SmartStay team.
              </p>

              <a
                href="mailto:shubhambatwal14@gmail.com"
                className="mt-3 inline-block font-semibold text-[#ff5a5f] hover:underline"
              >
                shubhambatwal14@gmail.com
              </a>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-500">
                Thank you for trusting SmartStay with your information.
              </p>

              <Link
                to="/"
                className="mt-4 inline-block rounded-lg bg-[#ff5a5f] px-6 py-3 font-semibold text-white transition hover:bg-[#ff4b51]"
              >
                Back to SmartStay
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;
