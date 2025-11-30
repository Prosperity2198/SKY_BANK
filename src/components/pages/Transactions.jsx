// src/components/pages/Transactions.jsx
import React, { useState, useEffect } from "react";
import { FiList, FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";
import axios from "axios";
import Loader from "../utils/Loader";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Show loader for 1 second on navigation
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/transactions");
        // Sort transactions by id descending (newest added first)
        const sortedTransactions = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setTransactions(sortedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions based on selectedType and selectedDate
  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = selectedType === "all" || t.type === selectedType;
    const dateMatch = !selectedDate || t.date === selectedDate;
    return typeMatch && dateMatch;
  });

  if (initialLoading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-aqua mb-6 flex items-center gap-2">
        <FiList className="text-skyblue" /> Transactions
      </h2>
      {/* Filter UI */}
      <div className="mb-4 flex gap-4 items-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-700 text-gray-300 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-aqua"
        >
          <option value="all">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-700 text-gray-300 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-aqua"
        />
      </div>
      <div className="bg-slate-800 rounded-2xl shadow-sm p-6">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-300">No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {filteredTransactions.map((t) => (
              <li
                key={t.id}
                className={`flex justify-between items-center p-3 rounded-lg border border-slate-700 ${
                  t.type === "credit" ? "bg-green-900/20" : "bg-rose-900/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {t.type === "credit" ? (
                    <FiArrowDownCircle className="text-green-600 w-5 h-5" />
                  ) : (
                    <FiArrowUpCircle className="text-rose-600 w-5 h-5" />
                  )}
                  <div>
                    <p className={`font-medium ${t.type === "credit" ? "text-green-700" : "text-rose-700"}`}>
                      {t.description}
                    </p>
                    <p className="text-sm text-gray-500">{t.date}</p>
                  </div>
                </div>
                <p className={`font-semibold ${t.type === "credit" ? "text-green-700" : "text-rose-700"}`}>
                  {t.type === "credit" ? "+" : "-"}₦{t.amount.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
