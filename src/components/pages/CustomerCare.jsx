// src/components/pages/CustomerCare.jsx
import React, { useState, useEffect } from "react";
import { FiPhoneCall, FiMail, FiCheckCircle } from "react-icons/fi";
import * as yup from "yup";
import Loader from "../utils/Loader";

export default function CustomerCare() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show loader for 1 second on navigation
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((s) => ({ ...s, [e.target.name]: undefined }));
  };

  const validate = async () => {
    setErrors({});
    try {
      const schema = yup.object().shape({
        name: yup.string().required("Name is required.").trim(),
        email: yup.string().email("Valid email required.").required("Email is required."),
        message: yup.string().required("Message is required.").min(8, "Message must be 8+ characters.").trim(),
      });
      await schema.validate(form, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const err = {};
      validationErrors.inner.forEach((error) => {
        err[error.path] = error.message;
      });
      setErrors(err);
      return false;
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSent(false);
    if (!(await validate())) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate API
    setLoading(false);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  if (initialLoading) return <Loader />;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <header className="mb-4 ">
        <h1 className="text-2xl font-bold text-aqua flex items-center gap-2">
          <FiPhoneCall className="text-skyblue" /> Customer Care
        </h1>
        <p className="text-lg text-gray-300 mt-10">We’re here to help — available 24/7 for urgent issues.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Contact info */}
        <div className="bg-slate-800 rounded-2xl p-5 shadow-sm text-gray-300">
          <h2 className="font-semibold text-aqua mb-3">Contact</h2>

          <p className="flex items-center gap-2 mb-2">
            <FiPhoneCall className="text-skyblue" />{" "}
            <a href="tel:+2348007592265" className="text-skyblue hover:underline">
              +234 800 8765
            </a>
          </p>

          <p className="flex items-center gap-2 mb-4">
            <FiMail className="text-skyblue" />{" "}
            <a href="mailto:support@skybank.com" className="text-skyblue hover:underline">
              support@skybank.com
            </a>
          </p>

          <h3 className="font-medium text-aqua mb-2">Quick help</h3>
          <ul className="list-disc ml-5 text-sm text-gray-300 space-y-1">
            <li>Lost/stolen card — call immediately to block.</li>
            <li>Unauthorized transaction — report within 24 hours.</li>
            <li>PIN reset — available in the app under Settings.</li>
          </ul>
        </div>

        {/* Contact form */}
        <div className="bg-slate-800 rounded-2xl p-5 shadow-sm text-skyblue">
          <h2 className="font-semibold text-aqua mb-3">Send us a message</h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <div>
              <label className="text-sm block mb-1">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-300 bg-transparent outline-none "
                placeholder="Jane Doe"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm block mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-300 bg-transparent outline-none"
                placeholder="you@domain.com"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm block mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-300 bg-transparent outline-none"
                placeholder="Describe your issue..."
                aria-invalid={errors.message ? "true" : "false"}
              />
              {errors.message && <p className="text-rose-500 text-xs mt-1">{errors.message}</p>}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-skyblue to-aqua text-white rounded-lg font-medium hover:from-skyblue/80 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send"}
              </button>

              {sent && (
                <div className="inline-flex items-center gap-2 text-green-600">
                  <FiCheckCircle /> Sent
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Simple FAQ */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm text-gray-700 dark:text-gray-300">
        <h3 className="font-semibold text-aqua mb-3">FAQ</h3>
        <ul className="list-disc ml-5 text-sm space-y-2">
          <li>
            <strong>How do I block my card?</strong> Call the hotline or use Card Services → Block Card.
          </li>
          <li>
            <strong>How long for transfers?</strong> Usually instant for same-bank, up to 24 hours for inter-bank.
          </li>
          <li>
            <strong>Where is my account statement?</strong> Download statements from the Accounts → Statements section.
          </li>
        </ul>
      </div>
    </div>
  );
}
