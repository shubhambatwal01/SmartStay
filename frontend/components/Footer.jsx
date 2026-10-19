import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Mail,
  ArrowUpRight,
  Sparkles,
  CodeXml,
} from "lucide-react";

function Footer() {
  const footerLinks = [
    {
      label: "Privacy Policy",
      to: "/privacy-policy",
      icon: ShieldCheck,
    },
    {
      label: "Terms & Conditions",
      to: "/terms",
      icon: FileText,
    },
    {
      label: "Contact Us",
      to: "/addContact",
      icon: Mail,
    },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden bg-linear-to-br from-[#ff5a5f] via-[#ff6469] to-[#ff858a] text-white hidden md:block">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#ffb4b7]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 md:pb-8">
        <div className="grid gap-9 border-b border-white/20 pb-8 md:grid-cols-3 md:gap-12">
          <div className="md:col-span-1">
            <Link
              to="/"
              className="flex shrink-0 items-center transition-opacity hover:opacity-90 py-2"
            >
              <img
                src="https://i.8upload.com/image/b1904ccaade1c142/smartstay-creative-white-logo.png"
                alt="SmartStay"
                className="h-11 w-auto object-contain sm:h-12"
              />
            </Link>

            <p className="max-w-sm text-sm text-white/85">
              Find your perfect place to stay. Discover comfortable homes, plan
              your next trip, and enjoy a seamless booking experience with
              SmartStay.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur-sm">
              <Sparkles size={14} />
              <span>Made for better stays</span>
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-base font-bold tracking-wide">
              Quick Links
            </h2>

            <ul className="space-y-3">
              {footerLinks.map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-3 rounded-lg text-sm text-white/85 transition duration-200 hover:translate-x-1 hover:text-white"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition group-hover:bg-white/20">
                      <Icon size={16} />
                    </span>

                    <span>{label}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-1 text-base font-bold tracking-wide">
              About the Developer
            </h2>

            <p className="mb-4 text-sm text-white/85">
              Designed and developed with care to make finding your next stay
              simple, comfortable, and enjoyable.
            </p>

            <Link
              to={"https://shubhambatwal.vercel.app"}
              className="mt-4 group inline-flex items-center gap-3 rounded-lg text-sm text-white transition duration-200 hover:translate-x-1 hover:text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center  rounded-lg transition group-hover:bg-white/10 text-white shadow-sm">
                <span className="text-lg font-extrabold">
                  <CodeXml size={16} />
                </span>
              </div>
              <div>
                <span className="mb-1 text-sm text-white/85 font-medium">
                  Full-stack Developer
                </span>
                <span className="block text-sm text-cyan-300 font-bold">
                  {" "}
                  👉🏻 ゛Shubham Batwal ˎˊ˗
                </span>
              </div>

              <ArrowUpRight
                size={14}
                className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-white/80 sm:text-sm">
            © {new Date().getFullYear()} SmartStay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
