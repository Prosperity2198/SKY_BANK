import React, { useState, useEffect } from "react";
import { FiSettings, FiLock, FiCheck } from "react-icons/fi";
import * as yup from "yup";
import Loader from "../utils/Loader";

// Yup schema for password change
const passwordSchema = yup.object({
  oldPw: yup.string().required("Current password is required"),
  newPw: yup.string().min(6, "New password must be at least 6 characters").required("New password is required"),
  confirm: yup
    .string()
    .oneOf([yup.ref("newPw"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function Settings() {
  const [prefs, setPrefs] = useState({ emailNotifications: true });

  const [pw, setPw] = useState({ oldPw: "", newPw: "", confirm: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show loader for 1 second on navigation
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const togglePref = () => setPrefs((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }));

  const handlePwInput = (e) => {
    setPw({ ...pw, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  };

  const savePassword = async () => {
    setError("");
    try {
      await passwordSchema.validate(pw, { abortEarly: false });
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => (newErrors[e.path] = e.message));
      setError(Object.values(newErrors)[0]); // Show first error
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);

    setPw({ oldPw: "", newPw: "", confirm: "" });
    setSuccess(true);

    setTimeout(() => setSuccess(false), 4000);
  };

  if (initialLoading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      {/* HEADER */}
      <header className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-skyblue/10 flex items-center justify-center text-skyblue">
          <FiSettings size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-aqua">Settings</h1>
          <p className="text-sm text-gray-400">Manage your preferences & security</p>
        </div>
      </header>

      <div className="bg-slate-800 rounded-2xl p-6 space-y-8 shadow-sm">
        {/* PREFERENCES */}
        <section>
          <h2 className="text-lg font-semibold text-aqua mb-3">Preferences</h2>

          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
            <div>
              <p className="font-medium text-gray-200">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive alerts & updates</p>
            </div>

            <button
              onClick={togglePref}
              className={`px-4 py-1.5 rounded-lg font-medium transition ${
                prefs.emailNotifications ? "bg-aqua text-white" : "bg-slate-700 text-gray-300"
              }`}
            >
              {prefs.emailNotifications ? "On" : "Off"}
            </button>
          </div>
        </section>

        <hr className="border-slate-700" />

        {/* SECURITY */}
        <section>
          <h2 className="text-lg font-semibold text-aqua mb-3 flex items-center gap-2">
            <FiLock /> Security
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {["oldPw", "newPw", "confirm"].map((name, i) => (
              <input
                key={i}
                name={name}
                type="password"
                placeholder={
                  name === "oldPw" ? "Current password" : name === "newPw" ? "New password" : "Confirm password"
                }
                value={pw[name]}
                onChange={handlePwInput}
                className="p-3 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 outline-none"
              />
            ))}
          </div>

          {error && <p className="text-rose-500 text-sm mt-2">{error}</p>}

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={savePassword}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-skyblue to-aqua text-white rounded-lg font-medium disabled:opacity-60"
            >
              {saving ? "Saving..." : "Change Password"}
            </button>

            {success && (
              <span className="flex items-center gap-2 text-green-500 font-medium animate-fade-in">
                <FiCheck /> Password updated
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
