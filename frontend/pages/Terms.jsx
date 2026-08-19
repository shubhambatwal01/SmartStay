import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Terms() {
  document.title = "Terms & Conditions | SmartStay";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-[#ff5a5f] to-[#ff8a8f] bg-clip-text text-transparent">
              Terms & Conditions
            </h1>

            <p className="mt-3 text-gray-500">
              Please read these terms carefully before using SmartStay.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:p-10">
            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                1. Introduction
              </h2>

              <p className="leading-7 text-gray-600">
                Welcome to <strong className="text-[#ff5a5f]">SmartStay</strong>
                . SmartStay is a home accommodation booking platform that allows
                users to discover available homes, make reservations, and manage
                their bookings. By creating an account or using SmartStay, you
                agree to follow these Terms & Conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                2. User Account
              </h2>

              <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
                <li>You must provide accurate and complete information.</li>
                <li>
                  You are responsible for maintaining the security of your
                  account.
                </li>
                <li>
                  You must not share your account credentials with others.
                </li>
                <li>
                  You are responsible for activities performed through your
                  account.
                </li>
                <li>
                  Users must not create accounts using false or misleading
                  information.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                3. Home Booking
              </h2>

              <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
                <li>Users can book homes only for available dates.</li>
                <li>
                  Dates already reserved by another user cannot be booked.
                </li>
                <li>
                  A booking is considered confirmed after successful payment
                  verification.
                </li>
                <li>
                  Users should carefully verify the check-in and check-out dates
                  before payment.
                </li>
                <li>
                  Users are responsible for providing the correct number of
                  guests.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                4. Payments
              </h2>

              <p className="leading-7 text-gray-600">
                Payments for bookings are processed securely through the
                integrated payment gateway. SmartStay does not store users'
                complete payment card or banking credentials.
              </p>

              <p className="mt-3 leading-7 text-gray-600">
                A booking should only be considered successful after the payment
                has been successfully verified by SmartStay.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                5. Host Responsibilities
              </h2>

              <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
                <li>Hosts must provide accurate property information.</li>
                <li>Hosts should keep property availability up to date.</li>
                <li>
                  Hosts should provide accurate property images and
                  descriptions.
                </li>
                <li>
                  Hosts are responsible for maintaining their listed properties.
                </li>
                <li>Hosts should honor confirmed reservations.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                6. User Responsibilities
              </h2>

              <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
                <li>Users must respect the property and its facilities.</li>
                <li>Users must follow the rules provided by the host.</li>
                <li>Users must not use a property for illegal activities.</li>
                <li>
                  Users are responsible for any damage caused by them or their
                  guests.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                7. Booking Cancellation
              </h2>

              <p className="leading-7 text-gray-600">
                Cancellation and refund conditions may depend on the booking and
                the applicable cancellation policy. Users should review the
                available booking information before completing payment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                8. Prohibited Activities
              </h2>

              <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
                <li>Fraudulent or unauthorized use of SmartStay.</li>
                <li>Providing false personal or property information.</li>
                <li>Attempting to access another user's account.</li>
                <li>Using SmartStay for unlawful activities.</li>
                <li>Damaging or misusing any listed property.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                9. Privacy
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay may collect information necessary to provide
                authentication, booking, payment, and communication services.
                User information should be handled in accordance with the
                application's applicable privacy practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                10. Service Availability
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay may occasionally experience interruptions due to
                maintenance, technical issues, network problems, or other
                circumstances. We aim to keep the service available and
                functional but cannot guarantee uninterrupted access.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                11. Changes to These Terms
              </h2>

              <p className="leading-7 text-gray-600">
                SmartStay may update these Terms & Conditions when necessary.
                Updated terms will be made available through the application.
                Continued use of SmartStay after an update indicates acceptance
                of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                12. Contact Us
              </h2>

              <p className="leading-7 text-gray-600">
                If you have any questions regarding these Terms & Conditions,
                please contact the SmartStay team.
              </p>

              <a
                href="mailto:shubhambatwal14@gmail.com.com"
                className="mt-3 inline-block font-semibold text-[#ff5a5f] hover:underline"
              >
                shubhambatwal14@gmail.com
              </a>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-500">
                By using SmartStay, you acknowledge that you have read and
                understood these Terms & Conditions.
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

export default Terms;
