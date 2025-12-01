import React, { useState, useEffect } from "react";
import { FiShield, FiChevronDown } from "react-icons/fi";
import Loader from "../utils/Loader";

const SECTIONS = [
  {
    id: "info-collect",
    title: "1. Information We Collect",
    content: (
      <>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            <strong>Personal details:</strong> name, phone number, email address, date of birth.
          </li>
          <li>
            <strong>Financial information:</strong> account numbers, card details, transaction records.
          </li>
          <li>
            <strong>Device information:</strong> IP address, device ID, browser type, app version.
          </li>
          <li>
            <strong>Location data:</strong> approximate or precise location when required for security.
          </li>
          <li>
            <strong>Usage data:</strong> features you use, time spent, clicks, and interaction logs.
          </li>
          <li>
            <strong>Verification data:</strong> BVN, NIN, identity documents, facial or biometric scans (if provided).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-use",
    title: "2. How We Use Your Information",
    content: (
      <>
        <ul className="list-disc ml-6 space-y-1">
          <li>To create and manage your SkyBank account.</li>
          <li>To process transactions, transfers, and card payments.</li>
          <li>To verify your identity and prevent fraud.</li>
          <li>To provide customer support and resolve complaints.</li>
          <li>To improve app performance and banking features.</li>
          <li>To comply with financial regulations and legal obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "share-info",
    title: "3. How We Share Your Information",
    content: (
      <>
        <p className="mb-2">
          We do <strong>not sell</strong> your personal data. We may only share your information with:
        </p>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            <strong>Regulatory bodies:</strong> when required by law (e.g., CBN, EFCC, NDIC).
          </li>
          <li>
            <strong>Payment processors:</strong> to complete money transfers or card transactions.
          </li>
          <li>
            <strong>Service providers:</strong> identity verification partners, security vendors, cloud storage.
          </li>
          <li>
            <strong>Law enforcement:</strong> only when legally necessary.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "protect",
    title: "4. How We Protect Your Data",
    content: (
      <>
        <p className="mb-2">We use advanced security technologies including:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>End-to-end encryption for sensitive data.</li>
          <li>Secure cloud infrastructure and firewalls.</li>
          <li>Multi-factor authentication and biometric verification.</li>
          <li>Continuous monitoring for fraud or suspicious transactions.</li>
          <li>Regular security audits and compliance checks.</li>
        </ul>
      </>
    ),
  },
  {
    id: "rights",
    title: "5. Your Rights",
    content: (
      <>
        <p className="mb-2">You have the right to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Request access to the personal data we store.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your data (where legally possible).</li>
          <li>Withdraw consent for optional data collection.</li>
          <li>Opt-out of marketing or notifications.</li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: (
      <>
        <p>
          We keep your data for as long as your SkyBank account remains active. Some financial data may be retained
          longer to comply with legal and regulatory requirements.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "7. Cookies & Tracking",
    content: (
      <>
        <p>
          We use cookies and analytics tools to improve performance and personalize your experience. You may disable
          cookies in your browser settings, but some features may be affected.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "8. Third-Party Links",
    content: (
      <>
        <p>
          SkyBank may contain links to external websites or services. We are not responsible for the privacy practices
          of third-party platforms; please review their policies before sharing personal information.
        </p>
      </>
    ),
  },
  {
    id: "updates",
    title: "9. Updates to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy occasionally. When changes occur, we will notify you through email, in-app
          alerts, or updated website content. The date of last update will be reflected in the app or website footer.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: (
      <>
        <p>If you have questions or requests regarding this Privacy Policy, contact us at:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            Email: <strong>privacy@skybank.com</strong>
          </li>
          <li>Customer Care: +234 800 SKYBANK</li>
          <li>Address: SkyBank Headquarters, Lagos, Nigeria</li>
        </ul>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  const [openIds, setOpenIds] = useState(new Set()); // allows multiple open sections
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show loader for 1 second on navigation
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (initialLoading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-aqua mb-6 flex items-center gap-2">
        <FiShield className="text-skyblue" /> Privacy Policy
      </h2>

      <div className="bg-slate-800 rounded-2xl shadow-sm p-1 space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
        {SECTIONS.map((sec) => {
          const isOpen = openIds.has(sec.id);
          return (
            <section key={sec.id} className="border-b last:border-b-0 border-deepNavy/8">
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(sec.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${sec.id}-content`}
                  className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left hover:bg-slate-900 transition"
                >
                  <span className="text-sm md:text-base font-semibold text-skyblue">{sec.title}</span>
                  <FiChevronDown
                    className={`w-5 h-5 text-aqua transform transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </h3>

              <div
                id={`${sec.id}-content`}
                role="region"
                aria-labelledby={sec.id}
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-[2000px] py-4" : "max-h-0"
                }`}
              >
                <div className="text-sm md:text-base text-gray-300">{sec.content}</div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
