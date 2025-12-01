// src/components/pages/CardService.jsx
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import axios from "axios";
import { FiCreditCard, FiTrash2, FiEdit2, FiLock, FiRefreshCw } from "react-icons/fi";
import Loader from "../utils/Loader";

// ------- YUP VALIDATION -------
const schema = yup.object({
  cardNumber: yup
    .string()
    .required("Card number is required")
    .transform((v) => v.replace(/\s/g, ""))
    .min(12, "Card number must be at least 12 digits"),
  expiry: yup
    .string()
    .required("Expiry date is required")
    .matches(/^\d{2}\/\d{2}$/, "Use MM/YY format"),
  cvv: yup
    .string()
    .required("CVV is required")
    .matches(/^\d{3}$/, "CVV must be 3 digits"),
});

// --------Use State--------------
export default function CardService() {
  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [cards, setCards] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = "/cards";

  // ------- LOAD CARDS -------
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API);
        setCards(response.data);
      } catch (error) {
        console.error("Failed to load cards:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchCards();
  }, []);

  // ------- INPUT HANDLERS -------
  const handleChange = (name, value) => {
    if (name === "cardNumber") {
      value = value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "");
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "");
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  // ------- SAVE / UPDATE -------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => (newErrors[e.path] = e.message));
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const data = {
      ...form,
      cardNumber: form.cardNumber.trim(),
      status: "active",
    };

    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API}/${editingId}`, data);
        setCards((p) => p.map((c) => (c.id === editingId ? { id: editingId, ...data } : c)));
        setEditingId(null);
      } else {
        // CREATE
        const response = await axios.post(API, data);
        setCards((p) => [...p, response.data]);
      }

      setForm({ cardNumber: "", expiry: "", cvv: "" });
    } catch (error) {
      console.error("Failed to save card:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------- DELETE -------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setCards((p) => p.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  // ------- EDIT -------
  const handleEdit = (card) => {
    setForm({ cardNumber: card.cardNumber, expiry: card.expiry, cvv: card.cvv });
    setEditingId(card.id);
  };

  // ------- BLOCK CARD -------
  const handleBlock = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "blocked" }),
    });

    setCards((p) => p.map((c) => (c.id === id ? { ...c, status: "blocked" } : c)));
  };

  const maskCard = (num) => {
    const digits = num.replace(/\D/g, "");
    return "**** **** **** " + digits.slice(-4);
  };

  // ------- UI -------
  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold text-aqua flex items-center gap-2 mb-4">
        <FiCreditCard className="text-skyblue" /> Card Services
      </h1>

      {/* FORM */}
      <div className="bg-slate-800 rounded-2xl p-5 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CARD NUMBER */}
          <div>
            <label className="text-sm text-aqua">Card Number</label>
            <input
              value={form.cardNumber}
              onChange={(e) => handleChange("cardNumber", e.target.value)}
              className="w-full p-3 rounded-lg border bg-transparent text-gray-300 border-slate-700 outline-none"
              placeholder="1234 5678 9012 3456"
              maxLength={23}
            />
            {errors.cardNumber && <p className="text-rose-500 text-xs">{errors.cardNumber}</p>}
          </div>

          {/* CVV + EXPIRY */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-aqua">CVV</label>
              <input
                value={form.cvv}
                onChange={(e) => handleChange("cvv", e.target.value)}
                className="w-full p-3 rounded-lg border bg-transparent italic text-gray-300 border-slate-700 outline-none"
                maxLength={3}
                placeholder="123"
              />
              {errors.cvv && <p className="text-rose-500 text-xs">{errors.cvv}</p>}
            </div>

            <div>
              <label className="text-sm text-aqua">Expiry (MM/YY)</label>
              <input
                value={form.expiry}
                onChange={(e) => handleChange("expiry", e.target.value)}
                className="w-full p-3 rounded-lg border bg-transparent text-gray-300 border-slate-700 outline-none"
                maxLength={5}
                placeholder="09/27"
              />
              {errors.expiry && <p className="text-rose-500 text-xs">{errors.expiry}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-skyblue to-aqua text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Saving..." : editingId ? "Update Card" : "Save Card"}
          </button>
        </form>
      </div>

      {/* LIST OF CARDS */}
      <h2 className="text-lg font-semibold text-aqua mb-2">Your Cards :</h2>

      {cards.length === 0 ? (
        <p className="text-gray-400">No cards added yet.</p>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <div key={card.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between">
                <p className="text-gray-200 font-semibold">{maskCard(card.cardNumber)}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    card.status === "active" ? "bg-green-500/20 text-green-400" : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {card.status}
                </span>
              </div>

              <p className="text-gray-400 text-sm">Expires {card.expiry}</p>

              <div className="flex gap-3 mt-3 text-sm">
                <button onClick={() => handleEdit(card)} className="text-skyblue flex items-center gap-1">
                  <FiEdit2 /> Edit
                </button>

                <button onClick={() => handleDelete(card.id)} className="text-rose-500 flex items-center gap-1">
                  <FiTrash2 /> Delete
                </button>

                <button onClick={() => handleBlock(card.id)} className="text-yellow-400 flex items-center gap-1">
                  <FiLock /> Block
                </button>

                <button onClick={() => alert("New card requested")} className="text-aqua flex items-center gap-1">
                  <FiRefreshCw /> Request New
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
