import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FiX } from "react-icons/fi";

// Login component: Renders a modal for user authentication with email and password fields
const Login = ({ isOpen, onClose, onSignUpClick }) => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Validation schema for form fields using Yup
  const schema = yup.object({
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(6, "Invalid password").required("Password is required"),
  });

  // Form handling with react-hook-form and Yup resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Function to toggle password visibility
  const togglePasswordView = () => setShowPassword((s) => !s);

  // useEffect to handle modal behavior: close on Escape key and prevent body scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isOpen, onClose]);

  // If modal is not open, return null to not render
  if (!isOpen) return null;

  // Form submit handler: closes modal and navigates to dashboard
  const onSubmit = () => {
    onClose();
    navigate("/dashboard");
  };

  return (
    // Modal overlay with backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop with blur effect, closes modal on click */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal content container */}
      <div
        className="relative w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-3xl shadow-2xl p-8 sm:p-10 z-10 border border-deepNavy/10"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close button in top-right corner */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-medGray hover:text-deepNavy transition"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Modal header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-deepNavy text-center mb-8">Welcome Back</h1>

        {/* Login form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email input field */}
          <div>
            <div className="flex items-center gap-3 bg-skyblue/10 p-4 rounded-2xl border border-skyblue/40 focus-within:ring-2 focus-within:ring-aqua transition">
              <MdAlternateEmail className="text-skyblue text-2xl" />
              <input
                type="email"
                placeholder="Email address"
                {...register("email")}
                className="bg-transparent flex-1 outline-none text-base placeholder:skyblue"
              />
            </div>
            {/* Display email validation error */}
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password input field with toggle visibility */}
          <div>
            <div className="relative flex items-center gap-3 bg-skyblue/10 p-4 rounded-2xl border border-skyblue/40 focus-within:ring-2 focus-within:ring-aqua transition">
              <FaFingerprint className="text-skyblue text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="bg-transparent flex-1 outline-none text-base placeholder:skyblue"
              />
              {/* Button to toggle password visibility */}
              <button
                type="button"
                onClick={togglePasswordView}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-skyblue hover:text-aqua transition"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {/* Display password validation error */}
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Remember me checkbox and forgot password link */}
          <div className="flex items-center justify-between text-sm text-deepNavy/70">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-aqua w-4 h-4" />
              Remember me
            </label>
            <a href="/forgot" className="text-aqua hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-4 bg-skyblue text-white rounded-2xl font-semibold text-lg hover:bg-aqua transform active:scale-95 transition"
          >
            Login
          </button>
        </form>

        {/* Divider with sign up link */}
        <div className="my-6 flex items-center">
           <div className="flex-grow h-[1px] bg-deepNavy/10"></div>
          <span className="px-3 text-sm text-deepNavy/60">
            Don’t have an account?{" "}
            <button type="button" className="text-aqua font-semibold hover:underline" onClick={onSignUpClick}>
              Sign up
            </button>
          </span>
          <div className="flex-grow h-[1px] bg-deepNavy/10"></div>
        </div>

        {/* Footer with terms and privacy links */}
        <p className="text-center text-xs text-deepNavy/50">
          By continuing you agree to our{" "}
          <a href="/terms" className="text-aqua hover:underline">
            Terms
          </a>{" "}
          &{" "}
          <a href="/privacy" className="text-aqua hover:underline">
            Privacy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
