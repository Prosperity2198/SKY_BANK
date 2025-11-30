// Dashboard component: Displays user account information including name, account number, type, and balance with toggle visibility for sensitive data.
// Imports necessary React hooks, icons, axios for API calls, and a Loader component for loading state.
import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import Loader from "../utils/Loader";

export default function Dashboard() {
  // State to control visibility of account number
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  // State to control visibility of balance
  const [showBalance, setShowBalance] = useState(false);
  // State to store account information fetched from API
  const [accountInfo, setAccountInfo] = useState(null);
  // State to manage loading state during API fetch
  const [loading, setLoading] = useState(false);

  // useEffect hook to fetch dashboard data when component mounts
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Set loading to true to show loader
        setLoading(true);
        // Fetch data from /dashboard endpoint
        const response = await axios.get("/dashboard");
        // Set the fetched data to state
        setAccountInfo(response.data);
      } catch (error) {
        // Log any errors to console
        console.error(error);
      } finally {
        // Ensure loader shows for at least 1 second for better UX
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    // Call the fetch function
    fetchDashboard();
  }, []); // Empty dependency array means this runs only on mount

  // If loading, display the Loader component
  if (loading) return <Loader />;

  // If accountInfo is not available, show error message
  if (!accountInfo)
    return (
      <div className="text-center text-red-500">Failed to load dashboard data. Please check the API connection.</div>
    );

  // Render the main dashboard UI
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Header section with welcome message */}
      <h2 className="text-3xl font-bold text-aqua mb-10 text-center">WELCOME BACK</h2>

      {/* Grid layout for displaying account information cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Card for User Name */}
        <div className="bg-slate-700 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition">
          <p className="text-base text-aqua mb-2">User Name</p>
          <p className="text-xl font-semibold text-gray-300">{accountInfo.userName}</p>
        </div>

        {/* Card for Account Number with toggle visibility */}
        <div className="bg-slate-700 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition">
          <p className="text-base text-aqua mb-2">Account Number</p>
          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold text-gray-300">
              {/* Display account number or masked version based on state */}
              {showAccountNumber ? accountInfo.accountNumber : "••••••••••"}
            </p>
            {/* Button to toggle account number visibility */}
            <button
              onClick={() => setShowAccountNumber((prev) => !prev)}
              className="text-gray-400 hover:text-deepNavy transition"
            >
              {showAccountNumber ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>

        {/* Card for Account Type */}
        <div className="bg-slate-700 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition">
          <p className="text-base text-aqua mb-2">Account Type</p>
          <p className="text-xl font-semibold text-gray-300">{accountInfo.accountType}</p>
        </div>

        {/* Card for Balance with toggle visibility */}
        <div className="bg-slate-700 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition">
          <p className="text-base text-aqua mb-2">Balance</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-semibold text-gray-300">
              {/* Display balance or masked version based on state */}
              {showBalance ? `₦${accountInfo.balance}` : "••••••••"}
            </p>
            {/* Button to toggle balance visibility */}
            <button
              onClick={() => setShowBalance((prev) => !prev)}
              className="text-gray-400 hover:text-deepNavy transition"
            >
              {showBalance ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
