// src/components/pages/BuyAirtime.jsx
import React, { useEffect, useState } from "react";
import { FiPhone, FiHash, FiCheckCircle, FiXCircle } from "react-icons/fi";
import * as yup from "yup";
import axios from "axios";
import Loader from "../utils/Loader";

const NETWORKS = [
  { value: "mtn", label: "MTN" },
  { value: "glo", label: "GLO" },
  { value: "airtel", label: "AIRTEL" },
  { value: "9mobile", label: "9MOBILE" },
];

export default function BuyAirtime() {
  const [form, setForm] = useState({
    phone: "",
    amount: "",
    network: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null); // { msg } or { error }
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pinModalOpen) {
      setPinValue("");
      setPinError("");
      document.documentElement.classList.remove("overflow-hidden");
    } else {
      document.documentElement.classList.add("overflow-hidden");
    }
  }, [pinModalOpen]);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setPinModalOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    // Simulate loading on navigation
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((s) => ({ ...s, [e.target.name]: undefined }));
  };

  const handleBuyClick = async (e) => {
    e.preventDefault();
    setSuccess(null);
    // validate form first
    try {
      const schema = yup.object().shape({
        phone: yup
          .string()
          .required("Phone number is required.")
          .matches(/^(\+234|0)[0-9]{10}$/, "Enter a valid Nigerian phone number."),
        amount: yup
          .number()
          .nullable()
          .transform((value, originalValue) => (originalValue === "" ? undefined : value))
          .required("Amount is required.")
          .positive("Amount must be positive.")
          .integer("Amount must be a whole number.")
          .typeError("Amount must be a number."),
        network: yup
          .string()
          .required("Network is required.")
          .oneOf(["mtn", "glo", "airtel", "9mobile"], "Invalid network."),
      });
      await schema.validate(form, { abortEarly: false });
      setErrors({});
    } catch (validationErrors) {
      const err = {};
      validationErrors.inner.forEach((error) => {
        err[error.path] = error.message;
      });
      setErrors(err);
      return;
    }
    // open PIN modal
    setPinModalOpen(true);
  };

  const validatePin = (pin) => {
    if (!pin || !/^\d{4,6}$/.test(pin)) {
      setPinError("Enter a 4-6 digit PIN.");
      return false;
    }
    return true;
  };

  const handleConfirmPin = async () => {
    setPinError("");
    if (!validatePin(pinValue)) return;

    // Proceed with transaction using pinValue (only for this request)
    setPinModalOpen(false);
    setProcessing(true);

    // simulate API call
    await new Promise((res) => setTimeout(res, 1200));

    const amount = parseFloat(form.amount);
    if (amount > 100000) {
      setSuccess({ error: "Amount exceeds single-transaction limit." });
      setProcessing(false);
      setPinValue("");
      return;
    }

    // Save to DB
    try {
      const newTransaction = {
        id: Date.now(),
        type: "debit",
        amount: amount,
        description: `Airtime purchase to ${formatPhone(form.phone)} (${getNetworkLabel(form.network)})`,
        date: new Date().toISOString().split("T")[0],
      };
      await axios.post("/transactions", newTransaction);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      setSuccess({ error: "Transaction failed to save." });
      setProcessing(false);
      setPinValue("");
      return;
    }

    // success
    setSuccess({
      msg: `Airtime purchase of ${formatCurrency(amount)} to ${formatPhone(form.phone)} (${getNetworkLabel(
        form.network
      )}) was successful.`,
    });

    setProcessing(false);
    // clear only the main form (not pin; pin cleared by modal effect)
    setForm({ phone: "", amount: "", network: "" });

    // auto-clear success after a short while
    setTimeout(() => setSuccess(null), 5000);
  };

  const formatPhone = (v) => {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 10 && digits.startsWith("0")) return `+234${digits.slice(1)}`;
    if (digits.length === 11 && digits.startsWith("234")) return `+${digits}`;
    if (digits.length === 10) return digits;
    return v;
  };

  const getNetworkLabel = (val) => NETWORKS.find((n) => n.value === val)?.label ?? val.toUpperCase();

  const formatCurrency = (n) => (typeof n === "number" ? `₦${n.toLocaleString()}` : n);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-aqua mb-6 flex items-center gap-2">
        <FiPhone className="text-skyblue" />
        Buy Airtime
      </h2>

      <div className="bg-slate-800 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleBuyClick} className="space-y-5" noValidate>
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm text-aqua mb-1">
              Phone Number :
            </label>
            <div className="flex items-center gap-3 bg-skyblue/10 p-3 rounded-lg border border-skyblue/40 focus-within:ring-2 focus-within:ring-aqua transition">
              <FiPhone className="text-skyblue w-5 h-5" />
              <input
                id="phone"
                name="phone"
                inputMode="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 08012345678"
                className="flex-1 bg-transparent outline-none text-base placeholder:skyblue text-gray-300"
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </div>
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-rose-500">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Network */}
          <div>
            <label htmlFor="network" className="block text-sm text-aqua mb-1">
              Network :
            </label>
            <select
              id="network"
              name="network"
              value={form.network}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-skyblue/40 bg-skyblue/10 text-gray-300 focus:ring-2 focus:ring-aqua focus:outline-none"
              aria-invalid={errors.network ? "true" : "false"}
              aria-describedby={errors.network ? "network-error" : undefined}
            >
              <option className="bg-slate-800" value="">
                Select Network
              </option>
              {NETWORKS.map((n) => (
                <option className="bg-slate-800 text-gray-400" key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
            {errors.network && (
              <p id="network-error" className="mt-1 text-sm text-rose-500">
                {errors.network}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm text-aqua mb-1">
              Amount :
            </label>
            <div className="flex items-center gap-3 bg-skyblue/10 p-3 rounded-lg border border-skyblue/40 focus-within:ring-2 focus-within:ring-aqua transition">
              <span className="text-skyblue font-semibold">₦</span>
              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="1"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="flex-1 bg-transparent outline-none text-base placeholder:skyblue text-gray-300"
                aria-invalid={errors.amount ? "true" : "false"}
                aria-describedby={errors.amount ? "amount-error" : undefined}
              />
            </div>
            {errors.amount && (
              <p id="amount-error" className="mt-1 text-sm text-rose-500">
                {errors.amount}
              </p>
            )}
          </div>

          {/* CTA */}
          <div>
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-skyblue to-aqua text-white font-semibold py-3 rounded-lg shadow-md hover:from-skyblue/80 hover:to-aqua/80 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? "Processing..." : "Buy Airtime"}
            </button>
          </div>

          {/* Result */}
          {success?.msg && (
            <div className="mt-4 flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg p-3">
              <FiCheckCircle className="w-6 h-6 mt-0.5" />
              <div>
                <p className="font-medium">Success</p>
                <p className="text-sm">{success.msg}</p>
              </div>
            </div>
          )}

          {success?.error && (
            <div className="mt-4 flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3">
              <FiXCircle className="w-6 h-6 mt-0.5" />
              <div>
                <p className="font-medium">Failed</p>
                <p className="text-sm">{success.error}</p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setPinModalOpen(false)} />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-6 z-10 border border-deepNavy/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-aqua mb-3 flex items-center gap-2">
              <FiHash className="text-skyblue" /> Enter Transaction PIN :
            </h3>

            <p className="text-sm text-gray-300 mb-3">
              Please enter your 4–6 digit transaction PIN to confirm this purchase.
            </p>

            <input
              type="password"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              value={pinValue}
              onChange={(e) => {
                setPinValue(e.target.value.replace(/\D/g, ""));
                setPinError("");
              }}
              className="w-full p-3 rounded-lg border border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-skyblue mb-3 text-gray-300"
              placeholder="Enter PIN"
              autoFocus
            />
            {pinError && <p className="text-rose-500 text-sm mb-2">{pinError}</p>}

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setPinModalOpen(false)}
                className="px-4 py-2 rounded-md border border-deepNavy/10 text-aqua hover:bg-deepNavy/5"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmPin}
                className="px-4 py-2 bg-gradient-to-r from-skyblue to-aqua text-white rounded-md font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
