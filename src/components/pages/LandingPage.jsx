// LandingPage.jsx: Main landing page component for the Sky Bank app, displaying hero section, navbar, and modals for login/signup.
// Imports React hooks, navigation, modal components, and landing image asset.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./Signup";
import landingImg from "../../assets/landing.png";

// LandingPage component: Renders the public landing page with navbar, hero content, and modal toggles
const LandingPage = () => {
  // State to control login modal visibility
  const [isLoginOpen, setLoginOpen] = useState(false);
  // State to control signup modal visibility
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to open login modal
  const openLogin = () => setLoginOpen(true);

  // Function to handle redirect to dashboard after login/signup
  const handleDashboardRedirect = () => {
    setLoginOpen(false);
    setSignUpOpen(false);
    navigate("/dashboard");
  };

  return (
    <>
      {/* Navbar section with logo and login button */}
      <nav className="bg-deepNavy shadow-md z-50 relative">
        <div className="container mx-auto flex justify-between items-center py-4 md:py-6 px-6 md:px-8">
          {/* Logo section with brand name */}
          <div className="flex items-center gap-2 md:gap-3 font-bold uppercase text-2xl md:text-3xl">
            <span className="text-lightSky">SKY</span>
            <span className="text-white">BANK</span>
          </div>

          {/* Login button to open login modal */}
          <button
            onClick={openLogin}
            className="bg-skyblue text-white px-6 md:px-10 py-2 md:py-3 text-sm md:text-lg rounded-md hover:bg-lightSky transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero section with background gradient and content */}
      <section className="relative flex items-center overflow-hidden bg-softGray min-h-screen pt-10 sm:pt-20 md:pt-0">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-aqua/20 via-skyblue/20 to-lightSky/20 pointer-events-none"></div>

        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center md:items-stretch gap-10 px-6 md:px-8 relative z-10">
          {/* Left side: Text content and call-to-action */}
          <div className="flex-1 flex flex-col justify-center text-center md:text-left space-y-6 md:space-y-8">
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-deepNavy leading-tight">
              Welcome to <br /> Sky Bank
            </h1>
            {/* Subheading description */}
            <p className="text-deepNavy/90 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto md:mx-0">
              Experience fast, secure, and reliable digital banking built for the modern world. Your money, safely
              managed — anywhere under the sky.
            </p>

            {/* Get Started button to open signup modal */}
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <button
                onClick={() => setSignUpOpen(true)}
                className="bg-skyblue text-white px-8 md:px-12 py-3 md:py-4 text-base md:text-lg rounded-md hover:bg-lightSky transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Right side: Image with decorative elements */}
          <div className="flex-1 relative flex items-center justify-center w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
            {/* Decorative blur circles */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-aqua/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-lightSky/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            {/* Landing image */}
            <img
              src={landingImg}
              alt="Secure Cloud Banking Illustration"
              className="w-full relative rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105 md:scale-110 lg:scale-100"
            />
          </div>
        </div>
      </section>

      {/* Modals for login and signup */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onDashboardClick={handleDashboardRedirect}
        onSignUpClick={() => {
          setLoginOpen(false);
          setSignUpOpen(true);
        }}
      />

      <SignUp
        isOpen={isSignUpOpen}
        onClose={() => setSignUpOpen(false)}
        onDashboardClick={handleDashboardRedirect}
        onLoginClick={() => {
          setSignUpOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
};

export default LandingPage;
