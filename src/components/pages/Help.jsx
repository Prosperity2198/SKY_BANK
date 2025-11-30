// src/components/pages/Help.jsx
import React, { useState, useEffect } from "react";
import { FiHelpCircle, FiMail, FiPhone } from "react-icons/fi";
import Loader from "../utils/Loader";

export default function Help() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show loader for 1 second on navigation
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <header className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-skyblue/10 flex items-center justify-center text-skyblue font-bold">
          <FiHelpCircle />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-aqua mb-2">Help</h1>
          <p className="text-sm text-gray-300">Quick answers and support resources</p>
        </div>
      </header>

      <div className="bg-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="font-semibold text-aqua mb-2">Top questions</h2>
          <ul className="list-disc ml-5 text-sm space-y-2">
            <li>
              <strong>How do I reset my PIN?</strong> Go to Settings → Security → Reset PIN.
            </li>
            <li>
              <strong>How do I block my card?</strong> Use Card Services → Block Card or call +234 800 SKYBANK.
            </li>
            <li>
              <strong>How long do transfers take?</strong> Same-bank: instant. Inter-bank: up to 24 hours.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-aqua mb-2">Need more help?</h2>
          <p className="text-sm">Contact Customer Care:</p>
          <p className="flex items-center gap-3 mt-2">
            <FiPhone className="text-skyblue" />{" "}
            <a href="tel:+2348007592265" className="text-skyblue hover:underline">
              +234 800 SKYBANK
            </a>
          </p>
          <p className="flex items-center gap-3 mt-1">
            <FiMail className="text-skyblue" />{" "}
            <a href="mailto:support@skybank.com" className="text-skyblue hover:underline">
              support@skybank.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-aqua mb-2">Resources</h2>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>
              <a href="/privacy-policy" className="text-gray-300 hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/card-service" className="text-gray-300 hover:underline">
                Card Services
              </a>
            </li>
            <li>
              <a href="/customer-care" className="text-gray-300 hover:underline">
                Customer Care
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
