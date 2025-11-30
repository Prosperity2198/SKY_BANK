// src/components/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { FiUser, FiEdit2, FiSave } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import axios from "axios";
import Loader from "../utils/Loader";

const profileSchema = object({
  name: string().required("Name is required."),
  email: string().required("Email is required.").email("Enter a valid email."),
  phone: string().required("Phone is required."),
});

export default function Profile() {
  // Load initial user data from localStorage, fallback to defaults
  const getInitialUser = () => {
    const savedUser = localStorage.getItem("userProfile");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "08012345678",
          accountNumber: "1234567890", // fixed, not editable
          accountType: "Savings", // fixed, not editable
        };
  };

  const [user, setUser] = useState(getInitialUser());

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: user || {},
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await axios.get("/profile");
        const profileData = profileResponse.data;

        // Fetch dashboard data for account details
        const dashboardResponse = await axios.get("/dashboard");
        const dashboardData = dashboardResponse.data;

        // Set user state with fetched data
        setUser({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          accountNumber: dashboardData.accountNumber,
          accountType: dashboardData.accountType,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        // Hide loader after data is fetched or error occurs
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const startEdit = () => {
    reset({ name: user.name, email: user.email, phone: user.phone });
    setEditing(true);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Update profile data
      const updatedProfile = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      await axios.put("/profile", updatedProfile);

      // Update localStorage with updated profile
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      // Fetch current dashboard data
      const dashboardResponse = await axios.get("/dashboard");
      const currentDashboard = dashboardResponse.data;

      // Update userName in dashboard data
      const updatedDashboard = { ...currentDashboard, userName: data.name };

      // PUT the updated dashboard back to db.json
      await axios.put("/dashboard", updatedDashboard);

      // Update localStorage with updated dashboard data to sync dashboard page
      localStorage.setItem("dashboardData", JSON.stringify(updatedDashboard));

      // Update local user state
      setUser((prev) => ({ ...prev, name: data.name, email: data.email, phone: data.phone }));

      // Do NOT reload page or navigate to dashboard by window.location.href or similar
    } catch (error) {
      console.error("Error updating profile:", error);
      // Optionally, show an error message to the user
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  if (initialLoading || !user) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <header className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-skyblue/10 flex items-center justify-center text-skyblue font-bold">
          <FiUser />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-aqua">Profile</h1>
        </div>
        <div className="ml-auto">
          {!editing ? (
            <button
              onClick={startEdit}
              className="px-3 py-2 rounded-md bg-gradient-to-r font-medium from-skyblue to-aqua text-white shadow-md hover:from-skyblue/80 hover:to-aqua/80 transition flex items-center gap-2"
            >
              <FiEdit2 /> Edit
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="px-3 py-2 rounded-md bg-gradient-to-r font-medium from-skyblue to-aqua text-white shadow-md hover:from-skyblue/80 hover:to-aqua/80 transition flex items-center gap-2"
            >
              <FiSave /> {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </header>

      <div className="bg-slate-800 rounded-2xl p-6 shadow-sm space-y-10 text-gray-300">
        {/* Account Number (fixed) */}
        <div>
          <label className="text-sm block mb-4 text-aqua">Account Number :</label>
          <p className="font-medium">{user.accountNumber}</p>
        </div>

        {/* Account Type (fixed) */}
        <div>
          <label className="text-sm block mb-4 text-aqua">Account Type</label>
          <p className="font-medium">{user.accountType}</p>
        </div>

        {/* Full name (editable) */}
        <div>
          <label className="text-sm block mb-4 text-aqua">Full name</label>
          {!editing ? (
            <p>{user.name}</p>
          ) : (
            <>
              <input
                {...register("name")}
                className="w-full p-3 rounded-lg border border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-skyblue"
              />
              {errors.name && <p className="text-rose-500 text-sm">{errors.name.message}</p>}
            </>
          )}
        </div>

        {/* Email (editable) */}
        <div>
          <label className="text-sm block mb-1 text-aqua">Email</label>
          {!editing ? (
            <p>{user.email}</p>
          ) : (
            <>
              <input
                {...register("email")}
                className="w-full p-3 rounded-lg border border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-skyblue"
              />
              {errors.email && <p className="text-rose-500 text-sm">{errors.email.message}</p>}
            </>
          )}
        </div>

        {/* Phone (editable) */}
        <div>
          <label className="text-sm block mb-1 text-aqua">Phone</label>
          {!editing ? (
            <p>{user.phone}</p>
          ) : (
            <>
              <input
                {...register("phone")}
                className="w-full p-3 rounded-lg border border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-skyblue"
              />
              {errors.phone && <p className="text-rose-500 text-sm">{errors.phone.message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
