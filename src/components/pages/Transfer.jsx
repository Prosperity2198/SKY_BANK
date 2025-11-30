import React, { useState, useEffect } from "react";
import { FiSend, FiHash, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, number } from "yup";
import axios from "axios";
import Loader from "../utils/Loader";

const transferSchema = object({
  accountNumber: string().required("Account number is required").length(10, "Must be 10 digits"),
  bankName: string().required("Bank name is required"),
  recipientName: string().required("Recipient name is required"),
  amount: number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .required("Amount is required")
    .min(100, "₦100 - ₦1,000,000")
    .max(1000000, "₦100 - ₦1,000,000"),
  narration: string(),
});

export default function Transfer() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null); // { msg } or { error }
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(transferSchema),
  });

  useEffect(() => {
    // Show loader for 1 second on navigation
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const onSubmit = () => {
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

    // Proceed with transaction
    setPinModalOpen(false);
    setIsProcessing(true);

    // simulate API call
    await new Promise((res) => setTimeout(res, 1200));

    const amount = parseFloat(watch("amount"));
    if (amount > 100000) {
      setSuccess({ error: "Amount exceeds single-transaction limit." });
      setLoading(false);
      setPinValue("");
      return;
    }

    // Save transaction to db.json
    try {
      const transactionData = {
        id: Date.now(), // Simple ID generation
        type: "debit",
        amount: amount,
        description: `Transfer to ${watch("recipientName")} (${watch("accountNumber")})`,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      };
      await axios.post("http://localhost:3003/transactions", transactionData);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      setSuccess({ error: "Transaction failed to save." });
      setIsProcessing(false);
      setPinValue("");
      return;
    }

    // success
    setSuccess({
      msg: `Transfer of ₦${amount.toLocaleString()} to ${watch("recipientName")} (${watch(
        "accountNumber"
      )}) was successful.`,
    });

    setIsProcessing(false);
    reset();
    setPinValue("");

    // auto-clear success after a short while
    setTimeout(() => setSuccess(null), 3000);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-aqua mb-6 flex items-center gap-2">
        <FiSend className="text-skyblue" />
        Transfer Funds
      </h2>

      <div className="bg-slate-800 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Account Number */}
          <div>
            <label className="block text-sm text-aqua mb-1">Account Number</label>
            <input
              type="text"
              {...register("accountNumber")}
              maxLength={10}
              className="w-full p-3 rounded-lg border border-slate-700 bg-transparent text-gray-300 focus:ring-2 focus:ring-skyblue focus:outline-none"
              placeholder="Enter account number"
            />
            {errors.accountNumber && <span className="text-red-500">{errors.accountNumber.message}</span>}
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm text-aqua mb-1">Bank Name</label>
            <select
              {...register("bankName")}
              className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:ring-2 focus:ring-skyblue focus:outline-none"
            >
              <option value="">Select Bank</option>
              <option value="Sky">Sky Bank</option>
              <option value="Zenith">Zenith Bank</option>
              <option value="Access">Access Bank</option>
              <option value="First">First Bank</option>
              <option value="UBA">UBA</option>
            </select>
            {errors.bankName && <span className="text-red-500">{errors.bankName.message}</span>}
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-sm text-aqua mb-1">Recipient Name</label>
            <input
              type="text"
              {...register("recipientName")}
              className="w-full p-3 rounded-lg border border-slate-700 bg-transparent text-gray-300 focus:ring-2 focus:ring-skyblue focus:outline-none"
              placeholder="Enter recipient name"
            />
            {errors.recipientName && <span className="text-red-500">{errors.recipientName.message}</span>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm text-aqua mb-1">Amount</label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-semibold">
                ₦
              </span>

              <input
                type="number"
                {...register("amount")}
                className="w-full pl-8 p-3 rounded-lg border border-slate-700 
                 bg-transparent text-gray-300 
                 focus:ring-2 focus:ring-skyblue focus:outline-none"
                placeholder="Enter amount"
              />
            </div>
            {errors.amount && <span className="text-red-500">{errors.amount.message}</span>}
          </div>

          {/* Narration */}
          <div>
            <label className="block text-sm text-aqua mb-1">Narration (optional)</label>
            <input
              type="text"
              {...register("narration")}
              className="w-full p-3 rounded-lg border border-slate-700 bg-transparent text-gray-300 focus:ring-2 focus:ring-skyblue focus:outline-none"
              placeholder="Enter description"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-skyblue to-aqua text-white font-semibold py-3 rounded-lg shadow-md hover:from-skyblue/80 hover:to-aqua/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Send Money"}
          </button>

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
              Please enter your 4–6 digit transaction PIN to confirm this transfer.
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
