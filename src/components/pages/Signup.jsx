// Signup.jsx: Modal component for user registration, handling form validation, password visibility toggle, and navigation.
// Imports React hooks, form handling libraries, validation schema, and icons.
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FiX } from "react-icons/fi";

// SignUp component: Renders a modal for user account creation with form fields
const SignUp = ({ isOpen, onClose, onDashboardClick, onLoginClick }) => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State to toggle confirm password visibility
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation schema for form fields using Yup
  const schema = yup.object({
    fullName: yup.string().required("Full name is required").min(2, "At least 2 characters"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
    agreeToTerms: yup.boolean().oneOf([true], "You must agree to the terms and privacy policy"),
  });

  // Form handling with react-hook-form and Yup resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Form submit handler: closes modal and navigates to dashboard
  const onSubmit = () => {
    onDashboardClick();
  };

  // useEffect to handle modal behavior: close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // useEffect to prevent body scroll when modal is open
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", isOpen);
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [isOpen]);

  // If modal is not open, return null to not render
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-deepNavy/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-medGray hover:text-deepNavy transition"
        >
          <FiX className="w-6 h-6" />
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-deepNavy text-center mb-6">Create Account</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex items-center gap-3 bg-skyblue/10 p-3.5 rounded-2xl border border-skyblue/40 focus-within:ring-2 focus-within:ring-aqua transition">
              <MdAlternateEmail className="text-skyblue text-2xl" />
              <input
                type="text"
                placeholder="Full Name"
                {...register("fullName")}
                className="bg-transparent flex-1 outline-none text-base placeholder:skyblue"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <div className="flex items-center gap-3 bg-skyblue/10 p-3.5 rounded-2xl border border-skyblue/40 focus-within:ring-2 focus-within:ring-aqua transition">
              <MdAlternateEmail className="text-skyblue text-2xl" />
              <input
                type="email"
                placeholder="Email address"
                {...register("email")}
                className="bg-transparent flex-1 outline-none text-base placeholder:skyblue"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative flex items-center gap-3 bg-skyblue/10 p-3.5 rounded-2xl border border-skyblue/40 focus-within:ring-2 focus-within:ring-aqua transition">
              <FaFingerprint className="text-skyblue text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="bg-transparent flex-1 outline-none text-base placeholder:skyblue"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-skyblue hover:text-aqua transition"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <div className="relative flex items-center gap-3 bg-skyblue/10 p-3.5 rounded-2xl border border-skyblue/40 focus-within:ring-2 focus-within:ring-aqua transition">
              <FaFingerprint className="text-skyblue text-xl" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="bg-transparent flex-1 outline-none text-base placeholder:skyblue"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-skyblue hover:text-aqua transition"
              >
                {showConfirm ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-deepNavy/70">
              <input type="checkbox" {...register("agreeToTerms")} className="accent-aqua w-4 h-4" />I agree to the{" "}
              <a href="/terms" className="text-aqua hover:underline">
                Terms
              </a>{" "}
              &{" "}
              <a href="/privacy" className="text-aqua hover:underline">
                Privacy Policy
              </a>
              .
            </label>
            {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-skyblue text-white rounded-2xl font-semibold text-lg hover:bg-aqua transform active:scale-95 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow h-[1px] bg-deepNavy/10"></div>
          <span className="px-3 text-sm text-deepNavy/60">
            Already have an account?{" "}
            <button type="button" className="text-aqua font-semibold hover:underline" onClick={onLoginClick}>
              Login
            </button>
          </span>
          <div className="flex-grow h-[1px] bg-deepNavy/10"></div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
