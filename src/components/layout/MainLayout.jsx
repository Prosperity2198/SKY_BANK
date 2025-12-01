// MainLayout.jsx: Main layout component for dashboard pages, providing a responsive structure with sidebar and topbar.
// Imports React, Outlet for nested routing, and child components Sidebar and Topbar.
import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  // State to manage sidebar open/close for mobile view
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    // Main container with full screen height and background
    <div className="min-h-screen bg-gray-900">

      {/* Centered container with max width, padding, and relative positioning for sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-6 relative">

        {/* Flex container for layout structure */}
        <div className="flex gap-6">

          {/* Placeholder for desktop sidebar spacing */}
          <div className="hidden md:block w-72 pointer-events-none">

            {/* This div preserves horizontal spacing for the overlay sidebar */}
          </div>

          {/* Main content column */}
          <div className="flex-1 flex flex-col">

            {/* Topbar section with toggle function for sidebar */}
            <div className="mb-6">

              <Topbar onToggle={() => setSidebarOpen((s) => !s)} />
            </div>

            {/* Main content area with card styling and scrollable outlet */}
            <div className="bg-gray-800 rounded-2xl shadow-sm p-6 min-h-[75vh] max-h-[75vh] overflow-auto scrollbar-hide">
              <Outlet />
            </div>
          </div>
        </div>

        {/* Desktop overlay sidebar: Absolutely positioned within the container */}
        <div
          aria-hidden={false}
          className={`hidden md:block absolute left-6 top-6 bottom-6 w-72 z-40 pointer-events-auto`}
          style={{ willChange: "transform, opacity" }}
        >
          {/* Full height container for sidebar */}
          <div className="h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* Mobile slide-in overlay for sidebar */}
      <div
        aria-hidden={!sidebarOpen}
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        
        {/* Backdrop with blur effect for mobile overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sliding sidebar panel for mobile */}
        <div
          className={`absolute left-4 top-6 bottom-6 w-72 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 text-white p-6 shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>
    </div>
  );
}
